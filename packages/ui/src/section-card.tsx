import { Card } from "./card";

/** 프로필 화면 등에서 공통으로 쓰이는 제목 있는 섹션 카드. */
export function SectionCard({
  title,
  description,
  children,
  danger,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <Card className={danger ? "border-danger-bd bg-danger-bg p-5" : "p-5"}>
      <div className="mb-4">
        <h3 className={"text-[14px] font-semibold " + (danger ? "text-danger" : "text-ink")}>
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-[12.5px] leading-relaxed text-ink-3">{description}</p>
        )}
      </div>
      {children}
    </Card>
  );
}
