# KIKI'S SECRET — 게임 기획서 (1차)

> SEOUL 1988 글로벌 캠페인 게임. LA 고등학교의 퀸카 Kiki의 유리 피부를 밤마다 지켜주는
> 서울의 뷰티 요정(= 케이시크릿 제품)들의 이야기.
>
> 문서 버전: v5 (5차 산출물, 10~13장 참고) · 1차 2026-11-06 · 2차 2026-11-07 · 플레이: `site/beautysecret/index.html`

---

## 0. 한눈에 보기

| 항목 | 내용 |
|---|---|
| 제목 | **KIKI'S SECRET** (키키의 비밀) · 부제 "Glass Skin Guardians" |
| 장르 | 모바일/웹 캐주얼 디펜스 (탭 매칭 + 타임 프레셔) |
| 플레이 시간 | 1판 3~6분 (7박 스토리 + 무한 모드) |
| 플랫폼 | 모바일 브라우저 우선, 데스크톱 지원. 설치 없음. 단일 HTML |
| 언어 | 영어 기본, 한국어 토글 (우상단) |
| 핵심 루프 | 저주 등장 → 맞는 요정 선택 → 저주에 적용 → 점수/콤보 → 밤 클리어 |
| 마케팅 장치 | 요정 = 실제 제품. 도감(Codex)에서 제품 효능/링크 노출. 종료 시 Top 50 랭킹, 1~5등 제품 증정 |
| 데이터 수집 | 닉네임(필수), 국가(필수), 이메일(선택, 경품 수령 시 필수), 동의 체크 |

---

## 1. 세계관 & 내러티브

**Kiki (17, LA Westgate High)**. 학교에서 "glass skin"으로 유명한 인기 많은 소녀. 비밀은 밤마다 서울에서 날아온 뷰티 요정들이 피부를 축복해 준다는 것. 매일 밤 피부 트러블 저주(여드름·기미·주근깨·주름·건조·모공·칙칙함·다크서클)가 얼굴을 덮치고, 요정들이 아침이 오기 전에 이를 걷어낸다.

플레이어는 요정들의 지휘관. **일주일(월~일, 7박)** 동안 Kiki의 비밀을 지키고, 일요일 밤(프롬 전야)을 넘기면 "비밀 수호자(Secret Keeper)"가 된다. 이후 무한 모드로 계속 밤을 버티며 점수를 쌓는다.

### 밤마다의 한 줄 대사 (밤 시작 화면)

| 밤 | 요일 | 제목 | Kiki의 한마디 (EN) | 신규 요소 |
|---|---|---|---|---|
| 1 | Mon | First Night | "Chem test tomorrow. Please, fairies." | 여드름·기미 / Nia, Cica |
| 2 | Tue | Fine Lines | "I laughed too hard at lunch. Is that… a line?" | 주름 / Retinal Serum |
| 3 | Wed | The Eye Trap | "Stayed up for the group chat. My eyes…" | 눈가 저주 + **눈가 함정** / Eye Cream |
| 4 | Thu | Dry Spell | "Santa Ana winds all day. My cheeks feel like paper." | 건조 / Snail Essence + 슬리핑 마스크(파워업) |
| 5 | Fri | Clogged | "Pizza night. Don't ask." | 모공·블랙헤드 / Cleansing Foam + 하이드로겔 마스크(파워업) |
| 6 | Sat | Party Glow | "Beach party at noon. Freckles incoming." | 칙칙함·주근깨, 3단계 저주 / Glow Serum, Advanced Shot |
| 7 | Sun | Prom Eve | "Prom is tomorrow. Everything depends on tonight." | 모든 저주 / TXA Shot, Eye Patch |
| 8+ | — | Endless | "Another night. The fairies never sleep." | 난이도 상승, 랭킹 변별 |

---

## 2. 핵심 메커니즘

### 2.1 얼굴 존 (Zone)
Kiki의 얼굴은 7개 존으로 나뉜다. 저주는 종류별로 정해진 존에만 나타난다.

```
        [ forehead ]
   [L eye]      [R eye]
        [ nose ]
 [L cheek]      [R cheek]
        [ chin ]
```

- **눈가 존(L eye / R eye)은 특수 존.** 눈가에 떨어진 저주는 **눈가 전용 요정(Eye Cream, Eye Patch)으로만** 처리할 수 있다. 다른 요정을 쓰면 "함정" 발동(2.4 참고).

### 2.2 저주 (Curse) — 1~3단계
모든 저주는 1단계로 나타나 시간이 지나면 2단계 → 3단계로 자란다. 3단계에서 또 시간이 지나면 피부에 **고착(Set)** 되어 Glow(체력)를 깎는다.

| 단계 | 크기 | 필요 파워 | 점수 (기본) |
|---|---|---|---|
| 1 | 작음 | 1 | 100 |
| 2 | 중간 | 2 | 200 |
| 3 | 큼, 붉은 테두리 | 3 | 300 |

- 요정의 **파워**만큼 단계를 깎는다. 파워 1 요정을 3단계에 쓰면 2단계로 내려간다(여러 번 탭하면 결국 제거 가능 → 막히는 상황 없음).
- 파워 3 "샷" 요정은 3단계를 한 번에 제거한다. 대신 **횟수 제한**.

### 2.3 요정 (Fairy) = 제품
요정은 세 계열로 나뉜다. 브랜드의 "농도 단계 시스템(1% → 2% → 12%)"을 그대로 게임 룰로 옮겼다.

