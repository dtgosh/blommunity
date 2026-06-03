import { forwardRef } from "react";
import { cn } from "./cn";
import { INPUT_BASE } from "./input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, rows = 3, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(INPUT_BASE, "resize-none px-3 py-2.5 text-[13px] leading-relaxed", className)}
      {...props}
    />
  );
});
