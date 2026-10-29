# baby-rental-level2-frontend

햇빛구 육아용품 대여실 관리 웹앱의 **프론트엔드**(Next.js)입니다.
직원이 육아용품 목록·상세를 보고, 용품·대여 기록·소독 기록을 등록하는 화면입니다.
Level 2 기획 내용은 [기획서.md](./기획서.md)에 있고(대여 신청·현황·필터·초기화는 구현 전), 지금은 Level 1에서 복사한 상태이며, 모든 데이터는 가상입니다.

- 백엔드 저장소·배포 주소: 아직 만들지 않았습니다(Level 1 프로젝트와 별도로 새로 만듭니다).

## 화면

| 번호 | 화면 | 주소 |
|---|---|---|
| S1 | 용품 목록 | `/items` |
| S2 | 용품 상세 (대여·소독 기록, 반납 처리) | `/items/[id]` |
| S3 | 용품 등록 | `/items/new` |
| S4 | 대여 기록 등록 | `/items/[id]/rentals/new` |
| S5 | 소독 기록 등록 | `/items/[id]/sanitizations/new` |

## 물품 사진과 제품 정보

- 목록에는 작은 대표 사진과 "브랜드 · 모델명", 상세에는 큰 사진과 브랜드·모델명·구매일이 보입니다.
- 대표 사진은 업로드하지 않고 `public/items/`의 **직접 만든 데모 그림(SVG)** 15종 중에서 고릅니다. 실제 제품 사진이 아닙니다.
- 사진이 없거나 불러오지 못하면 `public/items/default.svg`를 보여 주며, 사진 틀은 4:3으로 고정되어 레이아웃이 흔들리지 않습니다.
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

`.env.local`은 GitHub에 올라가지 않습니다.

## 배포 (Vercel)

1. Vercel에서 이 저장소를 Import 합니다. 프레임워크는 Next.js로 자동 인식됩니다.
2. Environment Variables에 `NEXT_PUBLIC_API_URL` = Render 백엔드 주소(Level 2 백엔드 주소)를 넣습니다.
3. Deploy 합니다. 이후 `main`에 push하면 자동으로 다시 배포됩니다.
4. 배포된 주소를 백엔드(Render)의 `FRONTEND_ORIGIN`에 넣어야 화면에서 API를 부를 수 있습니다.

CLI로 배포할 때:

```bash
npx vercel link
npx vercel env add NEXT_PUBLIC_API_URL production
npx vercel --prod
```

## 빌드 확인

```bash
npm run build
```