| 계열 | 제품 유형 | 파워 | 쿨다운 | 특징 |
|---|---|---|---|---|
| 크림/에센스/클렌저 | Cream, Essence, Foam, Eye Cream | 1 | 1.0초 | 빠르고 가볍다. 기본기 |
| 세럼/패치 | Serum, Eye Patch | 2 | 2.4초 | 강하지만 느리다 |
| 샷 (앰플) | Advanced Shot, TXA Shot | 3 | 0 | 밤마다 3회 제한. 3단계 저주에 쓰면 "Precision Shot" 보너스 |

### 2.4 함정 (Trap) 규칙
- **눈가 함정**: 눈가 존의 저주에 눈가 전용이 아닌 요정을 쓰면 → "Ouch! Too strong for the eye area." Kiki가 찡그리고, 그 요정은 3초 기절, 저주는 **1단계 성장**, -50점, 콤보 리셋.
- **미스매치**: 상성이 맞지 않는 요정을 쓰면 → 요정 1.5초 쿨다운, -20점, 콤보 리셋. 저주는 그대로.
- **샷 낭비**: 1단계 저주에 샷을 쓰면 제거는 되지만 보너스 없이 횟수만 소모(경고 토스트).
- 2차 이후 추가 예정: "가짜 저주(Decoy)", "번지는 저주(Spreader)", "새벽 러시(Dawn Rush, 선크림 쉴드)".

### 2.5 Glow 미터 (체력)
- 시작 100. 저주가 고착되면 -12 (눈가 저주 -15).
- 밤 클리어 시 +10, 퍼펙트(고착 0) 시 +20. 최대 100.
- Glow가 떨어질수록 피부 하이라이트가 사라지고 톤이 칙칙해진다(시각 피드백).
- 0이 되면 **"Morning came. Kiki's secret is out."** → 게임 오버.

### 2.6 밤 진행
- 밤마다 **처리해야 할 저주 수(quota)** 가 정해져 있다. 모든 저주가 제거/고착되면 밤 종료 → 요약 화면 → 다음 밤.
- 밤이 깊어질수록 등장 간격·성장 간격이 짧아지고, 2·3단계로 시작하는 저주 비율이 늘어난다.

| 밤 | quota | 등장 간격 | 성장 간격 | 동시 최대 | 시작단계 비율 (1/2/3) |
|---|---|---|---|---|---|
| 1 | 10 | 2.6s | 7.0s | 4 | 100 / 0 / 0 |
| 2 | 14 | 2.3s | 6.5s | 5 | 85 / 15 / 0 |
| 3 | 16 | 2.1s | 6.0s | 5 | 75 / 25 / 0 |
| 4 | 18 | 1.9s | 5.5s | 6 | 65 / 30 / 5 |
| 5 | 20 | 1.7s | 5.0s | 6 | 55 / 35 / 10 |
| 6 | 22 | 1.55s | 4.6s | 7 | 45 / 40 / 15 |
| 7 | 26 | 1.4s | 4.2s | 8 | 35 / 45 / 20 |
| 8+ | 26 + 2·(n−7) | max(0.8, 1.4 − 0.07·(n−7)) | max(2.8, 4.2 − 0.15·(n−7)) | min(10, 8 + ⌊(n−7)/2⌋) | 3단계 비율 점증 |

### 2.7 파워업 (한 밤에 1회)
| 파워업 | 제품 | 효과 | 해금 |
|---|---|---|---|
| Night Shield | SEOUL 1988 Sleeping Mask : Collagen Complex 7 + Red Bean | 6초간 모든 저주 성장 정지 + Glow +15 | 4번째 밤 |
| Glow Burst | SEOUL 1988 Hydrogel Mask : Retinal Liposome + Lotus Flower | 얼굴 위 **1단계** 저주 전부 제거 | 5번째 밤 |

---

## 3. 저주 ↔ 요정(제품) 매칭표

### 3.1 저주 목록

| id | 이름 (EN) | 이름 (KO) | 등장 존 | 해금 밤 | 카운터 요정 |
|---|---|---|---|---|---|
| acne | Pimple Imp | 여드름 저주 | 볼·턱·이마·코 | 1 | Cica |
| spot | Shadow Stain | 기미 저주 | 볼·이마 | 1 | Nia(1) · Glow(2) · TXA Shot(3) |
| wrinkle | Crease Crone | 주름 저주 | 이마·턱 | 2 | Retinal Serum(2) · Advanced Shot(3) |
| eye_dark | Night Shadow | 다크서클 저주 | **눈가만** | 3 | Eye Cream(1) · Eye Patch(2) |
| eye_line | Crow's Feet | 눈가 주름 저주 | **눈가만** | 3 | Eye Cream(1) · Eye Patch(2) |
| dry | Desert Dust | 건조 저주 | 볼·턱 | 4 | Snail Essence(1) |
| pore | Goo Goblin | 모공·블랙헤드 저주 | 코·이마·턱 (T존) | 5 | Cleansing Foam(1) |
| dull | Grey Fog | 칙칙함 저주 | 볼·이마 | 6 | Glow(2) · Nia(1) |
| freckle | Sun Sprinkle | 주근깨 저주 | 볼·코 | 6 | Nia(1) · Glow(2) · TXA Shot(3) |

### 3.2 요정 목록 (제품 매칭)

