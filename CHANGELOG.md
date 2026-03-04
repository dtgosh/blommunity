# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## 0.0.2 (2026-03-02)


### Features

* add authorId to post creation and update logic ([42e5aa3](https://github.com/dtgosh/blommunity/commit/42e5aa36ab5ace9ef7a87aace063bb5cc4258c25))
* add post DTOs and entities for create, update, and retrieval operations ([76ab2d3](https://github.com/dtgosh/blommunity/commit/76ab2d36df9bcaf291dac8b24e00ce6e70a4f4a7))
* bigint아이디 관리 데코레이터 추가 및 반영 ([57988c3](https://github.com/dtgosh/blommunity/commit/57988c3623e0a568ec58ae2c9a67f8125537d44a))
* consolidate auth decorators into a single file and remove redundant files ([96600d6](https://github.com/dtgosh/blommunity/commit/96600d61352ddc179b1a255f2b64f68caf8ff693))
* create Serialize decorator for consistent serialization across controllers ([73e2a17](https://github.com/dtgosh/blommunity/commit/73e2a173a6a8c355c2c32248b6614e0b59c11d68))
* enhance serialization for auth and posts controllers ([ee91276](https://github.com/dtgosh/blommunity/commit/ee91276909571b5cef4117e616a8e0ad437ceb82))
* implement AuthGuard and remove RoleGuard for streamlined authorization ([487eccf](https://github.com/dtgosh/blommunity/commit/487eccfd1692c6abf87605ad5a15891c36b3a668))
* implement cache module with async configuration and global access ([c7adb8f](https://github.com/dtgosh/blommunity/commit/c7adb8f8cdd127bd12de08163d32f1ed1122d7a3))
* implement FindAllPostsEntity and refactor post-related entities and services ([f98d4df](https://github.com/dtgosh/blommunity/commit/f98d4dfdfff3dde467fd776d605587a8889b8c4a))
* implement posts module with CRUD operations and DTOs ([de35f32](https://github.com/dtgosh/blommunity/commit/de35f3223936fb9f4ad906b022b13754975af5fb))
* integrate Swagger for API documentation and enhance DTOs with schemas ([9bd5fe3](https://github.com/dtgosh/blommunity/commit/9bd5fe3db918732016fea375426b11a4cb445d59))
* make groupId optional in CreatePostDto and update related database schema ([5ef4c1e](https://github.com/dtgosh/blommunity/commit/5ef4c1efc43ce80d6b6b8440a926e1c0c94f94ed))
* make UtilModule global to allow shared access across the application ([1cf1219](https://github.com/dtgosh/blommunity/commit/1cf12195928ca13e7645f9cf351c06f1814e5e97))
* refactor authentication logic and enhance user profile handling ([f13e39e](https://github.com/dtgosh/blommunity/commit/f13e39e4899c8a83c289895f6b49f97485e25964))
* refactor configuration management and enhance environment variable handling ([8699112](https://github.com/dtgosh/blommunity/commit/8699112220debb89864b62e5359d95b3f6f52b34))
* update CreatePostDto and FindAllPostsDto to use bigint and improve type consistency ([51fd929](https://github.com/dtgosh/blommunity/commit/51fd9294d9c2916eb82958309e4576406b373a5a))
* update dependencies and enhance account model ([a5bd840](https://github.com/dtgosh/blommunity/commit/a5bd84004c945b914370dc74186a0db0e09f62dc))
* update FindAllPostsDto and interfaces to enhance filtering options ([8a6a4d3](https://github.com/dtgosh/blommunity/commit/8a6a4d3487d4b1cca149439bf64f217a20ba3885))
* update Prisma client imports and configuration for new directory structure ([ee30d1c](https://github.com/dtgosh/blommunity/commit/ee30d1cd18f717c975c34a2e5674d515c6fc9ba5))


### Bug Fixes

* config관련 에러 수정 및 응집도 높이기 ([2421e0b](https://github.com/dtgosh/blommunity/commit/2421e0bb5c3ba99db8ffced436c1c29b3d70604e))
* remove allowUnknown option from environment variable validation ([5af133d](https://github.com/dtgosh/blommunity/commit/5af133d834f34fbbffe7bc1bf954b1c1d65fdd75))
* remove empty externals array from webpack configuration ([a581577](https://github.com/dtgosh/blommunity/commit/a5815774bcf5285381994f044141b69d99e36341))
* 빌드 에러 해결 ([b4c48c5](https://github.com/dtgosh/blommunity/commit/b4c48c5810f29690fa907e92bc33f856545db31f))
