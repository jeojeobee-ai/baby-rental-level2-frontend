# baby-rental-level2-frontend

햇빛구 육아용품 대여실 관리 웹앱의 **프론트엔드**(Next.js)입니다.
직원이 용품 현황을 보고, 용품을 검색·거르고, 대여 신청을 받아 대여 처리하거나 취소하며, 반납·소독 기록을 남기는 화면입니다. 모든 데이터는 가상입니다.

- 기획서: [기획서.md](./기획서.md)
- 백엔드 저장소: https://github.com/jeojeobee-ai/baby-rental-level2-backend
- 백엔드 배포 주소: https://baby-rental-level2-api.onrender.com
- 배포 주소: https://baby-rental-level2-frontend.vercel.app

> **첫 접속 안내** — 백엔드가 Render 무료 서버라서 한동안 쓰지 않으면 잠듭니다. 첫 접속 때 데이터가 나오기까지 **1분쯤 걸릴 수 있어요.** 연결 안내가 보이면 잠시 뒤 "다시 시도"를 눌러 주세요.

## 화면

| 번호 | 화면 | 주소 |
|---|---|---|
| S0 | 현황 (전체·대여 중·대여 가능 숫자, 가상 데이터 초기화) | `/` |
| S1 | 용품 목록 (검색·분류·지금 상태·아기 월령으로 거르기, "신청 중" 표시) | `/items` |
| S2 | 용품 상세 (신청 안내, 신청·대여·소독 기록, 반납 처리) | `/items/[id]` |
| S3 | 용품 등록 | `/items/new` |
| S4 | 대여 기록 직접 등록 | `/items/[id]/rentals/new` |
| S5 | 소독 기록 등록 | `/items/[id]/sanitizations/new` |
| S6 | 대여 신청 등록 | `/items/[id]/requests/new` |
| S7 | 신청 목록 (대여 처리·신청 취소) | `/requests` |

업무 규칙(R1~R6)은 백엔드가 지키고, 화면은 백엔드가 돌려준 안내 문구를 그대로 보여 줍니다.

## 가상 데이터 초기화

현황 화면 아래 "가상 데이터 초기화"에서 토큰을 입력하면 시연 중 바뀐 내용을 처음 가상 데이터로 되돌립니다. 토큰은 서버(Render)에만 있고, 이 화면은 입력받은 값을 보내기만 하며 저장하지 않습니다.

## 물품 사진과 제품 정보

- 대표 사진은 업로드하지 않고 `public/items/`의 **직접 만든 데모 그림(SVG)** 15종 중에서 고릅니다. 실제 제품 사진이 아닙니다.
- 브랜드·모델명은 실제 제품과 헷갈리지 않도록 지어낸 가상 이름입니다.
- 화면 글꼴은 Pretendard(jsDelivr CDN)를 씁니다.

## 설치

Node.js 20.9 이상이 필요합니다.

```bash
npm install
```

## 실행 (내 컴퓨터)

1. 백엔드를 먼저 켭니다 (백엔드 저장소 README 참고, 기본 주소 `http://localhost:4000`).
2. 환경변수 파일을 만듭니다.

   ```bash
   cp .env.example .env.local
   ```

3. 개발 서버를 켜고 브라우저에서 http://localhost:3000 을 엽니다.

   ```bash
   npm run dev
   ```

## 환경변수

| 이름 | 뜻 | 예시 |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | 백엔드 주소 | `http://localhost:4000` |

`.env.local`은 GitHub에 올라가지 않습니다. 이 값은 브라우저에 노출되는 **공개 주소**이므로 비밀값을 넣지 않습니다.

## 배포 (Vercel)

| 항목 | 값 |
|---|---|
| 프레임워크 | Next.js (자동 인식) |
| 빌드 명령 | `npm run build` (기본값) |
| 환경변수 | `NEXT_PUBLIC_API_URL` = 백엔드(Render) 주소 |

1. Vercel에서 이 저장소를 Import 합니다.
2. Environment Variables에 `NEXT_PUBLIC_API_URL`을 넣습니다.
3. Deploy 합니다. 이후 `main`에 push하면 자동으로 다시 배포됩니다.
4. 배포된 주소를 백엔드(Render)의 `FRONTEND_ORIGIN`에 넣어야 화면에서 API를 부를 수 있습니다.

## 빌드 확인

```bash
npm run build
```
