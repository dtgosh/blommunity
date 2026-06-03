/** 시드 문자열로부터 안정적인 아바타 팔레트 인덱스(0..7)를 반환한다. */
export function avatarIdx(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 8;
}
