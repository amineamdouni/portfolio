"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Spinner, StatusBadge, buttonClass, iconProps } from "./ui";

const W = 390;
const H = 844;
const LOAD_TIMEOUT_MS = 20_000;

type State = "idle" | "loading" | "ready" | "failed";

/**
 * Interactive mobile demo. From 768px: the demo in an iframe rendered at
 * 390 × 844 and scaled to fit a fixed-ratio box (no layout shift). Under
 * 768px: no iframe, an "Open demo full screen" button instead. If the embed
 * does not load, the box shows the fallback screenshot and the gallery below
 * carries the rest.
 */
export function PhoneFrame({
  title,
  demoUrl,
  fallbackSrc,
}: {
  title: string;
  demoUrl: string | null;
  /** First mobile screenshot, shown when the embed is missing or fails. */
  fallbackSrc: string;
}) {
  const t = useTranslations("demo");
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [state, setState] = useState<State>("idle");
  const [attempt, setAttempt] = useState(0);

  // Mount the iframe only on screens where the frame is visible.
  useEffect(() => {
    if (!demoUrl) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setState((s) => (mq.matches ? (s === "idle" ? "loading" : s) : "idle"));
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [demoUrl]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (state !== "loading") return;
    const timer = window.setTimeout(() => setState("failed"), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [state, attempt]);

  const showIframe = demoUrl && (state === "loading" || state === "ready");

  return (
    <div>
      {/* Phones: no frame, a full-screen button instead. */}
      <div className="flex flex-col gap-4 md:hidden">
        <span className="self-start">
          <StatusBadge tone="warning" size="md">
            {t("sampleData")}
          </StatusBadge>
        </span>
        {demoUrl ? (
          <a href={demoUrl} target="_blank" rel="noreferrer noopener" className={buttonClass("primary", "md", true)}>
            <Maximize {...iconProps} />
            {t("openFullScreen")}
          </a>
        ) : (
          <p className="text-[15px] text-text-secondary">{t("notDeployed")}</p>
        )}
        <p className="text-sm text-text-muted">{t("fullScreenNote")}</p>
      </div>

      {/* Tablet and up: the phone frame. */}
      <figure className="m-0 hidden w-full max-w-[390px] md:block">
        <div className="overflow-hidden rounded-md border border-border-strong bg-surface">
          <div className="flex h-[34px] items-center gap-2 border-b bg-surface-sunken px-3">
            <span className="font-mono text-[11px] text-text-muted">
              {W} × {H}
            </span>
            <span className="ms-auto inline-flex h-5 items-center rounded-xs border bg-warning-subtle px-[7px] font-mono text-[10px] whitespace-nowrap text-warning uppercase">
              {t("sampleData")}
            </span>
          </div>
          <div ref={boxRef} className="relative aspect-[390/844] w-full overflow-hidden bg-surface">
            {showIframe && (
              <iframe
                key={attempt}
                src={demoUrl}
                title={t("frameTitle", { title })}
                width={W}
                height={H}
                loading="lazy"
                onLoad={() => setState("ready")}
                className="absolute top-0 left-0 origin-top-left border-0"
                style={{ transform: `scale(${scale})`, width: W, height: H }}
              />
            )}
            {(state === "idle" || state === "failed" || !demoUrl) && (
              // eslint-disable-next-line @next/next/no-img-element -- fixed-ratio fallback, may be an SVG placeholder
              <img src={fallbackSrc} alt="" className="absolute inset-0 size-full object-cover object-top" />
            )}
            {state === "loading" && (
              <div
                role="status"
                className="absolute inset-0 flex items-center justify-center gap-2 bg-surface text-[15px] text-text-secondary"
              >
                <Spinner className="text-accent" />
                {t("loading")}
              </div>
            )}
            {(state === "failed" || !demoUrl) && (
              <div className="absolute inset-x-3 bottom-3 rounded-md border bg-surface p-4 shadow-menu">
                {demoUrl ? (
                  <>
                    <p className="text-[17px] font-semibold">{t("failedTitle")}</p>
                    <p className="mt-1 text-[15px] text-text-secondary">{t("failedBody")}</p>
                    <button
                      type="button"
                      className={`${buttonClass("secondary", "sm")} mt-3`}
                      onClick={() => {
                        setAttempt((a) => a + 1);
                        setState("loading");
                      }}
                    >
                      <RotateCw {...iconProps} />
                      {t("reload")}
                    </button>
                  </>
                ) : (
                  <p className="text-[15px] text-text-secondary">{t("notDeployed")}</p>
                )}
              </div>
            )}
          </div>
        </div>
        <figcaption className="mt-2.5 max-w-(--measure) text-sm text-pretty text-text-muted">
          {t("mobileNotice")}
        </figcaption>
      </figure>
    </div>
  );
}
