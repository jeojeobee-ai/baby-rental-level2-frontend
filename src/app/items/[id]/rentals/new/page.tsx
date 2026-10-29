import { Suspense } from 'react';
import { Loading } from '@/components/ui';
import NewRentalForm from './new-rental-form';

// S4. 대여 기록 등록
export default function NewRentalPage() {
  return (
    <Suspense fallback={<Loading />}>
      <NewRentalForm />
    </Suspense>
  );
}
