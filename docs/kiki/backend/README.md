# 리더보드 서버 연결 (Google Apps Script, 10분)

게임은 서버 없이도 동작하지만(기기 내 데모 랭킹), 전 세계 Top 50 랭킹과 경품 대상 추출을 하려면
아래처럼 구글 시트를 백엔드로 연결합니다. 별도 서버·비용 없음.

## 1. 시트 만들기
1. Google Drive → 새 스프레드시트 → 이름 예: `KIKI leaderboard`.
2. 메뉴 `확장 프로그램 → Apps Script` 클릭.
3. 편집기의 기본 코드를 지우고 `leaderboard.gs` 내용을 통째로 붙여넣기 → 저장.

## 2. 웹앱으로 배포
1. 우측 상단 `배포 → 새 배포`.
2. 유형: **웹 앱**. 설명: `kiki v1`.
3. 실행 주체: **나**. 액세스 권한: **모든 사용자**(익명 포함). → 배포.
4. 권한 승인 창이 뜨면 계정 선택 → "고급" → "이동" → 허용.
5. 나오는 **웹 앱 URL**(`https://script.google.com/macros/s/.../exec`)을 복사.

## 3. 게임에 URL 넣기
`site/kiki/index.html` 상단의 설정에서:
```js
const CONFIG = {
  LEADERBOARD_URL: 'https://script.google.com/macros/s/XXXX/exec',
  ...
```
push 하면 GitHub Pages 에 바로 반영됩니다. 이후 게임 종료 시 점수가 시트 `scores` 탭에 쌓이고,
랭킹 화면은 서버의 Top 50 을 보여줍니다(샘플 행은 더 이상 나오지 않음).

## 4. 운영
- **당첨자 추출**: Apps Script 편집기에서 `exportWinners` 함수 실행 → `winners` 탭에 1~5등과 이메일·SNS 핸들·선택한 피부 고민·추천된 요정(제품)이 정리됩니다. 이메일을 남기지 않은 사람은 "not eligible" 로 표시되니 다음 순위로 넘기면 됩니다.
- **시딩 활용**: `match` 열이 그 사람에게 게임이 추천한 제품(요정 id)입니다. 크리에이터에게는 이 제품을 보내면 "내 피부 고민에 맞는 제품을 받았다"는 경험이 됩니다. 요정 id ↔ 제품 표는 `docs/kiki/GAME_DESIGN.md` 3.2 참고.
- **같은 사람 중복**: 이메일이 같으면 최고 기록 1건만 랭킹에 올라갑니다. 이메일이 없으면 닉네임+국가 기준.
- **부정 제출 필터**: 체크섬이 안 맞거나, 밤 수 대비 점수/시간이 말이 안 되면 `rejected` 로 거부됩니다. (`leaderboard.gs` 상단 상수로 조정)
- **코드 수정 후**: `배포 → 배포 관리 → 연필 아이콘 → 버전: 새 버전 → 배포`. URL 은 그대로 유지됩니다.
- **이벤트 종료 후**: 개인정보(이메일) 열은 약속대로 삭제하세요. `scores` 탭의 D열을 지우면 됩니다.

## API (다른 백엔드로 바꿀 때 동일하게 맞추면 게임 수정 불필요)
- `GET {URL}?top=50` → `{ rows:[{ nickname, country, score, nights, maxCombo }], updatedAt }`
- `POST {URL}` (Content-Type: text/plain, body = JSON)
  `{ nickname, country, email, handle, age14, concerns, match, score, nights, maxCombo, dispelled, duration, version, lang, at, checksum }`
  (이메일이 있으면 `age14` 가 true 여야 저장됩니다. 만 14세 미만의 개인정보 수집을 막기 위한 장치)
  → `{ ok:true, rank, total }` 또는 `{ ok:false, error }`
- 체크섬: FNV-1a 32bit of `"{score}|{nights}|{duration}|{dispelled}|{SALT}"` (hex 8자리).

## 한계 (4차에서 교체 예정)
Apps Script 는 동시 접속이 많아지면 느려집니다(수백 명 동시 제출 수준까지는 괜찮음).
런칭 규모가 커지면 Cloudflare Workers + D1 또는 Supabase 로 같은 API 를 옮깁니다.
