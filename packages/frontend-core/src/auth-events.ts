/**
 * 전역 401 브리지. API 클라이언트의 응답 인터셉터는 React 바깥(모듈 스코프)에서
 * 만들어지므로, 401을 받으면 여기 등록된 핸들러(보통 AuthProvider의 logout)를
 * 호출해 인메모리 인증 상태를 즉시 guest로 떨어뜨린다. 토큰 클리어 자체는
 * createApiClient 인터셉터가 이미 수행한다.
 *
 * 앱마다 번들이 분리되므로 모듈 레벨 단일 핸들러로 충분하다(앱당 client 1개,
 * AuthProvider 1개).
 */
let handler: (() => void) | null = null;

export function setUnauthorizedHandler(fn: (() => void) | null): void {
  handler = fn;
}

export function emitUnauthorized(): void {
  handler?.();
}
