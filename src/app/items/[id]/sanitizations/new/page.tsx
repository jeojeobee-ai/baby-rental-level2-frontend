import { Suspense } from 'react';
import { Loading } from '@/components/ui';
import NewSanitizationForm from './new-sanitization-form';

// S5. 소독 기록 등록
export default function NewSanitizationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <NewSanitizationForm />
    </Suspense>
  );
}
