"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cx } from "./ui";

export type GalleryShot = {
  src: string;
  kind: "desktop" | "mobile";
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

const iconButton =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-sm border bg-surface text-text-primary hover:bg-surface-sunken disabled:text-text-muted disabled:hover:bg-surface";

/**
 * Screenshot grid. Each screenshot is a button that opens a modal viewer
 * (native <dialog>: focus trap and Escape for free). Arrow keys move between
 * screenshots; closing returns focus to the screenshot that opened it.
 */
export function Gallery({ shots, intro }: { shots: GalleryShot[]; intro?: string }) {
  const t = useTranslations("gallery");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggers = useRef<Array<HTMLButtonElement | null>>([]);
  const [index, setIndex] = useState<number | null>(null);

  const lastOpened = useRef<number | null>(null);
  const open = (i: number) => {
    lastOpened.current = i;
    setIndex(i);
  };

  // Open the dialog once its content exists, so autoFocus lands on Close.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (index !== null && dialog && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    }
  }, [index]);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const move = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + shots.length) % shots.length)),
    [shots.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.documentElement.style.overflow = "";
      const trigger = lastOpened.current === null ? null : triggers.current[lastOpened.current];
      setIndex(null);
      // Return focus to the screenshot that opened the viewer, after the dialog is gone.
      requestAnimationFrame(() => trigger?.focus());
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const current = index === null ? null : shots[index];
  const groups: Array<{ kind: "desktop" | "mobile"; items: Array<{ shot: GalleryShot; i: number }> }> = [];
  for (const kind of ["desktop", "mobile"] as const) {
    const items = shots.map((shot, i) => ({ shot, i })).filter((x) => x.shot.kind === kind);
    if (items.length) groups.push({ kind, items });
  }

  return (
    <div className="mt-8" data-testid="gallery">
      {intro && <p className="mb-6 text-[15px] text-text-muted">{intro}</p>}
      <div className="flex flex-col gap-8">
        {groups.map((g) => (
          <ul
            key={g.kind}
            className={cx(
              "grid gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-8",
              g.kind === "desktop"
                ? "grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))]"
                : "grid-cols-[repeat(auto-fill,minmax(140px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]",
            )}
          >
            {g.items.map(({ shot, i }) => (
              <li key={i}>
                <figure className="m-0">
                  <button
                    ref={(el) => {
                      triggers.current[i] = el;
                    }}
                    type="button"
                    onClick={() => open(i)}
                    aria-label={t("enlarge", { alt: shot.alt })}
                    className="relative block w-full cursor-zoom-in overflow-hidden rounded-md border bg-surface hover:outline-2 hover:-outline-offset-2 hover:outline-border-strong focus-visible:rounded-md focus-visible:-outline-offset-2"
                    style={{ aspectRatio: `${shot.width} / ${shot.height}` }}
                  >
                    <Image
                      src={shot.src}
                      alt=""
                      fill
                      sizes={g.kind === "desktop" ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                      className="object-cover object-top"
                      unoptimized={shot.src.endsWith(".svg")}
                    />
                  </button>
                  {shot.caption && (
                    <figcaption className="mt-3 max-w-(--measure) text-[15px] text-text-muted">{shot.caption}</figcaption>
                  )}
                </figure>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={t("viewer")}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(1);
          if (e.key === "ArrowLeft") move(-1);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[960px] max-w-[calc(100%-2rem)] overflow-auto rounded-md border bg-surface p-0 text-text-primary shadow-dialog backdrop:bg-(--scrim)"
      >
        {current && index !== null && (
          <div>
            <div className="flex items-center gap-3 border-b py-3 ps-5 pe-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[17px] font-semibold">{current.alt}</p>
                <p className="font-mono text-xs text-text-muted uppercase">
                  {t("counter", { index: index + 1, total: shots.length, kind: t(current.kind) })}
                </p>
              </div>
              <button type="button" autoFocus onClick={close} className={iconButton} aria-label={t("close")} title={t("close")}>
                <X size={20} strokeWidth={1.5} aria-hidden />
              </button>
            </div>
            <div className="px-5 pt-4">
              <div
                className="relative mx-auto max-h-[70dvh] overflow-hidden rounded-md border border-border-strong"
                style={{
                  aspectRatio: `${current.width} / ${current.height}`,
                  maxWidth: current.kind === "mobile" ? "min(100%, 360px)" : "100%",
                }}
              >
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="960px"
                  className="object-contain"
                  unoptimized={current.src.endsWith(".svg")}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 py-4 ps-5 pe-3">
              <p className="flex-1 text-sm text-text-muted">{current.caption}</p>
              <button type="button" onClick={() => move(-1)} className={iconButton} aria-label={t("previous")} title={t("previous")}>
                <ChevronLeft size={20} strokeWidth={1.5} aria-hidden className="rtl:-scale-x-100" />
              </button>
              <button type="button" onClick={() => move(1)} className={iconButton} aria-label={t("next")} title={t("next")}>
                <ChevronRight size={20} strokeWidth={1.5} aria-hidden className="rtl:-scale-x-100" />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