| id | 요정 이름 | 실제 제품 (글로벌 표기) | 국문 제품명 | 파워 | 상대 저주 | 해금 밤 |
|---|---|---|---|---|---|---|
| nia | **Nia** | SEOUL 1988 Capsule Cream : Niacinamide 5% + Yuja | 서울 1988 나이아신 유자 캡슐 크림 | 1 | spot, freckle, dull | 1 |
| cica | **Cica** | SEOUL 1988 Repair Cream : Niacica 20% + Mugwort | 서울 1988 나이아시카 쑥 리페어 크림 | 1 | acne | 1 |
| retinal | **Retina** | SEOUL 1988 Serum : Retinal Liposome 2% + Black Ginseng | 서울 1988 레틴알 흑삼 세럼 | 2 | wrinkle | 2 |
| eyecream | **Bean** | SEOUL 1988 Eye Cream : Retinal Liposome 4% + Fermented Bean | 서울 1988 레틴알 발효콩 아이크림 | 1 | eye_dark, eye_line (눈가 전용) | 3 |
| snail | **Snail** | SEOUL 1988 Essence : Snail Mucin 97% + Rice | 서울 1988 달팽이 쌀 에센스 | 1 | dry | 4 |
| foam | **Pine** | SEOUL 1988 Cleansing Foam : Pine Cica 1% + Probiotics | 서울 1988 파인시카 클렌징 폼 | 1 | pore | 5 |
| glow | **Yuja** | SEOUL 1988 Glow Serum : Niacinamide 15% + Yuja | 서울 1988 나이아신 15% 유자 글로우 세럼 | 2 | spot, dull, freckle | 6 |
| ashot | **Shot 12** | SEOUL 1988 Advanced Shot : Retinal Liposome 12% + Black Rice | 서울 1988 레틴알 12% 흑미 어드밴스드 샷 | 3 (3회) | wrinkle | 6 |
| txa | **TXA** | SEOUL 1988 TXA Shot : TXA + Niacinamide + Rice | 서울 1988 TXA 샷 | 3 (3회) | spot, freckle | 7 |
| eyepatch | **Patch** | SEOUL 1988 Retinal Glow Eye Patch : Reti-NAD + Turmeric | 서울 1988 레틴알 글로우 아이패치 | 2 | eye_dark, eye_line (눈가 전용) | 7 |

파워업 2종(슬리핑 마스크, 하이드로겔 마스크)은 2.7 참고.

### 3.3 2차 이후 투입 후보 (카탈로그에 있으나 1차 미사용)
- Cleansing Oil : Pine Cica 1% + Probiotics → "더블 클렌징 콤보"(오일 → 폼 순서로 쓰면 모공 저주 즉시 제거)
- Cream : Retinal Liposome 1% + Fermented Rice → 주름 파워 1 (초반 밤용)
- Boosting Serum : Collagen Complex 7 + Red Ginseng / Boosting Ball : Collagen 100% → "탄력 저하(처짐) 저주"
- Cream/Essence : Snail Mucin 93%/97% → 홍조·민감 저주
- Multi Balm : Collagen Complex 7 + Plum → 어디서나 쓰는 응급 밤(건조 즉시 제거, 쿨다운 김)
- Refining Pad : C-Retinal + Bamboo → 각질/결 저주
- PDRN Shot : PDRN + NAD + Mung Bean → 여드름 3단계 샷 + Glow 회복
- Daily Gel Cleanser : Retinal Liposome + Pear → 모공 파워 1 (초반용)
- Sun : Collagen Complex 7 + Plum / Pine Tree + Ceramide → "새벽 러시" 주근깨 쉴드

---

## 4. 점수 · 콤보 · 랭킹

| 이벤트 | 점수 |
|---|---|
| 저주 제거 (단계 s) | 100 × s × 콤보 배율 |
| 콤보 | 정답 히트마다 +1. 배율 = 1 + 0.1 × min(콤보, 20) → 최대 3.0 |
| Instant Glow | 등장 2초 안에 제거 +50 |
| Delicate Touch | 눈가 저주를 눈가 전용 요정으로 제거 +100 |
| Precision Shot | 3단계 저주에 샷 사용 +150 |
| 밤 클리어 | +500 × 밤 번호 |
| Perfect Night | 고착 0 → +1000 |
| 미스매치 | −20, 콤보 리셋 |
| 눈가 함정 | −50, 콤보 리셋, 저주 +1단계, 요정 3초 기절 |

**랭킹 정렬**: 점수 ▸ 버틴 밤 수 ▸ 플레이 시간(짧을수록) ▸ 먼저 제출한 순.
**Top 50** 만 노출. 1~5등은 경품(제품) 대상 → 이메일 필수.

---

## 5. 게임 종료 & 데이터 수집 흐름

1. 게임 오버(또는 "Stop here" 버튼으로 자진 종료) → 결과 화면: 점수, 버틴 밤, 최대 콤보, 제거한 저주 수, "오늘 밤 Kiki를 구한 요정" 3개(제품 링크).
2. **랭킹 등록 폼**
   - 닉네임 (2~16자, 필수)
   - 국가 (드롭다운, 필수)
   - 이메일 (선택. 비우면 랭킹에는 올라가지만 경품 대상 제외. 입력 시 동의 체크 필수)
   - 동의 문구: "경품 안내 목적으로만 사용하며 이벤트 종료 후 삭제합니다."
3. 제출 → Top 50 리더보드 (내 순위 강조, 국기 표시). 50위 밖이면 "현재 #N / Top 50까지 N점".
4. 다시 하기 / 친구에게 공유(링크 복사).

