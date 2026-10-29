'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError, api } from './api';
import type { ItemDetail } from './types';

type State =
  | { kind: 'loading' }
  | { kind: 'ready'; item: ItemDetail }
  | { kind: 'not-found' }
  | { kind: 'error'; message: string };

// 용품 상세(B3)를 불러옵니다. 숫자가 아닌 주소나 404는 "없는 용품"으로 봅니다.
export function useItem(id: string) {
  const [state, setState] = useState<State>({ kind: 'loading' });

  const load = useCallback(async () => {
    if (!/^\d+$/.test(id)) {
      setState({ kind: 'not-found' });
      return;
    }
    try {
      const item = await api<ItemDetail>(`/items/${id}`);
      setState({ kind: 'ready', item });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) setState({ kind: 'not-found' });
      else setState({ kind: 'error', message: (error as Error).message });
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { state, reload: load };
}
