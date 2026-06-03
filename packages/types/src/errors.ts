/** API 클라이언트가 non-2xx 응답 또는 네트워크 오류 시 던지는 에러. */
export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

/**
 * NestJS 에러 바디 `{ statusCode, message, error }` 에서 사람이 읽을 수 있는
 * 메시지를 추출. `message` 가 string[] 이면 줄바꿈으로 합친다.
 */
export function messageFromBody(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "message" in body) {
    const m = (body as { message: unknown }).message;
    if (Array.isArray(m)) return m.join("\n");
    if (typeof m === "string") return m;
  }
  if (typeof body === "string" && body.trim()) return body;
  return fallback;
}
