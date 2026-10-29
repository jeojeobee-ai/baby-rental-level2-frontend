'use client';

import { useState } from 'react';
import { ApiError, api } from './api';

// 입력값은 저장에 실패해도 지우지 않고, 백엔드가 돌려준 칸별 안내를 그대로 보여 줍니다.
export function useForm<T extends Record<string, string>>(initial: T) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof T) => (event: { target: { value: string } }) => {
    const value = event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
  };

  async function submit<R>(path: string, method: string, body: unknown): Promise<R | null> {
    setSubmitting(true);
    setErrors({});
    try {
      return await api<R>(path, { method, body });
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.errors).length > 0) setErrors(error.errors);
      else setErrors({ _form: (error as Error).message });
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  return { values, set, errors, submitting, submit };
}
