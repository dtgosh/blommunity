import { createApiClient } from "@blommunity/api-client";
import { getToken, clearToken } from "./token";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api-proxy";

export const client = createApiClient({ baseUrl: BASE_URL, getToken, clearToken });
