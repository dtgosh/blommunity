export interface NavItem {
  label: string;
  href: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV: NavSection[] = [
  {
    title: "시작하기",
    items: [
      { label: "개요", href: "/" },
      { label: "브랜드", href: "/foundations/brand" },
    ],
  },
  {
    title: "파운데이션",
    items: [
      { label: "컬러", href: "/foundations/colors" },
      { label: "타이포그래피", href: "/foundations/typography" },
      { label: "스페이싱", href: "/foundations/spacing" },
      { label: "라디우스", href: "/foundations/radius" },
    ],
  },
  {
    title: "컴포넌트",
    items: [
      { label: "버튼", href: "/components/button" },
      { label: "배지", href: "/components/badge" },
      { label: "아바타", href: "/components/avatar" },
      { label: "아이콘", href: "/components/icon" },
      { label: "인풋", href: "/components/input" },
      { label: "모달", href: "/components/modal" },
      { label: "토스트", href: "/components/toast" },
      { label: "카드", href: "/components/card" },
      { label: "스피너", href: "/components/spinner" },
      { label: "빈 상태", href: "/components/empty-state" },
    ],
  },
];
