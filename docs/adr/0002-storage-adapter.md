# ADR 0002 — 파일 스토리지 어댑터

- **Status**: Accepted
- **작성일**: 2026-05-29
- **기준**: blommunity v0.1.1
- **관련**: X-MD-01(파일 업로드), X-MD-02(S3 호환 스토리지), X-MD-03(이미지 리사이즈), X-MD-05(스토리지 사용량), U-PT-06(게시물 첨부)

> 파일·이미지 업로드(v0.3.0 Media)를 앞두고, **무엇에 파일을 저장할 것인가**를 결정합니다.

---

## Context

게시물에 이미지·파일을 첨부하는 기능(U-PT-06, X-MD-01)을 만들려면 객체 스토리지가 필요합니다. 그런데 Blommunity는 **배포 형태가 한 가지가 아닙니다.**

- 누군가는 코드를 fork해서 **자체 호스팅**합니다. 이 경우 외부 클라우드 없이 로컬 디스크나 사내 스토리지(MinIO·SeaweedFS 등)에 저장하고 싶을 수 있습니다.
- 누군가는 **관리형 클라우드**(AWS S3, Cloudflare R2 등)에 올립니다.
- 개발자는 **로컬에서** 클라우드 없이 바로 돌려보고 싶습니다.

스토리지를 한 곳에 못 박으면(예: AWS S3 SDK를 코드 곳곳에 직접 호출), fork 친화도가 떨어지고 로컬 개발이 번거로워집니다. 반대로 도구마다 다른 코드를 쓰면 분기가 늘어 복잡해집니다.

목표: **저장 위치는 환경변수로 갈아끼우고, 애플리케이션 코드는 스토리지가 무엇인지 몰라도 되게 한다.**

---

## Decision

**`StorageAdapter` 인터페이스**를 도입하고, v1.0 범위에서 **두 개의 구현체**를 제공합니다.

```ts
// 개념 스케치
interface StorageAdapter {
  // 업로드용 presigned URL 발급 (PUT 방식)
  createUploadUrl(key: string, opts: { contentType: string; maxSize: number }): Promise<{ url: string; key: string }>;
  // 다운로드/조회 URL (CDN 치환 포함)
  getPublicUrl(key: string): string;
  // 객체 삭제
  delete(key: string): Promise<void>;
  // 존재 확인 / 메타데이터
  head(key: string): Promise<{ size: number; contentType: string } | null>;
}
```

구현체:
- **`LocalStorageAdapter`** — 로컬 파일시스템에 저장. 개발·자체 호스팅용. `STORAGE_LOCAL_PATH` 경로 아래에 보관하고, 앱이 직접 서빙합니다.
- **`S3StorageAdapter`** — S3 호환 API를 쓰는 모든 스토리지. AWS S3, Cloudflare R2, Backblaze B2, MinIO, SeaweedFS, RustFS, LocalStack 등이 **모두 같은 어댑터 하나로** 처리됩니다(엔드포인트·자격증명만 다름).

### 드라이버 선택
- 환경변수 **`STORAGE_DRIVER`** (`local` | `s3`)로 구현체를 고릅니다.
- **dev 기본값: `STORAGE_DRIVER=local`** — 클라우드 설정 없이 바로 개발 가능.

### prod 권장
- **1순위 권장: Cloudflare R2.** egress(데이터 전송) 비용이 무료이고 CDN이 자동으로 포함되어, 커뮤니티 서비스(이미지가 많이 읽힘)에 비용 구조가 유리합니다.
- **대안**: AWS S3(생태계 표준), Backblaze B2(저렴), 자체 호스팅이면 SeaweedFS.
- 셋 다 **S3 호환**이므로 `S3StorageAdapter` 하나로 충분합니다.

### Presigned URL 전략
- **PUT 방식만** 사용합니다. 클라이언트가 발급받은 URL로 직접 PUT 업로드해, 서버는 파일 바이트를 거치지 않습니다(서버 부하·대역폭 절감).
- **POST(policy form) 방식은 v1.1+로 미룹니다.** POST는 다중 필드·정책 서명이 더 유연하지만 구현·검증이 복잡합니다. v1.0은 PUT으로 단순하게 갑니다.

### CDN
- 환경변수 **`CDN_BASE_URL`**(옵션)이 설정되면, 조회 URL의 호스트를 CDN 호스트로 **치환**합니다. 예: 원본 `https://<bucket>.r2.example.com/<key>` → `https://cdn.mysite.com/<key>`.
- 미설정 시 스토리지의 기본 공개 URL을 씁니다.

### 추가 환경변수 키
[secret.config.ts](../../libs/config/src/configs/secret.config.ts)의 현재 3개(`DATABASE_URL`/`CACHE_URL`/`JWT_SECRET`)에 다음을 더합니다.

