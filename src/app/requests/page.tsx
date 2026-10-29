'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorBox, Loading } from '@/components/ui';
import { ApiError, api } from '@/lib/api';
import { REQUEST_STATUS_LABELS, elapsedText, kstDate } from '@/lib/labels';
import type { RentalRequest, RequestStatus } from '@/lib/types';

type Tab = RequestStatus | 'ALL';
const TABS: [Tab, string][] = [
  ['PENDING', '신청 중'],
  ['APPROVED', '대여 처리됨'],
  ['CANCELLED', '취소됨'],
  ['ALL', '전체'],
];

// S7. 신청 목록: 대여 처리와 신청 취소
export default function RequestsPage() {
  const [requests, setRequests] = useState<RentalRequest[] | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('PENDING');
  const [message, setMessage] = useState<{ id: number; text: string } | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setError('');
    try {
      setRequests(await api<RentalRequest[]>('/requests'));
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => (requests ?? []).filter((r) => tab === 'ALL' || r.status === tab), [requests, tab]);
  const count = (s: Tab) => (s === 'ALL' ? (requests ?? []).length : (requests ?? []).filter((r) => r.status === s).length);

  async function act(request: RentalRequest, kind: 'approve' | 'cancel') {
    const ok = window.confirm(
      kind === 'approve'
        ? `${request.item?.name ?? '용품'}을(를) ${request.guardianName} 보호자에게 오늘부터 ${request.durationDays}일간 대여 처리할까요?`
        : `${request.guardianName} 보호자의 신청을 취소할까요?`,
    );
    if (!ok) return;
    setBusyId(request.id);
    setMessage(null);
    try {
      if (kind === 'approve') await api(`/requests/${request.id}/approve`, { method: 'POST' });
      else await api(`/requests/${request.id}/cancel`, { method: 'PATCH' });
    } catch (e) {
      const err = e as ApiError;
      setMessage({ id: request.id, text: err.errors?._form ?? err.message });
    } finally {
      setBusyId(null);
      await load();
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>신청 목록</h1>
          <p className="muted">신청한 순서와 상관없이 직원이 판단해 대여 처리해요.</p>
        </div>
      </div>

      <div className="tabs" role="group" aria-label="신청 상태">
        {TABS.map(([value, label]) => (
          <button key={value} type="button" aria-pressed={tab === value} onClick={() => setTab(value)}>
            {label}
            {requests && ` ${count(value)}`}
          </button>
        ))}
      </div>

      {error ? (
        <ErrorBox message={error} onRetry={load} />
      ) : !requests ? (
        <Loading />
      ) : visible.length === 0 ? (
        <p className="state-box">{tab === 'PENDING' ? '신청 중인 건이 없어요.' : '해당하는 신청이 없어요.'}</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>용품</th>
              <th>보호자</th>
              <th>연락처</th>
              <th>아기 월령</th>
              <th>희망 기간</th>
              <th>신청 상태</th>
              <th>신청한 날</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((request) => (
              <tr key={request.id}>
                <td data-label="용품">
                  {request.item ? (
                    <Link href={`/items/${request.item.id}`}>
                      <span className="mono">{request.item.code}</span> {request.item.name}
                    </Link>
                  ) : (
                    '-'
                  )}
                </td>
                <td data-label="보호자" className="strong">{request.guardianName}</td>
                <td data-label="연락처" className="mono">{request.guardianPhone}</td>
                <td data-label="아기 월령">{request.childAgeMonths}개월</td>
                <td data-label="희망 기간">{request.durationDays}일</td>
                <td data-label="신청 상태">
                  <span className={`request-status request-status-${request.status}`}>{REQUEST_STATUS_LABELS[request.status]}</span>
                  {request.status === 'PENDING' && <span className="sub-text">{elapsedText(request.elapsedDays)}</span>}
                </td>
                <td data-label="신청한 날">{kstDate(request.createdAt)}</td>
                <td data-label="처리">
                  {request.status === 'PENDING' ? (
                    <div className="row-actions">
                      <button type="button" className="button button-small" disabled={busyId === request.id} onClick={() => act(request, 'approve')}>
                        대여 처리
                      </button>
                      <button type="button" className="button button-small button-secondary" disabled={busyId === request.id} onClick={() => act(request, 'cancel')}>
                        신청 취소
                      </button>
                    </div>
                  ) : (
                    <span className="muted">-</span>
                  )}
                  {message?.id === request.id && (
                    <p className="field-error" role="alert">
                      {message.text}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
