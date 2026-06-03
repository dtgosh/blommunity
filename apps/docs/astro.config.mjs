import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "blommunity",
      description: "blommunity 사용자 가이드 — 테넌트 운영자와 커뮤니티 멤버를 위한 안내서",
      defaultLocale: "ko",
      locales: {
        root: { label: "한국어", lang: "ko" },
      },
      logo: {
        light: "./src/assets/logo-light.svg",
        dark: "./src/assets/logo-dark.svg",
        replacesTitle: true,
      },
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/dtgosh/blommunity" },
      ],
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "시작하기",
          items: [
            { label: "blommunity란?", slug: "intro" },
            { label: "기본 개념", slug: "concepts" },
          ],
        },
        {
          label: "테넌트 운영자",
          collapsed: false,
          items: [
            { label: "커뮤니티 만들기", slug: "tenants/setup" },
            { label: "스페이스 관리", slug: "tenants/spaces" },
            { label: "게시판 관리", slug: "tenants/boards" },
            { label: "멤버 관리", slug: "tenants/members" },
            { label: "설정", slug: "tenants/settings" },
          ],
        },
        {
          label: "커뮤니티 멤버",
          collapsed: false,
          items: [
            { label: "커뮤니티 참여하기", slug: "members/join" },
            { label: "글쓰기와 댓글", slug: "members/posting" },
            { label: "초대 수락하기", slug: "members/invitations" },
            { label: "프로필 관리", slug: "members/profile" },
          ],
        },
        {
          label: "참고",
          items: [
            { label: "용어 설명", slug: "reference/glossary" },
            { label: "역할과 권한", slug: "reference/roles" },
          ],
        },
      ],
    }),
  ],
});