### 5.1 리더보드 백엔드 (1차 제공: Google Apps Script)
- `docs/kiki/backend/leaderboard.gs` 를 Google 시트에 붙여 웹앱으로 배포 → URL을 `site/beautysecret/index.html` 상단 `CONFIG.LEADERBOARD_URL` 에 입력.
- `POST` { nickname, country, email, score, nights, maxCombo, duration, checksum, version } → { ok, rank, total }
- `GET ?top=50` → [{ nickname, country, score, nights }] (이메일은 절대 반환하지 않음)
- URL 미설정 시 브라우저 로컬(기기 내) 랭킹으로 동작 (데모용 샘플 행 표시).
- 부정 방지 1차: 점수 상한 검증(밤 수 × 최대치), 체크섬, 이메일당 최고 기록만 유지. 2차+: 시드 기반 리플레이 검증.

---

## 6. 화면 구성 (1차 구현 범위)

| 화면 | 내용 |
|---|---|
| Title | 로고, Kiki 일러스트, Play / How to play / Codex / Leaderboard, 언어 토글, 사운드 토글 |
| How to play | 3장 카드: ① 저주를 요정으로 ② 1~3단계 ③ 눈가는 아이크림만 |
| Night intro | "Night 3 · Wednesday · The Eye Trap" + Kiki 대사 + 새 요정/저주 소개 |
| Play | 상단 HUD(밤·점수·콤보·Glow바·진행), 중앙 Kiki 얼굴(저주 등장), 하단 요정 덱(최대 10) + 파워업 |
| Night summary | 제거/고착/퍼펙트, 밤 보너스, Glow 변화 |
| Game over / Secret Keeper | 결과 + 랭킹 등록 폼 |
| Leaderboard | Top 50, 국기, 내 순위 |
| Codex | 요정 10 + 파워업 2 카드: 제품 사진 자리, 효능, 상대 저주, 구매 링크 |

조작: 요정 카드 탭(또는 숫자키 1~0) → 저주 탭. 드래그도 지원. 선택한 요정은 커서를 따라다니는 반짝이로 표시.

---

