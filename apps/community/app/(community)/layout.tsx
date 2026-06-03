import { RequireAuth } from "@/components/auth/require-auth";
import { PageShell } from "@/components/shell/page-shell";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <PageShell>{children}</PageShell>
    </RequireAuth>
  );
}