| 키 | 조건 | 설명 |
|----|------|------|
| `STORAGE_DRIVER` | 필수 | `local` 또는 `s3` (dev 기본 `local`) |
| `STORAGE_LOCAL_PATH` | `local`일 때 | 로컬 저장 루트 경로 |
| `S3_ENDPOINT` | `s3`일 때 | S3 호환 엔드포인트 URL (R2/B2/MinIO 등) |
| `S3_REGION` | `s3`일 때 | 리전 (R2는 `auto` 등) |
| `S3_BUCKET` | `s3`일 때 | 버킷 이름 |
| `S3_ACCESS_KEY` | `s3`일 때 | 액세스 키 |
| `S3_SECRET_KEY` | `s3`일 때 | 시크릿 키 |
| `S3_FORCE_PATH_STYLE` | `s3`일 때 | path-style 강제 여부(MinIO 등에서 필요) |
| `CDN_BASE_URL` | 옵션 | 설정 시 조회 URL 호스트 치환 |

> Joi 검증은 `STORAGE_DRIVER` 값에 따라 조건부로 묶습니다(예: `s3`면 `S3_*` 필수). 자세한 env 정책은 [nfr.md](../nfr.md)와 함께 봅니다.

---

## Consequences

### 좋아지는 점
- **환경변수 전환만으로 저장 위치가 바뀝니다.** 코드 변경 없이 dev(local) → prod(R2/S3)로 이동합니다.
- **S3 호환 도구가 전부 한 어댑터로 처리됩니다.** LocalStack(테스트), SeaweedFS·RustFS·MinIO(자체 호스팅), R2·B2·S3(관리형)이 모두 `S3StorageAdapter`로 동작합니다. 도구가 늘어도 어댑터는 안 늘어납니다.
- **서버가 파일 바이트를 거치지 않습니다.** presigned PUT으로 클라이언트가 직접 올리므로 API 서버 부하·대역폭이 절약됩니다.
- **fork 친화적입니다.** 자체 호스팅하려는 사람이 클라우드 계정 없이 시작할 수 있습니다.

### 감수해야 하는 점
- **인터페이스 추상화 비용.** 어댑터 경계를 유지해야 하므로, 스토리지별 고유 기능(예: R2의 특정 헤더)을 쓰기 어렵습니다. 공통분모에 맞춥니다.
- **`LocalStorageAdapter`는 운영용이 아닙니다.** 단일 서버 디스크에 묶이므로 수평 확장·CDN과 맞지 않습니다. 개발·소규모 자체 호스팅 한정으로 명시합니다.
- presigned URL 발급·만료·키 네임스페이스(테넌트별 경로) 규칙을 일관되게 관리해야 합니다.

---

## Alternatives Considered

### A. 어댑터 없이 S3만 강제 — 기각
S3 SDK를 직접 쓰고 S3(호환)만 지원하는 방식. 가장 단순합니다.

**기각 이유:** fork해서 자체 호스팅하려는 사람과 로컬 개발자에게 진입 장벽이 됩니다. 클라우드 계정·자격증명 없이는 한 줄도 못 돌립니다. 제품 원칙("직접 호스팅하거나 확장할 수 있다")과 어긋납니다.

### B. 도구별 어댑터를 따로 분리(R2Adapter, MinIOAdapter, B2Adapter…) — 기각
스토리지 종류마다 전용 어댑터를 둡니다.

**기각 이유:** 이들은 전부 S3 호환 API를 쓰므로 **불필요한 복잡도**입니다. 엔드포인트·자격증명·path-style 옵션만 다를 뿐 코드가 같습니다. 하나의 `S3StorageAdapter`로 충분하고, 차이는 환경변수로 흡수합니다.

---

## 열어둔 항목 (v0.3.0 구현 중 결정)

- **이미지 리사이즈(X-MD-03)의 구현 위치** — 두 갈래를 열어 둡니다.
  - **동기 핸들러**: 업로드 직후 요청 안에서 썸네일을 만든다. 단순하지만 응답이 느려지고 API 서버가 CPU를 씁니다.
  - **비동기 워커(배치)**: 업로드는 즉시 받고, 리사이즈는 큐/배치에서 처리한다. 응답이 빠르고 부하 분리가 되지만 인프라(큐·워커)가 늘고 "아직 썸네일 없음" 상태를 다뤄야 합니다.
  - 결정은 v0.3.0 Media 구현 시점에 트래픽·인프라 상황을 보고 내립니다. 이 ADR은 어댑터 인터페이스만 고정하고, 리사이즈 위치는 미정으로 둡니다.

---

*ADR 0002 / 작성일: 2026-05-29 / Status: Accepted*
