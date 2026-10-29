// 백엔드 주소는 .env.local(내 컴퓨터) 또는 Vercel 환경변수에서 읽습니다.
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');

export const CONNECTION_MESSAGE = '잠시 연결이 원활하지 않아요. 잠시 뒤 다시 시도해 주세요.';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly errors: Record<string, string>,
    message: string,
  ) {
    super(message);
  }
}

export async function api<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: init?.method ?? 'GET',
      headers: { 'content-type': 'application/json' },
      body: init?.body === undefined ? undefined : JSON.stringify(init.body),
      cache: 'no-store',
    });
  } catch {
    throw new ApiError(0, {}, CONNECTION_MESSAGE);
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      response.status >= 500 || !body
        ? CONNECTION_MESSAGE
        : (body.message as string | undefined) ?? '입력한 내용을 다시 확인해 주세요.';
    throw new ApiError(response.status, body?.errors ?? {}, message);
  }
  return body as T;
}
