import { createClient, createConfig } from "./generated/client";
import { ApiError, messageFromBody } from "@blommunity/types";

export * from "./generated/index";
export { createClient, createConfig };
export type { Client } from "./generated/client";

export type {
  AdminEntity,
  TenantEntity,
  UserEntity,
  SpaceEntity,
  SpaceUserEntity,
  BoardEntity,
  BoardUserEntity,
  PostEntity,
  CommentEntity,
} from "./generated/types.gen";

// openapi-fetch의 components["schemas"]["XEntity"] 패턴과 호환
export type components = {
  schemas: {
    AdminEntity: import("./generated/types.gen").AdminEntity;
    TenantEntity: import("./generated/types.gen").TenantEntity;
    UserEntity: import("./generated/types.gen").UserEntity;
    SpaceEntity: import("./generated/types.gen").SpaceEntity;
    SpaceUserEntity: import("./generated/types.gen").SpaceUserEntity;
    BoardEntity: import("./generated/types.gen").BoardEntity;
    BoardUserEntity: import("./generated/types.gen").BoardUserEntity;
    PostEntity: import("./generated/types.gen").PostEntity;
    CommentEntity: import("./generated/types.gen").CommentEntity;
  };
};

export interface ApiClientOptions {
  baseUrl: string;
  getToken: () => string | null;
  clearToken: () => void;
  /**
   * 인증된 요청이 401 을 받았을 때 호출된다(토큰 클리어 직후). 앱은 보통 여기에
   * 인메모리 인증 상태를 guest 로 떨어뜨리는 핸들러를 연결한다. 클라이언트는
   * 모듈 스코프에서 만들어지므로 이 콜백을 통해 React 인증 상태와 이어진다.
   */
  onUnauthorized?: () => void;
}

function defaultStatusMessage(status: number): string {
  switch (status) {
    case 400: return "요청이 올바르지 않아요.";
    case 401: return "로그인이 필요해요.";
    case 403: return "권한이 없어요.";
    case 404: return "대상을 찾을 수 없어요.";
    case 409: return "이미 존재하거나 충돌이 발생했어요.";
    default:  return status >= 500 ? "서버 오류가 발생했어요." : "요청을 처리하지 못했어요.";
  }
}

export function createApiClient({ baseUrl, getToken, clearToken, onUnauthorized }: ApiClientOptions) {
  const client = createClient(createConfig({ baseUrl, throwOnError: true }));

  client.interceptors.request.use((request) => {
    const token = getToken();
    if (token) request.headers.set("Authorization", `Bearer ${token}`);
    return request;
  });

  client.interceptors.response.use(async (response) => {
    if (response.status === 401 && getToken()) {
      clearToken();
      onUnauthorized?.();
    }
    if (!response.ok) {
      const body = await response.clone().json().catch(() => null);
      throw new ApiError(
        response.status,
        messageFromBody(body, defaultStatusMessage(response.status)),
        body,
      );
    }
    return response;
  });

  return client;
}

export function adminStatus(admin: import("./generated/types.gen").AdminEntity): "pending" | "approved" {
  return admin.approvedAt ? "approved" : "pending";
}
