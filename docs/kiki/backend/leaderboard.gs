/**
 * KIKI'S SECRET — Top 50 리더보드 백엔드 (Google Apps Script)
 *
 * 설치 방법은 같은 폴더의 README.md 참고.
 * 시트 구조: 'scores' 시트에 아래 열 순서로 쌓입니다.
 *   A at(ISO) | B nickname | C country | D email | E score | F nights | G maxCombo | H dispelled | I duration | J version | K lang | L checksum_ok | M ip_hash
 *
 * GET  ?top=50            → Top 50 JSON (이메일은 절대 반환하지 않음, 이메일당 최고 기록 1건)
 * POST (text/plain JSON)  → { ok:true, rank, total }
 */

var SHEET_NAME = 'scores';
var SALT = 'seoul1988-kiki-v1';            // 게임 index.html 의 CONFIG.SALT 와 반드시 같게
var MAX_SCORE_PER_NIGHT = 9000;            // 밤 하나당 이론적 최대치보다 넉넉하게 (부정 제출 1차 필터)
var MIN_SECONDS_PER_NIGHT = 12;            // 한 밤을 이보다 빨리 끝낼 수는 없음
var TOP_DEFAULT = 50;

function doGet(e) {
  var top = Math.min(200, Math.max(1, parseInt((e && e.parameter && e.parameter.top) || TOP_DEFAULT, 10) || TOP_DEFAULT));
  var rows = topRows_(top);
  return json_({ rows: rows, updatedAt: new Date().toISOString() });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var body = {};
    try { body = JSON.parse(e.postData.contents || '{}'); } catch (err) { return json_({ ok: false, error: 'bad_json' }); }

    var nickname = String(body.nickname || '').trim().slice(0, 16);
    var country = String(body.country || '').trim().toUpperCase().slice(0, 2);
    var email = String(body.email || '').trim().toLowerCase().slice(0, 120);
    var score = Math.max(0, Math.floor(Number(body.score) || 0));
    var nights = Math.max(0, Math.floor(Number(body.nights) || 0));
    var maxCombo = Math.max(0, Math.floor(Number(body.maxCombo) || 0));
    var dispelled = Math.max(0, Math.floor(Number(body.dispelled) || 0));
    var duration = Math.max(0, Math.floor(Number(body.duration) || 0));
    var version = String(body.version || '').slice(0, 16);
    var lang = String(body.lang || '').slice(0, 5);

    if (nickname.length < 2) return json_({ ok: false, error: 'nickname' });
    if (!country) return json_({ ok: false, error: 'country' });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json_({ ok: false, error: 'email' });

    // 1차 부정 방지: 체크섬 + 상한선
    var checksumOk = fnv1a_(score + '|' + nights + '|' + duration + '|' + dispelled + '|' + SALT) === String(body.checksum || '');
    var plausible = score <= (nights + 1) * MAX_SCORE_PER_NIGHT && duration >= nights * MIN_SECONDS_PER_NIGHT && dispelled <= (nights + 1) * 40;
    if (!checksumOk || !plausible) return json_({ ok: false, error: 'rejected' });

    var sheet = sheet_();
    sheet.appendRow([new Date().toISOString(), nickname, country, email, score, nights, maxCombo, dispelled, duration, version, lang, checksumOk ? 1 : 0, '']);

    var all = allRows_();
    var rank = 1;
    for (var i = 0; i < all.length; i++) {
      if (better_(all[i], { score: score, nights: nights, duration: duration })) rank++;
    }
    return json_({ ok: true, rank: rank, total: all.length });
  } finally {
    lock.releaseLock();
  }
}

/* ---------------- helpers ---------------- */
function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['at', 'nickname', 'country', 'email', 'score', 'nights', 'maxCombo', 'dispelled', 'duration', 'version', 'lang', 'checksum_ok', 'ip_hash']);
  }
  return sh;
}

function allRows_() {
  var sh = sheet_();
  var last = sh.getLastRow();
  if (last < 2) return [];
  var values = sh.getRange(2, 1, last - 1, 12).getValues();
  var best = {};   // 이메일(또는 닉네임+국가)당 최고 기록 1건만
  var out = [];
  for (var i = 0; i < values.length; i++) {
    var v = values[i];
    var row = { at: v[0], nickname: v[1], country: v[2], email: v[3], score: Number(v[4]) || 0, nights: Number(v[5]) || 0, maxCombo: Number(v[6]) || 0, duration: Number(v[8]) || 0 };
    var key = row.email ? 'e:' + row.email : 'n:' + String(row.nickname).toLowerCase() + '|' + row.country;
    if (!best[key] || better_(row, best[key])) best[key] = row;
  }
  for (var k in best) out.push(best[k]);
  out.sort(function (a, b) { return better_(a, b) ? -1 : better_(b, a) ? 1 : 0; });
  return out;
}

// a 가 b 보다 순위가 높으면 true. 점수 ▸ 밤 수 ▸ 플레이 시간(짧을수록) ▸ 먼저 제출
function better_(a, b) {
  if (a.score !== b.score) return a.score > b.score;
  if (a.nights !== b.nights) return a.nights > b.nights;
  if (a.duration !== b.duration) return a.duration < b.duration;
  return String(a.at) < String(b.at);
}

function topRows_(n) {
  var all = allRows_().slice(0, n);
  return all.map(function (r) { return { nickname: r.nickname, country: r.country, score: r.score, nights: r.nights, maxCombo: r.maxCombo }; });
}

function fnv1a_(s) {
  var h = 0x811c9dc5;
  for (var i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return ('00000000' + h.toString(16)).slice(-8);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** 당첨자(1~5등) 추출: 메뉴 또는 편집기에서 실행하면 'winners' 시트에 씁니다. */
function exportWinners() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var all = allRows_().slice(0, 5);
  var sh = ss.getSheetByName('winners') || ss.insertSheet('winners');
  sh.clear();
  sh.appendRow(['rank', 'nickname', 'country', 'email', 'score', 'nights', 'at']);
  all.forEach(function (r, i) { sh.appendRow([i + 1, r.nickname, r.country, r.email || '(no email: not eligible)', r.score, r.nights, r.at]); });
}
