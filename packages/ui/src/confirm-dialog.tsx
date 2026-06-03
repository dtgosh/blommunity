"use client";

import { useState } from "react";
import { ApiError } from "@blommunity/types";
import { Modal } from "./modal";
import { Button } from "./button";
import { FormError } from "./form-error";

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "삭제",
  danger = true,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setError(null);
    setBusy(true);
    try {
      await onConfirm();
      setBusy(false);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "처리하지 못했어요.");
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      width={420}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} type="button">
            취소
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            onClick={confirm}
            disabled={busy}
            type="button"
          >
            {busy ? "처리 중…" : confirmLabel}
          </Button>
        </>
      }
    >
      <FormError message={error} />
      {!error && (
        <p className="text-[13px] leading-relaxed text-ink-2">
          이 작업은 되돌릴 수 없어요.
        </p>
      )}
    </Modal>
  );
}
