# 케이시크릿 소식 홈페이지

슬랙 `#홈페이지-소식` 채널에 쓰고 ✅ 로 확인된 글이 자동으로 홈페이지에 올라갑니다.

```
site/index.html                       홈페이지
site/posts.json                       게시글 데이터 (자동 갱신, 직접 수정하지 않기)
scripts/sync-slack.mjs                슬랙에서 글을 가져오는 스크립트
.github/workflows/sync-and-deploy.yml 10분마다 동기화 + 배포
slack-app-manifest.yml                슬랙 앱 설정
```

## 설정 순서

### 1. GitHub 저장소 만들기
1. GitHub 에서 New repository → 이름 예: `ksecret-news` → **Public** 선택 → Create.
   (무료 플랜은 공개 저장소에서만 Pages 를 쓸 수 있어요. 비공개로 하려면 Team 이상 플랜 필요)
2. 이 폴더의 파일을 모두 올립니다. 웹에서 올릴 때는 `Add file → Upload files` 에 폴더째 끌어다 놓으세요.
   `.github` 폴더는 숨김 폴더라 맥에서는 Finder 에서 `Cmd + Shift + .` 을 눌러야 보여요. 이 폴더가 빠지면 자동화가 동작하지 않습니다.

### 2. GitHub Pages 켜기
저장소 `Settings → Pages → Build and deployment → Source` 를 **GitHub Actions** 로 바꿉니다.

### 3. 슬랙 채널 준비
1. `#홈페이지-소식` 채널을 만듭니다.
2. 채널 이름 클릭 → 맨 아래 **채널 ID**(C 로 시작) 를 복사해 둡니다.
3. 확인(✅) 권한자를 정할 경우, 그 사람 프로필 → `⋮` → **멤버 ID 복사**.

### 4. 슬랙 앱 만들기 (워크스페이스 관리자 승인이 필요할 수 있어요)
1. https://api.slack.com/apps → **Create New App → From a manifest** → 케이시크릿 워크스페이스 선택.
2. `slack-app-manifest.yml` 내용을 붙여넣고 Create.
3. **Install to Workspace** → 허용.
4. `OAuth & Permissions` 의 **Bot User OAuth Token**(xoxb- 로 시작) 을 복사합니다. 이 값은 비밀번호처럼 다뤄 주세요.
5. 슬랙 `#홈페이지-소식` 채널에서 `/invite @homepage-bot` 으로 봇을 초대합니다.

### 5. GitHub 에 설정값 넣기
저장소 `Settings → Secrets and variables → Actions`

| 탭 | 이름 | 값 |
|---|---|---|
| Secrets | `SLACK_BOT_TOKEN` | 4단계에서 복사한 xoxb- 토큰 |
| Variables | `SLACK_CHANNEL_ID` | 3단계의 채널 ID |
| Variables | `APPROVER_IDS` | (선택) 확인 권한자 멤버 ID, 여러 명이면 쉼표로 구분 |
| Variables | `APPROVE_EMOJI` | (선택) 다른 이모지를 쓸 때만. 기본값 `white_check_mark` |

`APPROVER_IDS` 를 비워 두면 누구든 ✅ 를 누르면 게시됩니다. 외부 공개 홈페이지이니 지정하는 걸 권해요.

### 6. 첫 배포
`Actions` 탭 → **슬랙 소식 동기화 및 배포** → **Run workflow**.
초록색 체크가 뜨면 `Settings → Pages` 에 주소가 나옵니다. 보통 `https://<계정명>.github.io/ksecret-news/`

### 7. 실제로 올려보기
슬랙 `#홈페이지-소식` 에 아래처럼 쓰고, 권한자가 ✅ 를 누릅니다. 10분 안팎으로 홈페이지에 나타나요.

```
[팀 이야기] 새 패키지 시안을 벽에 붙였어요
지나가다 마음에 드는 시안에 스티커 하나씩 붙여 주세요.
```
분류는 `공지`, `일정`, `팀 이야기`, `제품`, `채용` 중 하나. 없거나 다르면 `공지` 로 올라갑니다.
`공지`와 `일정`은 홈페이지의 **피플팀 안내** 영역에, 나머지는 **소식** 영역에 보여요.

일정은 아래처럼 `일시:` `장소:` 줄을 넣어 주세요. 다가오는 일정만 날짜순으로 보이고, 지난 일정은 저절로 내려가요.
```
[일정] 하반기 타운홀
일시: 11월 14일 오후 3시
장소: 7층 라운지
상반기 결과와 내년 계획을 함께 나눠요.
```
날짜는 `2026-11-14`, `11/14`, `11월 14일` 모두 읽고, 시간은 `15:00`, `오후 3시`, `오후 3시 30분`, `3시 반`을 읽어요. 날짜를 읽지 못하면 공지로 올라가요.
팀명은 글쓴이 슬랙 프로필의 '직함' 앞부분(예: `BX팀 / 디자이너` → `BX팀`)에서 가져와요.

### 8. (선택) 회사 도메인 연결
`Settings → Pages → Custom domain` 에 예: `news.ksecret.com` 입력 →
도메인 DNS 에 `CNAME news → <계정명>.github.io` 추가 → 확인되면 **Enforce HTTPS** 체크.

## 운영 안내

- **수정**: 슬랙에서 글을 고치면 다음 동기화 때 홈페이지도 바뀝니다.
- **내리기**: ✅ 를 지우거나 슬랙 글을 삭제하면 내려갑니다. 단, 90일이 지난 글은 홈페이지에 고정되므로 내릴 때는 `site/posts.json` 에서 해당 항목을 지워 주세요.
- **디자인 수정**: `site/index.html` 을 고쳐 push 하면 바로 배포됩니다.
- **예약 실행이 멈췄을 때**: 공개 저장소는 60일 동안 활동이 없으면 예약 실행이 꺼질 수 있어요. `Actions` 탭에서 워크플로를 다시 Enable 하세요.
- **문제 해결**: `Actions` 탭에서 실패한 실행을 열면 원인이 나옵니다.
  - `not_in_channel` → 봇을 채널에 초대하지 않음
  - `invalid_auth` → 토큰을 잘못 넣음
  - `missing_scope` → 앱 설치 후 권한이 바뀜, 앱을 재설치
  - `channel_not_found` → 채널 ID 확인
