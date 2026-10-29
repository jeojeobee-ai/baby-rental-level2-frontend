import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="state-box">
      <p>찾는 화면이 없어요.</p>
      <Link className="button" href="/items">
        목록으로 돌아가기
      </Link>
    </div>
  );
}
