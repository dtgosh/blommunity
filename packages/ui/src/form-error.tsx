import { Icon } from "./icon";

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 rounded-lg border border-danger-bd bg-danger-bg px-3 py-2.5 text-[13px] text-danger">
      <Icon name="alertTriangle" size={15} className="mt-px shrink-0" />
      <span className="whitespace-pre-line">{message}</span>
    </div>
  );
}
