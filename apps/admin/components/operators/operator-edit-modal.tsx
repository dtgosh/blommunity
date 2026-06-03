"use client";

import { useState } from "react";
import { useSubmit } from "@blommunity/frontend-core/hooks";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { useToast } from "@/components/ui/toast";
import { adminsControllerUpdate } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import type { components } from "@/lib/api/types";

/** A-AM-03 — edit an operator's name/email. */
export function OperatorEditModal({
  operator,
  onClose,
  onUpdated,
}: {
  operator: components["schemas"]["AdminEntity"];
  onClose: () => void;
  onUpdated: (updated: components["schemas"]["AdminEntity"]) => void;
}) {
  const toast = useToast();
  const [name, setName] = useState(operator.name);
  const [email, setEmail] = useState(operator.email);
  const { pending: submitting, error, run } = useSubmit();

  const dirty = name.trim() !== operator.name || email.trim() !== operator.email;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await run(async () => {
      const updated = (await adminsControllerUpdate({ client, path: { id: operator.id }, body: { name: name.trim(), email: email.trim() } })).data!;
      toast.success("운영자 정보를 저장했어요.");
      onUpdated(updated);
    }, "저장에 실패했어요.");
    if (ok) onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="운영자 정보 수정"
      width={420}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button
            type="submit"
            form="operator-edit-form"
            variant="primary"
            disabled={!dirty || submitting}
          >
            {submitting ? "저장 중…" : "저장"}
          </Button>
        </>
      }
    >
      <form
        id="operator-edit-form"
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <Field label="이름" htmlFor="op-name">
          <Input
            id="op-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Field>
        <Field label="이메일" htmlFor="op-email">
          <Input
            id="op-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        <FormError message={error} />
      </form>
    </Modal>
  );
}
