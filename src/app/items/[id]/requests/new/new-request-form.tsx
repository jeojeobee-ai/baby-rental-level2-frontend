'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { ErrorBox, Field, FormMessage, ItemNotFound, Loading, StatusBadge } from '@/components/ui';
import { ageRange } from '@/lib/labels';
import { useForm } from '@/lib/use-form';
import { useItem } from '@/lib/use-item';

export default function NewRequestForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { state, reload } = useItem(id);
  const { values, set, errors, submitting, submit } = useForm({
    guardianName: '',
    guardianPhone: '',
    childAgeMonths: '',
    durationDays: '7',
  });

  if (state.kind === 'loading') return <Loading />;
  if (state.kind === 'not-found') return <ItemNotFound />;
  if (state.kind === 'error') return <ErrorBox message={state.message} onRetry={reload} />;
  const { item } = state;
  const days = Number(values.durationDays);
  const daysOk = values.durationDays.trim() !== '' && Number.isInteger(days) && days >= 1 && days <= 30;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const created = await submit(`/items/${item.id}/requests`, 'POST', values);
    if (created) router.push(`/items/${item.id}`);
  }

  return (
    <>
      <p className="breadcrumb">
        <Link href="/items">용품 목록</Link> / <Link href={`/items/${item.id}`}>{item.code}</Link> / 대여 신청
      </p>
      <h1>대여 신청</h1>
      <div className="item-summary">
        <span className="mono muted">{item.code}</span>
        <strong>{item.name}</strong>
        <span className="muted">{ageRange(item.minAgeMonths, item.maxAgeMonths)}</span>
        <StatusBadge status={item.status} />
      </div>
      {item.status !== 'AVAILABLE' && (
        <p className="notice">이 용품은 지금 &lsquo;대여 가능&rsquo; 상태가 아니라서 신청할 수 없어요. 저장하면 이유를 알려 드려요.</p>
      )}
      {item.hasPendingRequest && (
        <p className="notice">
          이미 신청 중인 건이 있어요. <Link href="/requests">신청 목록</Link>에서 먼저 처리해 주세요.
        </p>
      )}

      <form className="form" onSubmit={onSubmit} noValidate>
        <Field id="guardianName" label="보호자 이름" error={errors.guardianName}>
          <input id="guardianName" value={values.guardianName} onChange={set('guardianName')} placeholder="김하늘" />
        </Field>
        <Field id="guardianPhone" label="보호자 연락처" error={errors.guardianPhone} hint="010-1234-5678 형식">
          <input id="guardianPhone" type="tel" inputMode="tel" value={values.guardianPhone} onChange={set('guardianPhone')} placeholder="010-0000-0000" />
        </Field>
        <Field
          id="childAgeMonths"
          label="아기 월령 (개월)"
          error={errors.childAgeMonths}
          hint={`이 용품은 ${ageRange(item.minAgeMonths, item.maxAgeMonths)} 아기용이에요.`}
        >
          <input id="childAgeMonths" type="number" inputMode="numeric" value={values.childAgeMonths} onChange={set('childAgeMonths')} placeholder="8" />
        </Field>
        <Field
          id="durationDays"
          label="희망 대여 기간 (일)"
          error={errors.durationDays}
          hint={
            daysOk
              ? `대여 처리하는 날부터 ${days}일 뒤가 반납 예정일이에요. (1~30일)`
              : '대여 처리하는 날부터 N일 뒤가 반납 예정일이에요. (1~30일)'
          }
        >
          <input id="durationDays" type="number" inputMode="numeric" value={values.durationDays} onChange={set('durationDays')} placeholder="7" />
        </Field>
        <FormMessage message={errors._form} />
        <div className="form-actions">
          <Link className="button button-secondary" href={`/items/${item.id}`}>
            취소
          </Link>
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? '저장하는 중…' : '대여 신청 저장'}
          </button>
        </div>
      </form>
    </>
  );
}
