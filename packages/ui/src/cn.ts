/** className 조이너 — falsy 값 필터링 후 공백으로 연결. */
export function cn(
  ...args: Array<string | false | null | undefined>
): string {
  return args.filter(Boolean).join(" ");
}
