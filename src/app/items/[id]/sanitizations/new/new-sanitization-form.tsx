'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { ErrorBox, Field, FormMessage, ItemNotFound, Loading, StatusBadge } from '@/components/ui';
import { METHOD_LABELS, RESULT_LABELS, today } from '@/lib/labels';
import { useForm } from '@/lib/use-form';
import { useItem } from '@/lib/use-item';

export default function NewSanitizationForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { state, reload } = useItem(id);
  const { values, set, errors, submitting, submit } = useForm({
    sanitizedAt: today(),
    staffName: '',
    method: '',
    result: '',
    memo: '',
  });

  if (state.kind === 'loading') return <Loading />;
  if (state.kind === 'not-found') return <ItemNotFound />;
  if (state.kind === 'error') return <ErrorBox message={state.message} onRetry={reload} />;
  const { item } = state;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const created = await submit(`/items/${item.id}/sanitizations`, 'POST', values);
    if (created) router.push(`/items/${item.id}`);
  }

  return (
    <>
      <p className="breadcrumb">
        <Link href="/items">용품 목록</Link> / <Link href={`/items/${item.id}`}>{item.code}</Link> / 소독 기록 추가
      </p>
      <h1>소독 기록 추가</h1>
      <div className="item-summary">
        <span className="mono muted">{item.code}</span>
        <strong>{item.name}</strong>
        <StatusBadge status={item.status} />
      </div>

      <form className="form" onSubmit={onSubmit} noValidate>
        <Field id="sanitizedAt" label="소독한 날" error={errors.sanitizedAt}>
          <input id="sanitizedAt" type="date" value={values.sanitizedAt} onChange={set('sanitizedAt')} />
        </Field>
        <Field id="staffName" label="담당 직원" error={errors.staffName}>
          <input id="staffName" value={values.staffName} onChange={set('staffName')} placeholder="박지원" />
        </Field>
        <div className="field-row">
          <Field id="method" label="소독 방법" error={errors.method}>
            <select id="method" value={values.method} onChange={set('method')}>
              <option value="">골라 주세요</option>
              {Object.entries(METHOD_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field id="result" label="소독 결과" error={errors.result} hint="얼룩·냄새가 남았거나 파손을 발견하면 '소독 미완료'">
            <select id="result" value={values.result} onChange={set('result')}>
              <option value="">골라 주세요</option>
              {Object.entries(RESULT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field id="memo" label="메모 (선택)" error={errors.memo}>
          <textarea id="memo" value={values.memo} onChange={set('memo')} rows={3} placeholder="손잡이 얼룩 제거" />
        </Field>
        <FormMessage message={errors._form} />
        <div className="form-actions">
          <Link className="button button-secondary" href={`/items/${item.id}`}>
            취소
          </Link>
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? '저장하는 중…' : '소독 기록 저장'}
          </button>
        </div>
      </form>
    </>
  );
}
