"use client";

import { useState } from "react";
import { useSubmit } from "@blommunity/frontend-core/hooks";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { useToast } from "@/components/ui/toast";
import { tenantsControllerUpdate } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import type { components } from "@/lib/api/types";

/** A-TN-03 — edit a tenant's name. */
export function TenantEditModal({
  tenant,
  onClose,
  onUpdated,
}: {
  tenant: components["schemas"]["TenantEntity"];
  onClose: () => void;
  onUpdated: (updated: components["schemas"]["TenantEntity"]) => void;
}) {
  const toast = useToast();
  const [name, setName] = useState(tenant.name);
  const { pending: submitting, error, run } = useSubmit();

  const dirty = name.trim() !== tenant.name;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await run(async () => {
      const updated = (await tenantsControllerUpdate({ client, path: { id: tenant.id }, body: { name: name.trim() } })).data!;
      toast.success("테넌트 이름을 저장했어요.");
      onUpdated(updated);
    }, "저장에 실패했어요.");
    if (ok) onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="테넌트 이름 수정"
      width={420}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button
            type="submit"
            form="tenant-edit-form"
            variant="primary"
            disabled={!dirty || submitting}
          >
            {submitting ? "저장 중…" : "저장"}
          </Button>
        </>
      }
    >
      <form id="tenant-edit-form" onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="테넌트 이름" htmlFor="tenant-name">
          <Input
            id="tenant-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Field>

        <FormError message={error} />
      </form>
    </Modal>
  );
}
