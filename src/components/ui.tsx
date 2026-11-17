import type { ComponentProps, ReactNode } from "react";
import { CircleCheck, Info, LoaderCircle, TriangleAlert } from "lucide-react";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ---------- Button ---------- */

export type ButtonVariant = "primary" | "secondary" | "ghost";

export function buttonClass(variant: ButtonVariant = "primary", size: "md" | "sm" = "md", full = false) {
  return cx(
    "inline-flex items-center justify-center gap-2 rounded-sm border font-semibold leading-none whitespace-nowrap no-underline",
    "transition-[background-color,border-color,transform] duration-[120ms] ease-out-std active:translate-y-px",
    "hover:no-underline disabled:cursor-not-allowed aria-disabled:cursor-not-allowed",
    size === "md" ? "h-11 px-[18px] text-[15px]" : "h-9 px-3.5 text-sm",
    variant === "primary" &&
      "border-transparent bg-accent text-text-on-accent hover:bg-accent-hover hover:text-text-on-accent active:bg-accent-active disabled:border-border disabled:bg-surface-sunken disabled:text-text-muted",
    variant === "secondary" &&
      "border-border-strong bg-surface text-text-primary hover:bg-surface-sunken hover:text-text-primary disabled:border-border disabled:text-text-muted",
    variant === "ghost" &&
      "border-transparent bg-transparent text-text-primary hover:bg-surface-sunken hover:text-text-primary",
    full && "w-full",
  );
}

export const iconProps = { size: 18, strokeWidth: 1.5, "aria-hidden": true } as const;

export function Spinner({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <LoaderCircle
      size={size}
      strokeWidth={1.5}
      aria-hidden
      className={cx("animate-spin-ds shrink-0", className)}
    />
  );
}

/* ---------- Badges, tags ---------- */

export type BadgeTone = "live" | "neutral" | "accent" | "warning" | "danger";

export function StatusBadge({
  tone,
  size = "sm",
  children,
}: {
  tone: BadgeTone;
  size?: "sm" | "md";
  children: ReactNode;
}) {
  const dot = tone === "live" || tone === "neutral";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-[7px] rounded-sm border px-2.5 font-mono whitespace-nowrap",
        size === "md" ? "h-7 text-[13px]" : "h-6 text-xs",
        tone === "live" && "border-border bg-success-subtle text-success",
        tone === "neutral" && "border-border bg-surface-sunken text-text-muted",
        tone === "accent" && "border-accent-subtle-border bg-accent-subtle text-accent",
        tone === "warning" && "border-border bg-warning-subtle text-warning",
        tone === "danger" && "border-border bg-danger-subtle text-danger",
      )}
    >
      {dot && <span aria-hidden className="size-[7px] rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function Tag({ children, muted, size = "sm" }: { children: ReactNode; muted?: boolean; size?: "sm" | "md" }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-sm border bg-surface-sunken px-2.5 font-mono whitespace-nowrap",
        size === "md" ? "h-7 text-[13px]" : "h-[26px] text-xs",
        muted ? "text-text-muted" : "text-text-secondary",
      )}
    >
      {children}
    </span>
  );
}

/* ---------- Headings ---------- */

export function SectionHeading({
  number,
  children,
  id,
}: {
  number?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <h2 id={id} className="flex items-baseline gap-3.5 border-b pb-3.5 text-h2 scroll-mt-24">
      {number && <span className="font-mono text-[13px] font-medium text-text-muted">{number}</span>}
      <span>{children}</span>
    </h2>
  );
}

/* ---------- Callout, Alert ---------- */

export function Callout({
  label,
  tone = "neutral",
  icon = true,
  children,
  className,
}: {
  label?: string;
  tone?: "neutral" | "accent";
  icon?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cx(
        "flex max-w-(--measure) gap-3.5 rounded-md border px-5 py-[18px]",
        tone === "neutral" ? "border-border bg-surface-sunken" : "border-accent-subtle-border bg-accent-subtle",
        className,
      )}
    >
      {icon && <Info size={20} strokeWidth={1.5} aria-hidden className="mt-0.5 shrink-0 text-accent" />}
      <div className="min-w-0">
        {label && <p className="eyebrow mb-1">{label}</p>}
        <div className="text-base leading-[1.6]">{children}</div>
      </div>
    </aside>
  );
}

export type AlertTone = "info" | "success" | "warning" | "danger";

export function Alert({
  tone,
  title,
  children,
  icon,
  className,
  ...rest
}: {
  tone: AlertTone;
  title: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
} & Omit<ComponentProps<"div">, "title">) {
  const Icon = tone === "success" ? CircleCheck : tone === "info" ? Info : TriangleAlert;
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cx(
        "flex gap-3 rounded-md border px-4 py-3.5",
        tone === "info" && "bg-accent-subtle",
        tone === "success" && "bg-success-subtle",
        tone === "warning" && "bg-warning-subtle",
        tone === "danger" && "bg-danger-subtle",
        className,
      )}
      {...rest}
    >
      <span
        className={cx(
          "mt-0.5 shrink-0",
          tone === "info" && "text-accent",
          tone === "success" && "text-success",
          tone === "warning" && "text-warning",
          tone === "danger" && "text-danger",
        )}
      >
        {icon ?? <Icon size={20} strokeWidth={1.5} aria-hidden />}
      </span>
      <div className="min-w-0">
        <p className="text-[15px] font-semibold text-text-primary">{title}</p>
        {children && <div className="mt-0.5 text-[15px] text-text-secondary">{children}</div>}
      </div>
    </div>
  );
}

/* ---------- Empty state, skeleton ---------- */

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-md border border-dashed border-border-strong bg-surface px-6 py-8 text-center">
      <p className="text-h3">{title}</p>
      {description && <p className="mt-1.5 max-w-[40ch] text-[15px] text-text-secondary">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden className={cx("block animate-pulse-ds rounded-xs bg-surface-sunken", className)} />;
}

/** Visible marker for placeholder content that Wave 4 replaces. */
export function TodoMark({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-xs border border-dashed border-border-strong px-1.5 font-mono text-xs text-text-muted">
      {children}
    </span>
  );
}
