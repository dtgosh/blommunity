import { RequireAuth } from "@/components/auth/require-auth";
import { PageShell } from "@/components/shell/page-shell";
import { UserNamesProvider } from "@/components/providers/user-names-provider";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <UserNamesProvider>
        <PageShell>{children}</PageShell>
      </UserNamesProvider>
    </RequireAuth>
  );
}
