import { RequireAuth } from "@/components/auth/require-auth";
import { Shell } from "@/components/shell/shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <Shell>{children}</Shell>
    </RequireAuth>
  );
}
