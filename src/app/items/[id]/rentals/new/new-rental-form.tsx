'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { ErrorBox, Field, FormMessage, ItemNotFound, Loading, StatusBadge } from '@/components/ui';
import { ageRange, today } from '@/lib/labels';
import { useForm } from '@/lib/use-form';
import { useItem } from '@/lib/use-item';

export default function NewRentalForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { state, reload } = useItem(id);
  const { values, set, errors, submitting, submit } = useForm({
    guardianName: '',
    guardianPhone: '',
    childAgeMonths: '',
    rentedAt: today(),
    dueDate: '',
  });

  if (state.kind === 'loading') return <Loading />;
  if (state.kind === 'not-found') return <ItemNotFound />;
  if (state.kind === 'error') return <ErrorBox message={state.message} onRetry={reload} />;
  const { item } = state;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const created = await submit(`/items/${item.id}/rentals`, 'POST', values);
    if (created) router.push(`/items/${item.id}`);
  }

  return (
    <>
      <p className="breadcrumb">
        <Link href="/items">용품 목록</Link> / <Link href={`/items/${item.id}`}>{item.code}</Link> / 대여 기록 추가
      </p>
      <h1>대여 기록 추가</h1>
      <div className="item-summary">
        <span className="mono muted">{item.code}</span>
        <strong>{item.name}</strong>
        <span className="muted">{ageRange(item.minAgeMonths, item.maxAgeMonths)}</span>
        <StatusBadge status={item.status} />
      </div>
      {item.status !== 'AVAILABLE' && (
        <p className="notice">이 용품은 지금 &lsquo;대여 가능&rsquo; 상태가 아니에요. 빌려주기 전에 상태를 꼭 확인해 주세요.</p>
      )}

      <form className="form" onSubmit={onSubmit} noValidate>
        <Field id="guardianName" label="보호자 이름" error={errors.guardianName}>
          <input id="guardianName" value={values.guardianName} onChange={set('guardianName')} placeholder="김하늘" />
        </Field>
        <Field id="guardianPhone" label="보호자 연락처" error={errors.guardianPhone} hint="010-1234-5678 형식">
          <input id="guardianPhone" type="tel" inputMode="tel" value={values.guardianPhone} onChange={set('guardianPhone')} placeholder="010-0000-0000" />
        </Field>
        <Field id="childAgeMonths" label="아기 월령 (개월)" error={errors.childAgeMonths}>
          <input id="childAgeMonths" type="number" inputMode="numeric" value={values.childAgeMonths} onChange={set('childAgeMonths')} placeholder="8" />
        </Field>
        <div className="field-row">
          <Field id="rentedAt" label="빌린 날" error={errors.rentedAt}>
            <input id="rentedAt" type="date" value={values.rentedAt} onChange={set('rentedAt')} />
          </Field>
          <Field id="dueDate" label="반납 예정일" error={errors.dueDate} hint="빌린 날부터 최대 30일">
            <input id="dueDate" type="date" value={values.dueDate} onChange={set('dueDate')} />
          </Field>
        </div>
        <FormMessage message={errors._form} />
        <div className="form-actions">
          <Link className="button button-secondary" href={`/items/${item.id}`}>
            취소
          </Link>
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? '저장하는 중…' : '대여 기록 저장'}
          </button>
        </div>
      </form>
    </>
  );
}
