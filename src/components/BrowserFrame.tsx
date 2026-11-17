import type { ReactNode } from "react";
import { cx } from "./ui";

/** Browser chrome drawn with the system's own border and radius tokens. */
export function BrowserFrame({
  url,
  sampleDataLabel,
  caption,
  children,
  className,
}: {
  url: string;
  sampleDataLabel?: string;
  caption?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={cx("m-0 w-full", className)}>
      <div className="overflow-hidden rounded-md border border-border-strong bg-surface">
        <div className="flex h-11 items-center gap-2.5 border-b bg-surface-sunken px-3">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2.5 rounded-full border border-border-strong" />
            <span className="size-2.5 rounded-full border border-border-strong" />
            <span className="size-2.5 rounded-full border border-border-strong" />
          </span>
          <span
            aria-hidden
            className="flex h-7 min-w-0 flex-1 items-center truncate rounded-sm border bg-surface px-2.5 font-mono text-xs text-text-muted"
          >
            {url}
          </span>
          {sampleDataLabel && (
            <span className="inline-flex h-5 items-center rounded-xs border bg-warning-subtle px-[7px] font-mono text-[10px] whitespace-nowrap text-warning uppercase">
              {sampleDataLabel}
            </span>
          )}
        </div>
        <div className="relative aspect-[16/10] w-full">{children}</div>
      </div>
      {caption && <figcaption className="mt-2.5 max-w-(--measure) text-sm text-pretty text-text-muted">{caption}</figcaption>}
    </figure>
  );
}
