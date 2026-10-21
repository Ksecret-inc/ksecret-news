// 슬랙 #홈페이지-소식 채널에서 ✅ 확인된 글을 site/posts.json 으로 옮깁니다.
// 필요한 환경 변수 (GitHub 저장소 Settings > Secrets and variables > Actions):
//   SLACK_BOT_TOKEN   xoxb- 로 시작하는 봇 토큰 (Secret)
//   SLACK_CHANNEL_ID  채널 ID, 예: C0123456789 (Variable)
//   APPROVER_IDS      (선택) 확인 권한자 슬랙 멤버 ID, 쉼표로 구분 (Variable)
//   APPROVE_EMOJI     (선택) 확인 이모지 이름, 기본값 white_check_mark (Variable)
//   OWNER_IDS         (선택) [일정]·[인사이트]를 올릴 수 있는 사람의 슬랙 멤버 ID, 쉼표로 구분 (Variable)

import { readFile, writeFile } from "node:fs/promises";

const TOKEN = process.env.SLACK_BOT_TOKEN;
const CHANNEL = process.env.SLACK_CHANNEL_ID;
const EMOJI = process.env.APPROVE_EMOJI || "white_check_mark";
const APPROVERS = (process.env.APPROVER_IDS || "").split(",").map(s => s.trim()).filter(Boolean);
const OWNERS = (process.env.OWNER_IDS || "").split(",").map(s => s.trim()).filter(Boolean);
const LOOKBACK_DAYS = 90;
const OUT = "site/posts.json";
const CATEGORIES = ["공지", "일정", "인사이트", "팀 이야기", "제품", "채용"];
const OWNER_ONLY = ["일정", "인사이트"];   // OWNER_IDS 를 넣으면 이 분류는 지정한 사람 글만 올라가요

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
// [일정] 글은 "일시:" "장소:" 줄을 따로 읽어 날짜순 정리에 씁니다.
function parse(text, postDate) {
  const lines = clean(text).split("\n");
  const first = lines.shift() || "";
  const m = first.match(/^\s*\[([^\]]+)\]\s*(.+)$/);
  let category = m && CATEGORIES.includes(m[1].trim()) ? m[1].trim() : "공지";
  const title = (m ? m[2] : first).trim();
  const extra = {};
  let rest = lines;
  if (category === "일정") {
    rest = [];
    for (const line of lines) {
      const kv = line.match(/^\s*(일시|날짜|시간|장소)\s*[:：]\s*(.+)$/);
      if (!kv) { rest.push(line); continue; }
      if (kv[1] === "장소") extra.place = kv[2].trim();
      else Object.assign(extra, parseWhen(kv[2], postDate, extra));
    }
    if (!extra.eventDate) {
      console.warn(`일정 날짜를 읽지 못해 공지로 올립니다: ${title}`);
      category = "공지"; rest = lines;
      for (const k of Object.keys(extra)) delete extra[k];
    }
  }
  return { category, title, body: rest.join("\n").trim(), ...extra };
}

// "2026-11-14 15:00", "11/14 오후 3시", "11월 14일(금) 오후 3시 30분" 등을 읽습니다.
function parseWhen(str, postDate, prev = {}) {
  const out = {};
  let s = str.replace(/\(.\)/g, " ");
  let y, mo, d;
  let r = s.match(/(\d{4})\s*[-./년]\s*(\d{1,2})\s*[-./월]\s*(\d{1,2})\s*일?/);
  if (r) { [y, mo, d] = [+r[1], +r[2], +r[3]]; s = s.replace(r[0], " "); }
  else if ((r = s.match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/)) || (r = s.match(/(\d{1,2})\s*[/.]\s*(\d{1,2})(?!\s*:)/))) {
    [mo, d] = [+r[1], +r[2]]; s = s.replace(r[0], " ");
    const [py, pm] = postDate.split("-").map(Number);
    y = py; if (mo < pm - 2) y = py + 1;          // 12월에 쓴 "1월 5일"은 다음 해
  }
  if (mo && d) out.eventDate = `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  let t = s.match(/(\d{1,2})\s*:\s*(\d{2})/), h, mi = 0;
  const pm = /오후|저녁|밤/.test(s), am = /오전|아침/.test(s);
  if (t) { h = +t[1]; mi = +t[2]; }
  else if ((t = s.match(/(\d{1,2})\s*시(?:\s*(\d{1,2})\s*분|\s*반)?/))) { h = +t[1]; mi = t[2] ? +t[2] : /반/.test(t[0]) ? 30 : 0; }
  if (h != null) {
    if (pm && h < 12) h += 12; if (am && h === 12) h = 0;
    if (h < 24 && mi < 60) out.eventTime = `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
  }
  return out;
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
  const date = seoulDate(msg.ts);
  const { title, ...rest } = parse(msg.text, date);
  if (!title) continue;
  if (OWNERS.length && OWNER_ONLY.includes(rest.category) && !OWNERS.includes(msg.user)) {
    console.warn(`지정된 작성자가 아니라 건너뜁니다: [${rest.category}] ${title}`);
    continue;
  }
  approved.push({ id: msg.ts, date, team: await teamOf(msg.user), title, ...rest });
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
