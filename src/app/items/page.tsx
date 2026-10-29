'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ItemImage } from '@/components/item-image';
import { ErrorBox, Loading, StatusBadge } from '@/components/ui';
import { api } from '@/lib/api';
import { CATEGORY_LABELS, CONDITION_LABELS, ageRange, productLine } from '@/lib/labels';
import type { Item } from '@/lib/types';

// S1. 용품 목록
export default function ItemsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      setItems(await api<Item[]>('/items'));
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>용품 목록</h1>
          {items && <p className="muted">전체 {items.length}개</p>}
        </div>
        <Link className="button" href="/items/new">
          용품 등록
        </Link>
      </div>

      {error ? (
        <ErrorBox message={error} onRetry={load} />
      ) : !items ? (
        <Loading />
      ) : items.length === 0 ? (
        <p className="state-box">아직 등록된 용품이 없어요.</p>
      ) : (
        <table className="table table-clickable">
          <thead>
            <tr>
              <th className="col-photo">
                <span className="sr-only">사진</span>
              </th>
              <th>관리 번호</th>
              <th>이름</th>
              <th>분류</th>
              <th>사용 월령</th>
              <th>용품 상태</th>
              <th>지금 상태</th>
              <th>마지막 소독일</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} onClick={() => router.push(`/items/${item.id}`)}>
                <td className="col-photo">
                  <ItemImage src={item.imageUrl} alt={`${item.name} 대표 사진 (데모 그림)`} />
                </td>
                <td data-label="관리 번호" className="mono">
                  <Link href={`/items/${item.id}`} onClick={(e) => e.stopPropagation()}>
                    {item.code}
                  </Link>
                </td>
                <td data-label="이름" className="name-cell">
                  <span>
                    <span className="strong">{item.name}</span>
                    {productLine(item) && <span className="sub-text">{productLine(item)}</span>}
                  </span>
                </td>
                <td data-label="분류">{CATEGORY_LABELS[item.category]}</td>
                <td data-label="사용 월령">{ageRange(item.minAgeMonths, item.maxAgeMonths)}</td>
                <td data-label="용품 상태">{CONDITION_LABELS[item.condition]}</td>
                <td data-label="지금 상태">
                  <StatusBadge status={item.status} />
                </td>
                <td data-label="마지막 소독일">{item.lastSanitizedAt ?? '없음'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
