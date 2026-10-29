import { Suspense } from 'react';
import { Loading } from '@/components/ui';
import ItemDetailView from './item-detail-view';

// S2. 용품 상세 (주소의 id는 화면이 열린 뒤에 읽으므로 Suspense로 감쌉니다)
export default function ItemDetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ItemDetailView />
    </Suspense>
  );
}
