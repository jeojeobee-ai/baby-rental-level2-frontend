import type { Category, Condition, ItemStatus, Method, Result } from './types';

export const CATEGORY_LABELS: Record<Category, string> = {
  MOBILITY: '이동',
  SLEEP: '수면',
  FEEDING: '수유·위생',
  PLAY: '놀이·발달',
};

// 용품 상태: 용품 자체의 물리적 상태
export const CONDITION_LABELS: Record<Condition, string> = {
  GOOD: '좋음',
  FAIR: '사용감 있음',
  NEEDS_REPAIR: '수리 필요',
};

export const METHOD_LABELS: Record<Method, string> = {
  STEAM: '스팀',
  UV: '자외선',
  WASH: '세제 세척',
};

// 소독 결과: 소독 작업 한 번의 결과
export const RESULT_LABELS: Record<Result, string> = {
  PASS: '소독 완료',
  FAIL: '소독 미완료',
};

// 지금 상태: 지금 내보내도 되는지
export const STATUS_LABELS: Record<ItemStatus, string> = {
  AVAILABLE: '대여 가능',
  RENTED: '대여 중',
  AWAITING_SANITIZATION: '소독 대기',
  NEEDS_RESANITIZATION: '재소독 필요',
  NEEDS_REPAIR: '수리 필요',
};

// 대표 사진: public/items/ 의 데모 그림 (직접 제작, 실제 제품 사진 아님).
// 백엔드 src/items/item-images.ts 의 ITEM_IMAGES 와 같은 목록이어야 합니다.
export const DEFAULT_IMAGE = '/items/default.svg';
export const IMAGE_OPTIONS = [
  ['stroller', '유모차'],
  ['car-seat', '카시트'],
  ['carrier', '아기띠·힙시트'],
  ['crib', '아기침대'],
  ['mattress', '매트·범퍼침대'],
  ['sterilizer', '젖병소독기'],
  ['bath', '아기 욕조'],
  ['kettle', '분유 포트'],
  ['food-maker', '이유식 조리기'],
  ['high-chair', '하이체어'],
  ['walker', '보행기'],
  ['activity-center', '쏘서·점퍼루'],
  ['bouncer', '바운서'],
  ['play-gym', '아기 체육관'],
  ['play-house', '러닝홈'],
].map(([name, label]) => ({ value: `/items/${name}.svg`, label }));

// "브랜드 · 모델명" 한 줄. 둘 다 없으면 빈 글자.
export function productLine(item: { brand: string | null; modelName: string | null }) {
  return [item.brand, item.modelName].filter(Boolean).join(' · ');
}

export function ageRange(min: number, max: number) {
  return `${min}~${max}개월`;
}

// 브라우저 기준 오늘 날짜 (YYYY-MM-DD)
export function today() {
  return new Date().toLocaleDateString('en-CA');
}
