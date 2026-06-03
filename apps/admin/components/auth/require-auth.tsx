// 인증 가드는 @blommunity/frontend-core/auth 의 createAuth 팩토리에서 생성되어
// auth-provider 가 re-export 한다. (앱별 차이는 createAuth 옵션으로 주입)
export { RequireAuth } from "./auth-provider";
