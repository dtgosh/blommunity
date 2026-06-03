"use client";

// 사업자(테넌트) 관리 — A-TN-01~04 (✅). 목록/상세/이름수정/삭제.
// 정지·재개(A-TN-05)·사용량(A-TN-06)은 백엔드 미구현(📅).
import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { tenantsControllerFindAll, tenantsControllerRemove } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/types";
import { TenantListItem } from "./tenant-list-item";
import { TenantDetail } from "./tenant-detail";
import { TenantEditModal } from "./tenant-edit-modal";

export function TenantsScreen() {
  const toast = useToast();

  const [tenants, setTenants] = useState<components["schemas"]["TenantEntity"][] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const loadList = useCallback(async (selectFirst = false) => {
    setListError(null);
    try {
      const data = (await tenantsControllerFindAll({ client })).data!;
      setTenants(data);
      if (selectFirst && data.length > 0) {
        setSelectedId((cur) => cur ?? data[0].id);
      }
    } catch (err) {
      setTenants([]);
      setListError(
        err instanceof ApiError ? err.message : "테넌트 목록을 불러오지 못했어요.",
      );
    }
  }, []);

  useEffect(() => {
    void loadList(true);
  }, [loadList]);

  const selected = useMemo(
    () => tenants?.find((t) => t.id === selectedId) ?? null,
    [tenants, selectedId],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tenants ?? [];
    return (tenants ?? []).filter((t) => t.name.toLowerCase().includes(q));
  }, [tenants, query]);

  async function handleRemove(tenant: components["schemas"]["TenantEntity"]) {
    try {
      await tenantsControllerRemove({ client, path: { id: tenant.id } });
      toast.success("테넌트를 삭제했어요.");
      if (selectedId === tenant.id) setSelectedId(null);
      await loadList();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "삭제에 실패했어요.");
    }
  }

  function handleUpdated(updated: components["schemas"]["TenantEntity"]) {
    setTenants(
      (prev) => prev?.map((t) => (t.id === updated.id ? updated : t)) ?? null,
    );
  }

  return (
    <div className="flex h-full flex-col gap-[18px] overflow-hidden p-4 lg:flex-row lg:p-[22px]">
      {/* Left — master list */}
      <div className="flex w-full shrink-0 flex-col max-lg:max-h-[42vh] lg:w-[326px]">
        <div className="mb-3.5 flex items-center">
          <h1 className="flex-1 text-base font-bold tracking-tight text-ink">
            사업자{" "}
            {tenants && (
              <span className="bl-tnum font-semibold text-ink-3">
                {tenants.length}
              </span>
            )}
          </h1>
        </div>

        <div className="mb-3.5 flex h-[38px] items-center gap-2 rounded-[7px] border border-line-strong bg-surface-1 px-2.5">
          <Icon name="search" size={16} className="text-ink-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="테넌트 이름 검색"
            aria-label="테넌트 이름 검색"
            className="flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-3"
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-auto">
          {tenants === null ? (
            <div className="flex justify-center py-10">
              <Spinner size={22} />
            </div>
          ) : listError ? (
            <EmptyState
              tone="danger"
              title="불러오기 실패"
              description={listError}
              action={
                <Button size="sm" variant="secondary" icon="refresh" onClick={() => loadList(true)}>
                  다시 시도
                </Button>
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="building"
              title={query ? "검색 결과가 없어요" : "아직 사업자가 없어요"}
              description={
                query
                  ? `‘${query}’와 일치하는 테넌트가 없어요.`
                  : "사업자가 콘솔에서 가입하면 여기에 표시돼요."
              }
            />
          ) : (
            filtered.map((t) => (
              <TenantListItem
                key={t.id}
                tenant={t}
                selected={t.id === selectedId}
                onClick={() => setSelectedId(t.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right — detail */}
      {selected ? (
        <TenantDetail
          tenant={selected}
          onEdit={() => setEditing(true)}
          onRemove={() => handleRemove(selected)}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-[10px] border border-line bg-surface-1">
          <EmptyState
            icon="building"
            title="사업자를 선택하세요"
            description="왼쪽 목록에서 테넌트를 선택하면 상세 정보와 관리 동작이 보여요."
          />
        </div>
      )}

      {/* Edit modal */}
      {selected && editing && (
        <TenantEditModal
          tenant={selected}
          onClose={() => setEditing(false)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}
