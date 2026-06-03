import type { Role } from "./enums";

/** base64url 세그먼트 → UTF-8 문자열. 브라우저(atob)와 Node(Buffer) 양쪽 지원. */
export function decodeJwtSegment(segment: string): string {
  const b64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  if (typeof atob === "function") {
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  return Buffer.from(padded, "base64").toString("utf-8");
}

export interface UserTokenPayload {
  type: "user";
  id: string;
  tenantId: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface AdminTokenPayload {
  type: "admin";
  id: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface CurrentUser {
  id: string;
  username: string;
  email?: string | null;
  role: Role;
  tenantId: string;
}
