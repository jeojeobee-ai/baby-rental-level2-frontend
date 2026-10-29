import { Suspense } from 'react';
import { Loading } from '@/components/ui';
import NewRequestForm from './new-request-form';

// S6. 대여 신청 등록
export default function NewRequestPage() {
  return (
    <Suspense fallback={<Loading />}>
      <NewRequestForm />
    </Suspense>
  );
}
