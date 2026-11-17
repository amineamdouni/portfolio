"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, Spinner, buttonClass, iconProps } from "./ui";

const RETRY_MS = 3_000;
const REQUEST_TIMEOUT_MS = 65_000;
/** Keep retrying a minute past the announced wake time before showing the error. */
const deadlineFor = (minutes: number) => Math.max(90_000, (minutes + 1) * 60_000);
/** Re-ping on hover/focus when the last answer is older than this (keeps the host awake). */
const STALE_MS = 5 * 60_000;

type State = "waking" | "ready" | "failed";

/**
 * One wake-up attempt; true when the backend answered.
 * First a CORS request, which can read the status: 2xx means up, anything else
 * (e.g. the host's 502 while it starts) means not yet. CORS is also immune to a
 * `Cross-Origin-Resource-Policy: same-origin` header on /health. If the CORS
 * request fails without timing out (no CORS headers on /health), an opaque
 * no-cors request is the fallback: any answer means the server is up.
 */
async function probeHealth(url: string, timeoutMs = REQUEST_TIMEOUT_MS): Promise<boolean> {
  const init = { cache: "no-store", credentials: "omit" } as const;
  try {
    const res = await fetch(url, { ...init, mode: "cors", signal: AbortSignal.timeout(timeoutMs) });
    return res.ok;
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") return false;
    try {
      await fetch(url, { ...init, mode: "no-cors", signal: AbortSignal.timeout(timeoutMs) });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Wakes this project's backend only (never all backends), by fetching its
 * /health URL on page load and again on hover/focus. Free hosts hold the
 * request while the server starts, so one answer means it is up.
 */
export function LiveDemoButton({
  demoUrl,
  healthUrl,
  wakeMinutes = 1,
}: {
  demoUrl: string;
  healthUrl: string | null;
  /** Announced wake-up time ("up to N min"); a slow (e.g. JVM) backend sets more. */
  wakeMinutes?: number;
}) {
  const t = useTranslations("demo");
  const [state, setState] = useState<State>(healthUrl ? "waking" : "ready");
  const lastOk = useRef(0);
  const running = useRef(false);

  const wake = useCallback(async () => {
    if (!healthUrl || running.current) return;
    if (Date.now() - lastOk.current < STALE_MS) return;
    running.current = true;
    const deadline = Date.now() + deadlineFor(wakeMinutes);
    while (Date.now() < deadline) {
      if (await probeHealth(healthUrl)) {
        lastOk.current = Date.now();
        running.current = false;
        setState("ready");
        return;
      }
      await new Promise((r) => setTimeout(r, RETRY_MS));
    }
    running.current = false;
    setState((s) => (s === "ready" ? s : "failed"));
  }, [healthUrl, wakeMinutes]);

  useEffect(() => {
    // Async on purpose: the wake loop updates state only after the network answers.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void wake();
  }, [wake]);

  return (
    <div data-testid="live-demo" onPointerEnter={() => void wake()} onFocusCapture={() => void wake()}>
      {state === "ready" && (
        <>
          <a href={demoUrl} target="_blank" rel="noreferrer noopener" className={buttonClass("primary", "md", true)}>
            {t("openLive")}
            <ExternalLink {...iconProps} className="rtl:-scale-x-100" />
          </a>
          <p className="mt-2 text-sm text-text-muted">{t("readyCaption")}</p>
        </>
      )}
      {state === "waking" && (
        <>
          <button type="button" disabled aria-busy="true" className={`${buttonClass("primary", "md", true)} cursor-progress`}>
            <Spinner />
            {t("waking", { minutes: wakeMinutes })}
          </button>
          <p className="mt-2 text-sm text-text-muted" role="status">
            {t("wakingCaption")}
          </p>
        </>
      )}
      {state === "failed" && (
        <div className="flex flex-col gap-3">
          <Alert tone="danger" title={t("wakeFailedTitle")}>
            {t("wakeFailedBody")}
          </Alert>
          <button
            type="button"
            className={buttonClass("secondary", "md", true)}
            onClick={() => {
              setState("waking");
              void wake();
            }}
          >
            <RotateCw {...iconProps} />
            {t("tryAgain")}
          </button>
        </div>
      )}
    </div>
  );
}
