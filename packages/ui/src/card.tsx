import { cn } from "./cn";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-[10px] border border-line bg-surface-1", className)}
      {...props}
    >
      {children}
    </div>
  );
}
