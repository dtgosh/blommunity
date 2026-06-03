"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/auth/auth-provider";
import { usersControllerRemove } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { SectionCard } from "./section-card";

/** 계정 탈퇴 (T-AC-05) — soft-delete my account, then log out. */
export function DeleteAccountCard() {
  const router = useRouter();
  const toast = useToast();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  async function onConfirm() {
    await usersControllerRemove({ client });
    toast.success("계정을 탈퇴했어요.");
    logout();
    router.replace("/login");
  }

  return (
    <>
      <SectionCard
        danger
        title="계정 탈퇴"
        description="탈퇴하면 계정이 비활성화돼요. 되돌릴 수 없어요."
      >
        <div className="flex justify-end">
          <Button
            variant="danger"
            icon="trash"
            onClick={() => setOpen(true)}
            type="button"
          >
            탈퇴
          </Button>
        </div>
      </SectionCard>

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        title="정말 탈퇴할까요?"
        description="계정이 비활성화되고 다시 로그인할 수 없어요."
        confirmLabel="탈퇴"
      />
    </>
  );
}
