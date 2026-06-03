// 내 프로필 — T-AC-03~05 (✅)
"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { LoadingRegion } from "@/components/ui/spinner";
import { ProfileHeader } from "@/components/profile/profile-header";
import { EditProfileForm } from "@/components/profile/edit-profile-form";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { DeleteAccountCard } from "@/components/profile/delete-account-card";
import type { components, CurrentUser } from "@/lib/api/types";

export default function ProfilePage() {
  const { user } = useAuth();

  // Local mirror of the editable fields so updates are reflected immediately —
  // the AuthProvider has no way to refresh `user` after an edit.
  const [overrides, setOverrides] = useState<{
    username?: string;
    email?: string | null;
  }>({});

  if (!user) return <LoadingRegion label="프로필을 불러오는 중…" />;

  const merged: CurrentUser = {
    ...user,
    username: overrides.username ?? user.username,
    email: overrides.email !== undefined ? overrides.email : user.email,
  };

  function onUpdated(profile: components["schemas"]["UserEntity"]) {
    setOverrides({ username: profile.username, email: profile.email ?? null });
  }

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-6 px-5 py-6">
      <ProfileHeader user={merged} />
      <EditProfileForm
        initialUsername={merged.username}
        initialEmail={merged.email ?? ""}
        onUpdated={onUpdated}
      />
      <ChangePasswordForm />
      <DeleteAccountCard />
    </div>
  );
}
