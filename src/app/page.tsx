'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { ErrorBox, Loading } from '@/components/ui';
import { CONNECTION_MESSAGE, api } from '@/lib/api';
import type { Stats } from '@/lib/types';

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');

// S0. 현황: 전체 / 대여 중 / 대여 가능 숫자와 가상 데이터 초기화
export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      setStats(await api<Stats>('/stats'));
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
          <h1>현황</h1>
          <p className="muted">숫자를 누르면 해당 용품만 모아 볼 수 있어요.</p>
        </div>
      </div>

      {error ? (
        <ErrorBox message={error} onRetry={load} />
      ) : !stats ? (
        <Loading />
      ) : (
        <div className="stat-grid">
          <Link className="stat-card" href="/items">
            <span className="stat-label">전체 용품</span>
            <span className="stat-number">{stats.totalItems}</span>
          </Link>
          <Link className="stat-card stat-card-rented" href="/items?status=RENTED">
            <span className="stat-label">대여 중</span>
            <span className="stat-number">{stats.rented}</span>
          </Link>
          <Link className="stat-card stat-card-available" href="/items?status=AVAILABLE">
            <span className="stat-label">대여 가능</span>
            <span className="stat-number">{stats.available}</span>
          </Link>
        </div>
      )}

      <ResetBox onDone={load} />
    </>
  );
}

// B13. 가상 데이터 초기화. 토큰은 입력창에만 두고 저장하지 않으며, 보낸 뒤에는 성공·실패와 관계없이 비웁니다.
function ResetBox({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setDone('');
    try {
      const response = await fetch(`${API_URL}/admin/reset-demo`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-reset-token': token },
        cache: 'no-store',
      });
      const body = await response.json().catch(() => null);
      if (response.ok) {
        setDone(`가상 데이터로 되돌렸어요. (용품 ${body.items}개, 신청 ${body.requests}건)`);
        setOpen(false);
        onDone();
      } else if (response.status >= 500 || !body) {
        setError(CONNECTION_MESSAGE);
      } else {
        setError(body.errors?.token ?? body.message ?? '초기화하지 못했어요.');
      }
    } catch {
      setError(CONNECTION_MESSAGE);
    } finally {
      setToken('');
      setBusy(false);
    }
  }

  return (
    <section className="reset-box">
      <h2>가상 데이터 초기화</h2>
      <p className="muted">시연 중 바뀐 내용을 모두 지우고 처음 가상 데이터로 되돌려요. 되돌린 뒤에는 다시 복구할 수 없어요.</p>
      {!open ? (
        <button
          type="button"
          className="button button-secondary"
          onClick={() => {
            setOpen(true);
            setDone('');
            setError('');
          }}
        >
          초기화하기
        </button>
      ) : (
        <form className="reset-form" onSubmit={onSubmit} noValidate>
          <label htmlFor="reset-token">초기화 토큰</label>
          <input
            id="reset-token"
            type="password"
            autoComplete="off"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            aria-invalid={Boolean(error)}
          />
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          <p className="muted">용품·대여·소독·신청 기록이 모두 가상 데이터로 바뀝니다. 정말 초기화할까요?</p>
          <div className="form-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                setOpen(false);
                setToken('');
                setError('');
              }}
            >
              취소
            </button>
            <button className="button button-danger" type="submit" disabled={busy || token === ''}>
              {busy ? '초기화 중…' : '초기화 실행'}
            </button>
          </div>
        </form>
      )}
      {done && (
        <p className="result-message" role="status">
          {done}
        </p>
      )}
    </section>
  );
}
