// 내 프로필 — A-AC-03·04 + A-AM-02/03 (✅)
"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { LoadingRegion } from "@/components/ui/spinner";
import { ProfileHeader } from "@/components/profile/profile-header";
import { EditProfileForm } from "@/components/profile/edit-profile-form";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import type { components, CurrentAdmin } from "@/lib/api/types";

export default function ProfilePage() {
  const { user } = useAuth();

  // Local mirror of the editable fields so updates are reflected immediately —
  // the AuthProvider has no way to refresh `user` after an edit.
  const [overrides, setOverrides] = useState<{
    name?: string;
    email?: string | null;
  }>({});

  if (!user) return <LoadingRegion label="프로필을 불러오는 중…" />;

  const merged: CurrentAdmin = {
    ...user,
    name: overrides.name ?? user.name,
    email: overrides.email !== undefined ? overrides.email : user.email,
  };

  function onUpdated(admin: components["schemas"]["AdminEntity"]) {
    setOverrides({ name: admin.name, email: admin.email ?? null });
  }

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-6 px-5 py-6">
      <ProfileHeader admin={merged} />
      <EditProfileForm
        adminId={merged.id}
        initialName={merged.name}
        initialEmail={merged.email ?? ""}
        onUpdated={onUpdated}
      />
      <ChangePasswordForm />
    </div>
  );
}