## 7. 아트 디렉션
- SEOUL 1988 공식 팔레트 계승: 크림 보틀(#EAE4CF), 버터(#E6E0B5), 레드 라벨(#C64046). 밤 배경은 깊은 남색(#141224).
- Kiki: 단순한 벡터 일러스트(눈 감고 자는 모습, 트랩 시 찡그림). 유리 피부 하이라이트가 Glow에 따라 변함.
- 저주: 귀여운 악당(작은 눈 + 단계 핍). 요정: 제품 보틀 실루엣 + 날개 + 성분 아이콘. 실제 제품 사진은 2차에 도감/결과 화면에 삽입.
- 서체: Oswald(숫자·제목), IBM Plex Sans KR(본문) — 케이시크릿 소식 홈페이지와 동일.

---

## 8. 로드맵 (1차 → 5차)

| 차수 | 목표 | 주요 작업 |
|---|---|---|
| **1차 (이번)** | 플레이 가능한 코어 | 저주 9종·요정 10종·파워업 2종, 7박+무한, 눈가 함정, 점수/콤보, EN/KO, 결과 폼, Top 50 UI, Apps Script 백엔드 |
| 2차 | 피드백 반영 + 깊이 | 밸런스 튜닝, 새벽 러시(선크림), 더블 클렌징 콤보, 실제 제품 사진, 사운드 강화, 튜토리얼 개선 |
| 3차 | 리텐션/확산 | 일일 도전(시드 고정), 공유 카드 이미지(OG), 친구 초대 보너스, 국가별 랭킹 탭 |
| 4차 | 운영 | 실 백엔드(Cloudflare Workers/Supabase) + 부정 방지, 관리자 대시보드(당첨자 추출, 이메일 내보내기), 개인정보 처리 정책 링크 |
| 5차 | 런칭 | 브랜드 QA, 다국어(ES/JA/AR 등), 성능 최적화, 광고 랜딩/UTM, 이벤트 기간 설정·종료 화면 |

---

## 9. 1차에서 확인받고 싶은 것 (피드백 포인트)
1. 톤앤매너: 밤 배경 + 크림/레드 브랜드 색 조합이 SEOUL 1988 답게 보이는지.
2. 난이도 곡선: 1~3번째 밤이 너무 쉽거나/어렵지 않은지(목표: 첫 판 4번째 밤 전후 탈락).
3. 제품 매칭: 표 3.2의 매칭이 실제 제품 포지셔닝과 맞는지 (특히 Glow Serum vs Capsule Cream 역할 분담).
4. 눈가 함정 페널티 강도.
5. 수집 항목/동의 문구, 경품 규정 문구.
6. 요정 이름(Nia, Cica, Retina, Bean, Snail, Pine, Yuja, Shot 12, TXA, Patch) 과 저주 이름의 톤.

---

## 10. 2차 변경 — 타깃·톤 재설정 (v2, 2026-11-07)

### 10.1 누구에게, 무엇을 남길 것인가
- **타깃**: 시딩을 받을 크리에이터, 제품을 고려 중인 고객. 10~20대 여성.
- **남길 인식**: "이 트러블엔 이 제품." 게임의 모든 화면이 같은 한 쌍(저주 ↔ 요정 = 제품)을 반복해서 보여준다.
- **톤**: 귀엽고 센티멘탈. 키키의 일기 톤(친구, 할머니, 아빠, 첫사랑, 프롬)으로 감정선을 만들고, 요정은 성격을 가진 친구로 소개한다.

### 10.2 "트러블 ↔ 제품" 각인 루프 (5번 반복)
| 순서 | 장치 | 노출 내용 |
|---|---|---|
| 1 | **내 피부 고민 선택** (시작 직후) | 9개 고민 카드마다 담당 요정 이름 표기. 최대 2개 선택 → 그 저주가 1.8배 자주 등장, 밤 1 소개에 "나의 요정"으로 제품명 노출 |
| 2 | **요정의 속삭임** (저주 첫 등장) | 얼굴 아래 말풍선: "기미는 Nia로 옅어져요. 나이아신아마이드 5% + 유자, 매일 밤." + 해당 요정 카드 점프 |
| 3 | **오늘 밤의 레슨** (밤 요약) | 그 밤에 나온 저주 → 요정 → 제품명 플래시카드 |
| 4 | **나의 피부 매치** (결과) | 선택한 고민 우선, 없으면 가장 많이 물리친 저주 기준으로 제품 2개 + 이유("오늘 밤 기미 7개를 물리쳤어요") + 구매 링크 |
| 5 | **요정 앨범** | 성격 한 줄 + 키키의 메모(일기 톤) + 제품 설명 + 링크 |

### 10.3 센티멘탈 스토리 아크 (7박 일기)
월 시험 불안 → 화 친구와 웃음 → 수 단톡방, "비현실적 피부" → 목 할머니 로션 냄새 → 금 아빠와 피자, 엄마를 닮았다 → 토 첫사랑의 인사, 주근깨 → 일 프롬 전야의 두려움.
엔딩(7박 완주): "비밀은 요정이 아니었어. 누군가 매일 밤 내 피부를 돌봐줬다는 것. 내일부터는 키키가 직접 할 거야." → 브랜드 메시지 = 매일 밤의 셀프케어.

### 10.4 공유 (크리에이터 확산)
- 결과 화면에서 인스타 4:5(1080×1350) 공유 카드를 브라우저에서 생성: 키키 + 나의 요정 + 제품명 + 점수 + 해시태그.
- 이미지 저장 / 기기 공유(Web Share) / 캡션 복사. 캡션 예: "I guarded Kiki's secret for 5 nights with 12,000 points 🌙 My fairy is Nia (SEOUL 1988 Capsule Cream : Niacinamide 5% + Yuja) ✨ #KikisSecret #SEOUL1988 #KSECRET"

### 10.5 데이터 (시딩 운영용)
제출 항목에 추가: SNS 핸들(선택), 만 14세 이상 확인(이메일 입력 시 필수), 선택한 고민, 추천된 요정(제품).
→ 당첨자/상위 크리에이터에게 **게임이 추천한 바로 그 제품**을 보내면 "내 고민에 맞는 제품을 받았다"는 경험이 된다.

### 10.6 주의: 연령
10대 초반 유입을 고려해 이메일 수집에 만 14세 이상 확인을 넣었다(국내 개인정보보호법 기준, 미국 COPPA는 13세). 14세 미만은 이메일 없이 랭킹만 참여한다. 런칭 전 법무 검토 필요.

### 10.7 3차에서 확인받고 싶은 것
1. 키키 캐릭터와 요정 얼굴의 귀여움 수위 (더 과감하게 캐릭터화할지)
2. 일기 문장의 톤이 10~20대에게 자연스러운지 (특히 한국어판)
3. 속삭임 노출 시간(4.2초)과 문장 길이
4. 공유 카드 레이아웃과 해시태그
5. 고민 선택을 시작 전에 둘지, 결과 후 "다음 밤은 이 고민으로" 로 옮길지


---

## 11. 3차 변경 — 브랜드 레이어 (v3, 2026-11-07)

목표: 게임을 하는 동안 K-SECRET 과 SEOUL 1988 이 "의식하지 않아도" 계속 눈에 들어오게 한다.
원칙은 **고강도 앵커 4곳 + 저강도 반복 12곳**. 반복 노출은 주변시(周邊視)에 들어오는 크기·투명도로 두어 게임을 방해하지 않는다.

### 11.1 로고 자산
- 출처: 브랜드 필름 엔드프레임(`site/film/end-d.jpg`, 1920px)의 공식 락업. 모노그램 + K-SECRET 워드마크, SEOUL 1988 워드마크.
- 가공: 투명 PNG(2배 업스케일) 4색 — 크림 `#FFF6E3`, 잉크 `#2B2240`, 레드 `#C64046`, 화이트. `site/beautysecret/brand/`.
- 게임 내 사용: CSS `mask-image` 로 색을 자유롭게 입힌 `.logo-s88` / `.logo-ks` 요소, SVG 심볼 `#s88w #s88r #s88c`, 공유 카드 캔버스용 데이터 URI.
- 공식 벡터(AI/SVG) 원본을 받으면 교체만 하면 된다(동일 비율 888×148 / 452×110).

### 11.2 노출 지도

| 강도 | 위치 | 표현 | 노출 빈도 |
|---|---|---|---|
| 고 | 부팅 스플래시 | 크림 배경에 K-SECRET → SEOUL 1988 → presents, 1.4초(탭하면 스킵) | 접속마다 1회 |
| 고 | 타이틀 | 게임 제목 위 SEOUL 1988 워드마크, 하단 K-SECRET 락업 | 접속·재시작마다 |
| 고 | 공유 카드 | 좌상단 K-SECRET(크림), 패널 우하단 SEOUL 1988(레드), 해시태그 | 결과마다, 외부 확산 |
| 고 | 비밀 수호자 엔딩 | 엔딩 문장 아래 K-SECRET + SEOUL 1988 락업 | 7박 완주 시 |
| 저 | HUD Glow 바 | 라벨 "Glow" 앞 9px 워드마크 | 플레이 내내 상시 |
| 저 | 하늘 워터마크 | 키키 머리 위, 폭 76%, 불투명도 5.5% | 플레이 내내 상시 |
| 저 | 스카이라인 전광판 | LA 옥상 간판에 크림 워드마크 | 플레이 내내 상시 |
| 저 | 키키의 수면안대 | 머리 위로 올린 크림 안대에 레드 SEOUL 1988 프린트 (실제 튜브 인쇄 색) | 타이틀·플레이·공유 카드 |
| 저 | 요정 보틀 라벨 | 레드 라벨 위 % 위에 작은 SEOUL 1988 | 덱·속삭임·앨범·매치·공유 카드 |
| 저 | 오버레이 카드 스탬프 | 모든 카드 우상단 K-SECRET 락업 28% | 밤 소개·요약·결과·폼·랭킹·앨범 (판당 15회 이상) |
| 저 | 밤 소개 카드 | 요일 옆 13px 워드마크 | 밤마다 |
| 저 | 퍼펙트 나이트 배지 | 배지 안 워드마크 | 퍼펙트마다 |
| 저 | 콤보 팝 | ×2.0, ×3.0 도달 시 "SEOUL 1988 glow ×2.0" | 콤보 10·20 |
| 저 | 랭킹 경품 핀 | "SEOUL 1988 Prize #1–5" | 랭킹 화면 |
| 저 | 파비콘 | 크림 사각 + 모노그램 | 브라우저 탭 |

### 11.3 4차에서 확인받고 싶은 것
1. 스플래시 길이(1.4초)와 스킵 가능 여부
2. 워터마크·스탬프 투명도(5.5% / 28%)가 "은근함"과 "보임" 사이 어디가 좋은지
3. 수면안대 아이디어 유지 여부(머리 위 안대 vs 베개·이불 등 다른 소품)
4. 공식 벡터 로고 파일 제공 가능 여부(현재는 필름 프레임 추출본)


---

## 12. 4차 변경 — 요정 = 실제 제품 실사, K-SECRET 동반 노출 (v4, 2026-11-07)

### 12.1 제품 실사 에셋
| 요정 | 파일 | 출처(구글 드라이브) |
|---|---|---|
| Nia | `products/nia.png` | 1988 Capsule Cream Thumbnail_1.png |
| Cica | `products/cica.png` | SEOUL 1988 Repair Cream Thumbnail_1.png |
| Retina | `products/retinal.png` | 1988 Serum Thumbnail_1.png |
| Bean | `products/eyecream.png` | 1988 Eye Cream Thumbnail_1.png |
| Snail | `products/snail.png` | 1988 Essence Thumbnail_1.png |
| Pine | `products/foam.png` | SEOUL 1988 Cleansing Foam Thumbnail_1.png |
| Yuja | `products/glow.png` | 1988 Glow Serum Thumbnail_1.png |
| Shot 12 | `products/ashot.png` | 1988 Advanced Shot Thumbnail_1.png |
| TXA | `products/txa.png` | 1988 TXA Shot Thumbnail_1.jpg |
| Patch | `products/eyepatch.png` | SEOUL 1988 Retinal Eye Patch Thumbnail_1.jpg |
| Night Shield | `products/sleeping.png` | SEOUL 1988 Sleeping Mask_Thumbnail_1.png |
| Glow Burst | `products/hydrogel.png` | SEOUL 1988 Retinal Hydrogel Mask Thumbnail_1.jpg |

- 가공: 흰 배경은 플러드필로 제거, 투명 PNG는 그대로. 여백 8%를 두고 480×480 정사각 PNG로 저장.
- 게임 안에서는 날개·반짝이 SVG 위에 실사를 올리고, 뒤에 크림색 후광을 깔아 어두운 화면에서도 제품이 또렷하게 보인다. 이미지가 없으면 자동으로 보틀 일러스트로 폴백.
- 교체 방법: 같은 파일명으로 `site/beautysecret/products/` 에 덮어쓰기만 하면 된다(정사각, 투명 배경 권장).
- 참고: 드라이브에는 "Retinal Shot(리뉴얼)" 실사도 있다. 어드밴스드 샷이 리뉴얼 패키지로 바뀌면 `ashot.png` 만 교체.

### 12.2 K-SECRET 로고 배치 (SEOUL 1988 과 항상 짝으로)
브랜드 필름 엔드프레임의 공식 락업(K-SECRET 위, SEOUL 1988 아래)을 그대로 쓴다.
| 위치 | 표현 |
|---|---|
| 부팅 스플래시 | 크림 배경, 스택 락업 |
| 타이틀 | 게임 제목 위 "K-SECRET / SEOUL 1988 / presents", 하단 K-SECRET 바이라인 |
| 모든 오버레이 카드 | 우상단 스택 락업 스탬프 (42~50% 투명도) |
| HUD | Glow 바 왼쪽 SEOUL 1988, 오른쪽 끝 K-SECRET |
| 공유 카드 | 좌상단 스택 락업(크림), 키키 수면안대 SEOUL 1988(레드) |
| 제품 실사 | 팩 상단의 K-SECRET 모노그램, 본체의 SEOUL 1988 |

### 12.3 5차에서 확인받고 싶은 것
1. 실사 크기·후광 밝기 (덱 카드에서 제품이 충분히 식별되는지)
2. 어드밴스드 샷 vs 리뉴얼 레틴알 샷 중 어느 패키지를 쓸지
3. 카드 스탬프 투명도(현재 42~50%)와 HUD K-SECRET 크기
4. 리더보드 서버 연결 시점(Apps Script) 및 런칭 도메인


---

## 13. 5차 변경 — 스토리 인트로 (v5, 2026-11-07)

### 13.1 구조 (인스타그램 스토리 문법)
- 세로 패널(폰 전체 화면, 데스크톱은 가운데 460px 카드), 상단 7칸 진행 바, 프로필 줄(키키 아바타 · kikis.secret · 건너뛰기).
- 조작: 오른쪽 70% 탭 = 다음, 왼쪽 30% 탭 = 이전, 좌우 스와이프, 길게 누르면 일시정지, 키보드 ←/→/Esc. 카드당 6.5초 자동 진행(6차에서 3초로 변경, 14장 참조), 마지막 카드는 CTA 대기.
- 첫 접속에만 자동 재생(`kiki_intro_seen`). 타이틀의 "스토리" 버튼으로 언제든 다시 볼 수 있다.
- 마지막 카드의 "요정 부르기" → 바로 피부 고민 선택 → 1번째 밤. "타이틀로"는 타이틀 화면.

### 13.2 카드 구성
| # | 아이브로 | 장면 애니메이션 | 카피(EN) |
|---|---|---|---|
| 1 | Westgate High, LA | 낮 하늘, 해, 키키(눈 뜸), 얼굴 위 반짝임 | Meet Kiki. Queen of Westgate High. Famous for one thing: glass skin. |
| 2 | Her secret | 1.4초 뒤 낮→밤 전환, 달 등장, 눈 감김, 일기 한 줄 | But Kiki has a SECRET. Every night, while she sleeps… |
| 3 | From Seoul, with love | "SEOUL ✈ LA" 라벨, 요정 4명(실사)이 오른쪽에서 날아와 떠다님 | …beauty fairies from Seoul fly in. Each one is a real SEOUL 1988 product. |
| 4 | Every night | 볼·이마·눈가에 저주 4종이 순서대로 팝업(이름표) | And every night, the curses come too. |
| 5 | The rule | Nia 가 날아와 기미 저주에 닿으면 저주가 사라지고 반짝임 | Every curse has its fairy. Dark spots? Nia. Lines? Retina. Eyes? Only Bean. |
| 6 | Seven nights | 월~일 칸이 순서대로 켜지고 일요일은 PROM | Guard her for seven nights, until prom. Top 50 make the board. Top 5 win SEOUL 1988. |
| 7 | Ready? | K-SECRET / SEOUL 1988 / Kiki's SECRET 락업, CTA 버튼 맥동 | Tonight, Kiki's SECRET is in your hands. |

### 13.3 확인받고 싶은 것
1. 카드 수(7장)와 카드당 6.5초가 적당한지, 더 짧게(5장) 줄일지
2. 2·6번 카드의 일기 한 줄 톤
3. 첫 접속에만 자동 재생 vs 매번 재생
4. 스토리에 배경음(짧은 멜로디)을 넣을지

## 14. 6차 변경 — 키키 리디자인, 요정 날개·표정, 스토리 재배치 (v6, 2026-11-07)

### 14.1 키키 리디자인 ("더 귀엽고 사랑스럽게")
- 비율: 얼굴을 둥글고 넓게(가로 264 : 세로 320), 눈을 얼굴 아래쪽에 크게(흰자 62×70), 턱은 작게. 눈은 홍채 그라데이션 + 아래쪽 밝은 링 + 큰 하이라이트 2개 + 바깥쪽 속눈썹. 잠든 눈은 아래로 휘는 속눈썹 + 연한 핑크 눈두덩.
- 머리: 시스루 뱅(반투명 가닥 9개) + 커튼 앞머리 + 어깨까지 오는 옆머리, 정수리 광택, 오른쪽 리본 핀. 수면안대는 제거.
- 피부: 큰 타원 하이라이트 대신 부드러운 광택 그라데이션(`gSheen`) + 작은 별 반짝임 3개. 글로우가 떨어지면 함께 흐려진다(`--glow`).
- 좌표: 저주 등장 영역을 새 얼굴에 맞춤 — 이마(200,172) · 눈가(148/252,288) · 코(200,330) · 볼(112/288,348) · 턱(200,404).

### 14.2 요정 = 실사 + 날개 + 표정
- 날개: 한쪽 날개 심볼(`#wing`)을 좌우 대칭으로 배치. 흰색 반투명 바탕 위에 요정별 포인트 색(`--acc`) 안쪽 날개, 흰 윤곽선과 날개맥. 제품 폭의 128% 로 펼쳐지고 1.2초 주기로 퍼덕인다(`flap`, 동작 줄이기 시 정지).
- 표정: 제품 위에 작은 크림색 스티커(폭 46%)로 눈·볼·입을 얹는다. 5종 — smile(동그란 눈) · happy(^^ + 벌린 입) · wink · calm(차분) · sleepy(z z). 요정별 표정과 세로 위치(`FACE` 맵): Nia happy 60% · Cica calm · Retina wink · Bean smile · Snail calm · Pine happy · Yuja wink · Shot 12 smile · TXA calm · Patch happy 62% · 슬리핑 마스크 sleepy · 하이드로겔 smile 48%.
- 적용 범위: 덱 카드, 파워업 링, 속삭임, 오늘의 레슨, 피부 매치, MVP, 앨범, 스토리 비행 장면, 공유 카드(캔버스에 날개→실사→표정 순으로 합성). 실사 로드 실패 시 기존 보틀 일러스트 폴백에는 표정 스티커를 얹지 않는다.

### 14.3 스토리 인트로 v2 (카드당 3초 → 4초, 8장)
| # | 아이브로 | 장면 | 카피(EN) |
|---|---|---|---|
| 1 | Westgate High, LA | 낮, 키키(눈 뜸), 반짝임 | Meet Kiki. Queen of Westgate High. Everyone wants to know her secret. |
| 2 | Why she's the queen | 콜아웃 3개 팝업: Glass-clear skin · Bouncy elasticity · Bright, line-free eyes | Skin as clear as glass. Cheeks so bouncy they might pop. Bright, lively eyes without a single line. |
| 3 | The secret of her glow (그녀 피부 광채의 비밀) | 1.4초 뒤 낮→밤, 눈 감김, 일기 | But Kiki has a SECRET. Every night, while she sleeps… |
| 4 | Every night | 저주 4종 팝업(0.2/0.7/1.2/1.7초) | …the curses creep in. Breakouts, dark spots, fine lines, dark circles. |
| 5 | From Seoul, with love | 요정 4명(실사+날개+표정) 비행 | That's when beauty fairies from Seoul fly in to guard her. Each one is a real SEOUL 1988 product. |
| 6 | The rule | Nia 매칭 데모 | Every curse has its fairy. Dark spots? Nia. Lines? Retina. Eyes? Only Bean. |
| 7 | Seven nights | 월~일, 일요일 PROM | Guard her for seven nights, until prom. Top 50 make the board. Top 5 win SEOUL 1988. |
| 8 | Ready? | 락업 + CTA | Tonight, Kiki's SECRET is in your hands. |

- 저주(4) 가 요정(5) 보다 먼저 나오도록 순서를 바꿨다. 자동 진행은 3초, 마지막 카드는 CTA 대기. 길게 누르면 멈추므로 3초가 짧게 느껴지는 사용자도 읽을 수 있다.

### 14.4 확인받고 싶은 것
1. 새 키키 인상(눈 크기·앞머리·리본) — 더 조정할 부분
2. 표정 스티커가 제품 라벨을 가리는 정도(폭 46%)가 적당한지, 더 작게 할지
3. 날개 퍼덕임이 덱에서 산만하지 않은지(끄거나 느리게 가능)

## 15. 7차 변경 — 레퍼런스 기반 키키 재디자인, 샘플 랭킹 제거 (v7, 2026-11-07)

### 15.1 "예쁘고 귀여운 얼굴" 규칙 (레퍼런스에서 추출)
Dribbble·Behance·Freepik 의 인기 캐릭터 그리드를 캡처해 공통점을 정리했다.
| 요소 | 규칙 | 키키 v4 적용 |
|---|---|---|
| 두상 | 광대·볼이 가장 넓고 턱으로 빠르게 좁아지는 하트형, 턱은 작고 둥글게 | 폭 252 : 높이 318, 턱 폭 90 |
| 눈 | 얼굴 아래쪽·눈 하나 간격으로 넓게, 홍채가 눈의 대부분, 윗꺼풀은 두껍게 바깥으로 갈수록 굵게, 바깥 속눈썹 3가닥, 아랫라인은 얇게 | 흰자 60×64, 홍채 46×56, 하이라이트 r8.5 + r4 + r2.4, 아래 밝은 링 |
| 눈썹 | 얇은 아치, 눈과 가깝게, 머리색보다 한 톤 진하게 | 두께 4, 눈 위 44 |
| 코 | 점 하나 수준의 작은 곡선 + 옅은 그림자 | 폭 11 |
| 입 | 작고 미소, 아랫입술 도톰한 분홍, 하이라이트 | 폭 32 |
| 볼 | 눈 바로 아래 바깥쪽에 소프트 블러셔 | rx 28 ry 14 + 반짝 점 |
| 머리 | 이마를 덮는 앞머리, 레이어·하이라이트·그림자로 볼륨, 얼굴을 감싸는 옆머리 | 스캘럽 풀뱅 + 커튼 + S자 옆머리 + 크라운 하이라이트 |
| 음영 | 앞머리 아래 이마, 턱 아래 목, 콧등·광대 하이라이트 | 각각 적용 |

### 15.2 좌표 (저주 등장 영역)
이마(200,226 · 앞머리 아래 눈썹 위) · 눈가(146/254,296) · 코(200,340) · 볼(114/286,346) · 턱(200,404).

### 15.3 랭킹
- 샘플 행 제거. 서버 미연결 시 기기 내 기록만 표시하고, 없으면 빈 상태 문구. 기존 기기에 저장된 샘플 행은 로드 시 걸러낸다.

### 15.4 확인받고 싶은 것
1. 눈 색(파랑) — 갈색/보라로 바꿀 수 있음
2. 앞머리(풀뱅) vs 이마가 보이는 커튼뱅
3. 리본 위치·크기
