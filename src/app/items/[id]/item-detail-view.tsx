'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { ErrorBox, ItemNotFound, Loading, StatusBadge } from '@/components/ui';
import {
  CATEGORY_LABELS,
  CONDITION_LABELS,
  METHOD_LABELS,
  RESULT_LABELS,
  ageRange,
  productLine,
  today,
} from '@/lib/labels';
import { ItemImage } from '@/components/item-image';
import type { Rental } from '@/lib/types';
import { useForm } from '@/lib/use-form';
import { useItem } from '@/lib/use-item';

const STATUS_HELP: Record<string, string> = {
  AVAILABLE: '반납 뒤 소독까지 끝나 바로 빌려줄 수 있어요.',
  RENTED: '아직 반납되지 않았어요.',
  AWAITING_SANITIZATION: '반납 뒤(또는 새로 들어온 뒤) 소독 기록이 없어요. 소독 후 기록을 남겨 주세요.',
  NEEDS_RESANITIZATION: '마지막 소독이 "소독 미완료"예요. 다시 소독한 뒤 기록을 남겨 주세요.',
  NEEDS_REPAIR: '용품 상태가 "수리 필요"라 내보낼 수 없어요.',
};

export default function ItemDetailView() {
  const { id } = useParams<{ id: string }>();
  const { state, reload } = useItem(id);

  if (state.kind === 'loading') return <Loading />;
  if (state.kind === 'not-found') return <ItemNotFound />;
  if (state.kind === 'error') return <ErrorBox message={state.message} onRetry={reload} />;

  const { item } = state;
  // 대여 중이면 반납 예정일과 남은 날(또는 지난 날)을 함께 보여 줍니다.
  const activeRental = item.rentals.find((rental) => !rental.returnedAt);
  const daysLeft = activeRental
    ? Math.round((Date.parse(activeRental.dueDate) - Date.parse(today())) / 86_400_000)
    : null;
  return (
    <>
      <p className="breadcrumb">
        <Link href="/items">용품 목록</Link> / {item.code}
      </p>
      <div className="detail-hero">
        <ItemImage src={item.imageUrl} alt={`${item.name} 대표 사진 (데모 그림)`} size="large" />
        <div className="detail-summary">
          <p className="mono muted">{item.code}</p>
          <h1>{item.name}</h1>
          <p className="sub-text">{productLine(item) || '제품 정보 없음'}</p>
          <div className={`status-panel status-panel-${item.status}`}>
            <span className="status-panel-label">지금 상태</span>
            <p className="status-line">
              <StatusBadge status={item.status} />
            </p>
            {activeRental && daysLeft !== null && (
              <p className={`due-date${daysLeft < 0 ? ' due-date-over' : ''}`}>
                반납 예정일 <strong>{activeRental.dueDate}</strong>
                <span>{daysLeft > 0 ? ` (D-${daysLeft})` : daysLeft === 0 ? ' (오늘)' : ` (${-daysLeft}일 지남)`}</span>
              </p>
            )}
            <p className="muted">{STATUS_HELP[item.status]}</p>
          </div>
          <p className="demo-note">사진은 데모용 그림이며, 브랜드·모델명은 가상 데이터예요.</p>
        </div>
      </div>

      <dl className="info-grid">
        <div>
          <dt>브랜드</dt>
          <dd>{item.brand ?? '-'}</dd>
        </div>
        <div>
          <dt>모델명</dt>
          <dd>{item.modelName ?? '-'}</dd>
        </div>
        <div>
          <dt>구매일</dt>
          <dd>{item.purchasedAt ?? '-'}</dd>
        </div>
        <div>
          <dt>분류</dt>
          <dd>{CATEGORY_LABELS[item.category]}</dd>
        </div>
        <div>
          <dt>사용 월령</dt>
          <dd>{ageRange(item.minAgeMonths, item.maxAgeMonths)}</dd>
        </div>
        <div>
          <dt>용품 상태</dt>
          <dd>{CONDITION_LABELS[item.condition]}</dd>
        </div>
        <div>
          <dt>마지막 소독일</dt>
          <dd>{item.lastSanitizedAt ?? '없음'}</dd>
        </div>
        {item.memo && (
          <div className="info-wide">
            <dt>메모</dt>
            <dd>{item.memo}</dd>
          </div>
        )}
      </dl>

      <section className="section">
        <div className="section-head">
          <h2>대여 기록 ({item.rentals.length})</h2>
          <Link className="button" href={`/items/${item.id}/rentals/new`}>
            대여 기록 추가
          </Link>
        </div>
        {item.rentals.length === 0 ? (
          <p className="state-box">아직 대여 기록이 없어요.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>보호자</th>
                <th>연락처</th>
                <th>아기 월령</th>
                <th>빌린 날</th>
                <th>반납 예정일</th>
                <th>실제 반납일</th>
              </tr>
            </thead>
            <tbody>
              {item.rentals.map((rental) => (
                <tr key={rental.id}>
                  <td data-label="보호자" className="strong">{rental.guardianName}</td>
                  <td data-label="연락처" className="mono">{rental.guardianPhone}</td>
                  <td data-label="아기 월령">{rental.childAgeMonths}개월</td>
                  <td data-label="빌린 날">{rental.rentedAt}</td>
                  <td data-label="반납 예정일">{rental.dueDate}</td>
                  <td data-label="실제 반납일">
                    {rental.returnedAt ?? <ReturnControl rental={rental} onDone={reload} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>소독 기록 ({item.sanitizations.length})</h2>
          <Link className="button" href={`/items/${item.id}/sanitizations/new`}>
            소독 기록 추가
          </Link>
        </div>
        {item.sanitizations.length === 0 ? (
          <p className="state-box">아직 소독 기록이 없어요.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>소독한 날</th>
                <th>담당 직원</th>
                <th>방법</th>
                <th>소독 결과</th>
                <th>메모</th>
              </tr>
            </thead>
            <tbody>
              {item.sanitizations.map((sanitization) => (
                <tr key={sanitization.id}>
                  <td data-label="소독한 날">{sanitization.sanitizedAt}</td>
                  <td data-label="담당 직원">{sanitization.staffName}</td>
                  <td data-label="방법">{METHOD_LABELS[sanitization.method]}</td>
                  <td data-label="소독 결과">
                    <span className={`result result-${sanitization.result}`}>{RESULT_LABELS[sanitization.result]}</span>
                  </td>
                  <td data-label="메모">{sanitization.memo ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

// B6. 반납 처리: 반납일을 고르고 버튼을 누릅니다.
function ReturnControl({ rental, onDone }: { rental: Rental; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const { values, set, errors, submitting, submit } = useForm({ returnedAt: today() });

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const updated = await submit(`/rentals/${rental.id}/return`, 'PATCH', values);
    if (updated) onDone();
  }

  if (!open) {
    return (
      <span className="return-cell">
        <span className="badge badge-RENTED">대여 중</span>
        <button type="button" className="button button-small" onClick={() => setOpen(true)}>
          반납 처리
        </button>
      </span>
    );
  }

  const error = errors.returnedAt ?? errors._form;
  return (
    <form className="return-form" onSubmit={onSubmit} noValidate>
      <label className="sr-only" htmlFor={`returnedAt-${rental.id}`}>
        실제 반납일
      </label>
      <input
        id={`returnedAt-${rental.id}`}
        type="date"
        value={values.returnedAt}
        onChange={set('returnedAt')}
        aria-invalid={Boolean(error)}
      />
      <button className="button button-small" type="submit" disabled={submitting}>
        {submitting ? '처리 중…' : '반납 완료'}
      </button>
      <button type="button" className="button button-small button-secondary" onClick={() => setOpen(false)}>
        취소
      </button>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
