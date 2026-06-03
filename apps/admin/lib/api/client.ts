import { createApiClient } from "@blommunity/api-client";
import { emitUnauthorized } from "@blommunity/frontend-core/auth-events";
import { getToken, clearToken } from "./token";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api-proxy";

// 401 시 토큰 클리어는 인터셉터가, 인메모리 인증 상태 guest 전환은 emitUnauthorized →
// AuthProvider 가 처리한다.
export const client = createApiClient({
  baseUrl: BASE_URL,
  getToken,
  clearToken,
  onUnauthorized: emitUnauthorized,
});
