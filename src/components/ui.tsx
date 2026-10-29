import Link from 'next/link';
import type { ReactNode } from 'react';
import { STATUS_LABELS } from '@/lib/labels';
import type { ItemStatus } from '@/lib/types';

export function StatusBadge({ status }: { status: ItemStatus }) {
  return <span className={`badge badge-${status}`}>{STATUS_LABELS[status]}</span>;
}

export function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className={`field${error ? ' field-invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && (
        <p className="field-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="form-message" role="alert">
      {message}
    </p>
  );
}

export function Loading() {
  return <p className="state-box">불러오는 중이에요…</p>;
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="state-box state-error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="button button-secondary" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
}

export function ItemNotFound() {
  return (
    <div className="state-box">
      <p>찾는 용품이 없어요.</p>
      <Link className="button" href="/items">
        목록으로 돌아가기
      </Link>
    </div>
  );
}
