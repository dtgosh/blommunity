import { RedirectIfAuthed } from "@/components/auth/redirect-if-authed";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RedirectIfAuthed>{children}</RedirectIfAuthed>;
}
