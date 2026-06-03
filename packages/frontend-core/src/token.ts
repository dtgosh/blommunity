/**
 * localStorage 기반 토큰 저장소 팩토리. 세 앱이 동일한 get/set/clear 로직을
 * 쓰되 키(`bl-console-token` / `bl-admin-token` / `bl-community-token`)만 다르다.
 * 토큰 종류·키는 앱별로 격리된다(X-SC-02): 각 앱이 자기 키로 한 번 호출한다.
 */
export interface TokenManager {
  getToken: () => string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export function createTokenManager(key: string): TokenManager {
  return {
    getToken() {
      if (typeof window === "undefined") return null;
      return window.localStorage.getItem(key);
    },
    setToken(token: string) {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(key, token);
    },
    clearToken() {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(key);
    },
  };
}
