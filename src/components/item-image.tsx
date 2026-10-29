'use client';

import { useState } from 'react';
import { DEFAULT_IMAGE } from '@/lib/labels';

// 대표 사진. 사진이 없거나 불러오지 못하면 기본 그림을 보여 주고,
// 틀 크기(4:3)는 CSS로 고정해 사진이 늦게 와도 레이아웃이 흔들리지 않습니다.
export function ItemImage({
  src,
  alt,
  size = 'thumb',
}: {
  src: string | null;
  alt: string;
  size?: 'thumb' | 'large' | 'preview';
}) {
  const [failed, setFailed] = useState(false);
  const url = !src || failed ? DEFAULT_IMAGE : src;
  return (
    <span className={`item-image item-image-${size}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- 정적 SVG라 최적화가 필요 없음 */}
      <img src={url} alt={alt} loading="lazy" onError={() => setFailed(true)} />
    </span>
  );
}
