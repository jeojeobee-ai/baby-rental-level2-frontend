import { redirect } from 'next/navigation';

// 첫 화면은 용품 목록(S1)입니다.
export default function Home() {
  redirect('/items');
}
