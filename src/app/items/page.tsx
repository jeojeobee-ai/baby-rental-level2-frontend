'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { ItemImage } from '@/components/item-image';
import { ErrorBox, Loading, StatusBadge } from '@/components/ui';
import { api } from '@/lib/api';
import { CATEGORY_LABELS, CONDITION_LABELS, STATUS_LABELS, ageRange, productLine } from '@/lib/labels';
import type { Item } from '@/lib/types';

// S1. 용품 목록 (검색·분류·지금 상태·아기 월령 거르기는 화면에서 처리)
export default function ItemsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ItemsList />
    </Suspense>
  );
}

function ItemsList() {
  const router = useRouter();
  const params = useSearchParams();
  const initialStatus = params.get('status') ?? '';
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState(initialStatus in STATUS_LABELS ? initialStatus : '');
  const [age, setAge] = useState('');
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

  const filtered = useMemo(() => {
    if (!items) return [];
    const q = query.trim().toLowerCase();
    const months = age.trim() === '' ? null : Number(age);
    return items.filter((item) => {
      if (q && ![item.code, item.name, item.brand ?? '', item.modelName ?? ''].some((v) => v.toLowerCase().includes(q))) return false;
      if (category && item.category !== category) return false;
      if (status && item.status !== status) return false;
      if (months !== null && Number.isFinite(months) && (months < item.minAgeMonths || months > item.maxAgeMonths)) return false;
      return true;
    });
  }, [items, query, category, status, age]);
  const filtering = Boolean(query.trim() || category || status || age.trim());

  function clearFilters() {
    setQuery('');
    setCategory('');
    setStatus('');
    setAge('');
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>용품 목록</h1>
          {items && (
            <p className="muted">
              {filtering ? `조건에 맞는 용품 ${filtered.length}개 (전체 ${items.length}개)` : `전체 ${items.length}개`}
            </p>
          )}
        </div>
        <Link className="button" href="/items/new">
          용품 등록
        </Link>
      </div>

      {items && items.length > 0 && (
        <div className="filter-bar" role="search">
          <div className="field field-search">
            <label htmlFor="f-query">검색</label>
            <input id="f-query" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="이름·관리 번호·브랜드·모델명" />
          </div>
          <div className="field">
            <label htmlFor="f-category">분류</label>
            <select id="f-category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">전체</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-status">지금 상태</label>
            <select id="f-status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">전체</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-age">아기 월령 (개월)</label>
            <input id="f-age" type="number" inputMode="numeric" min={0} max={72} value={age} onChange={(e) => setAge(e.target.value)} placeholder="8" />
          </div>
          {filtering && (
            <button type="button" className="button button-secondary" onClick={clearFilters}>
              조건 지우기
            </button>
          )}
        </div>
      )}

      {error ? (
        <ErrorBox message={error} onRetry={load} />
      ) : !items ? (
        <Loading />
      ) : items.length === 0 ? (
        <p className="state-box">아직 등록된 용품이 없어요.</p>
      ) : filtered.length === 0 ? (
        <div className="state-box">
          <p>조건에 맞는 용품이 없어요.</p>
          <button type="button" className="button button-secondary" onClick={clearFilters}>
            조건 지우기
          </button>
        </div>
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
            {filtered.map((item) => (
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
                  {item.hasPendingRequest && <span className="badge-pending">신청 중</span>}
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
