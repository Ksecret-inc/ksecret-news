// 슬랙 #홈페이지-소식 채널에서 ✅ 확인된 글을 site/posts.json 으로 옮깁니다.
// 필요한 환경 변수 (GitHub 저장소 Settings > Secrets and variables > Actions):
//   SLACK_BOT_TOKEN   xoxb- 로 시작하는 봇 토큰 (Secret)
//   SLACK_CHANNEL_ID  채널 ID, 예: C0123456789 (Variable)
//   APPROVER_IDS      (선택) 확인 권한자 슬랙 멤버 ID, 쉼표로 구분 (Variable)
//   APPROVE_EMOJI     (선택) 확인 이모지 이름, 기본값 white_check_mark (Variable)

import { readFile, writeFile } from "node:fs/promises";

const TOKEN = process.env.SLACK_BOT_TOKEN;
const CHANNEL = process.env.SLACK_CHANNEL_ID;
const EMOJI = process.env.APPROVE_EMOJI || "white_check_mark";
const APPROVERS = (process.env.APPROVER_IDS || "").split(",").map(s => s.trim()).filter(Boolean);
const LOOKBACK_DAYS = 90;
const OUT = "site/posts.json";
const CATEGORIES = ["공지", "팀 이야기", "제품", "채용"];

if (!TOKEN || !CHANNEL) {
  console.error("SLACK_BOT_TOKEN 과 SLACK_CHANNEL_ID 를 설정해 주세요.");
  process.exit(1);
}

async function slack(method, params) {
  const url = `https://slack.com/api/${method}?${new URLSearchParams(params)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  const data = await res.json();
  if (!data.ok) throw new Error(`${method} 실패: ${data.error}`);
  return data;
}

// 슬랙 서식을 일반 텍스트로 바꿉니다.
function clean(text) {
  return text
    .replace(/<@[A-Z0-9]+(\|[^>]+)?>/g, "")          // 멘션 제거
    .replace(/<#[A-Z0-9]+\|([^>]+)>/g, "#$1")          // 채널 링크
    .replace(/<!(here|channel|everyone)>/g, "")        // 전체 알림 제거
    .replace(/<(https?:[^|>]+)\|([^>]+)>/g, "$2 ($1)") // 이름 붙은 링크
    .replace(/<(https?:[^>]+)>/g, "$1")
    .replace(/[*_~]/g, "")                             // 굵게/기울임/취소선 기호
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

// 첫 줄 "[분류] 제목", 다음 줄부터 본문
function parse(text) {
  const lines = clean(text).split("\n");
  const first = lines.shift() || "";
  const m = first.match(/^\s*\[([^\]]+)\]\s*(.+)$/);
  const category = m && CATEGORIES.includes(m[1].trim()) ? m[1].trim() : "공지";
  const title = (m ? m[2] : first).trim();
  const body = lines.join("\n").trim();
  return { category, title, body };
}

function isApproved(msg) {
  const r = (msg.reactions || []).find(x => x.name === EMOJI);
  if (!r) return false;
  if (!APPROVERS.length) return true;
  return r.users.some(u => APPROVERS.includes(u));
}

function seoulDate(ts) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date(Number(ts) * 1000));
}

const teamCache = {};
async function teamOf(userId) {
  if (!userId) return "";
  if (userId in teamCache) return teamCache[userId];
  try {
    const { user } = await slack("users.info", { user: userId });
    // 슬랙 프로필의 '직함' 칸에 적힌 팀명 앞부분만 사용 (예: "BX팀 / 디자이너" → "BX팀")
    teamCache[userId] = (user.profile.title || "").split(/[\/·|,]/)[0].trim();
  } catch {
    teamCache[userId] = ""; // users:read 권한이 없으면 팀명 없이 게시
  }
  return teamCache[userId];
}

// 1) 최근 기록 가져오기
const oldest = String(Math.floor(Date.now() / 1000) - LOOKBACK_DAYS * 86400);
const messages = [];
let cursor;
for (let page = 0; page < 10; page++) {
  const data = await slack("conversations.history", { channel: CHANNEL, oldest, limit: "200", ...(cursor ? { cursor } : {}) });
  messages.push(...data.messages);
  cursor = data.response_metadata?.next_cursor;
  if (!cursor) break;
}

// 2) 확인된 일반 글만 변환
const fetchedIds = new Set();
const approved = [];
for (const msg of messages) {
  if (msg.subtype || !msg.text) continue; // 입장 알림, 봇 메시지 등 제외
  fetchedIds.add(msg.ts);
  if (!isApproved(msg)) continue;
  const { category, title, body } = parse(msg.text);
  if (!title) continue;
  approved.push({ id: msg.ts, date: seoulDate(msg.ts), category, team: await teamOf(msg.user), title, body });
}

// 3) 기존 목록과 합치기
//    - 조회 범위 안의 글: 슬랙 내용으로 갱신, ✅ 가 빠진 글은 내림
//    - 조회 범위 밖의 오래된 글: 그대로 유지
let existing = [];
try { existing = JSON.parse(await readFile(OUT, "utf8")); } catch { existing = []; }
const kept = existing.filter(p => !fetchedIds.has(p.id) && Number(p.id) < Number(oldest));
const next = [...approved, ...kept].sort((a, b) => Number(b.id) - Number(a.id));

const before = JSON.stringify(existing);
const after = JSON.stringify(next);
if (before === after) {
  console.log("바뀐 소식이 없습니다.");
} else {
  await writeFile(OUT, JSON.stringify(next, null, 2) + "\n");
  console.log(`소식 ${next.length}건으로 갱신했습니다.`);
}
