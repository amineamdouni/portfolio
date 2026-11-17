"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, Spinner, TodoMark, buttonClass, iconProps } from "./ui";

const DEADLINE_MS = 90_000;
const RETRY_MS = 3_000;
const REQUEST_TIMEOUT_MS = 65_000;
/** Re-ping on hover/focus when the last answer is older than this (keeps the host awake). */
const STALE_MS = 5 * 60_000;

type State = "waking" | "ready" | "failed";

/**
 * Wakes this project's backend only (never all backends), by fetching its
 * /health URL on page load and again on hover/focus. Free hosts hold the
 * request while the server starts, so one answered request means it is up.
 * `no-cors`: an opaque answer is enough, no CORS setup needed on /health.
 */
export function LiveDemoButton({ demoUrl, healthUrl }: { demoUrl: string | null; healthUrl: string | null }) {
  const t = useTranslations("demo");
  const [state, setState] = useState<State>(healthUrl ? "waking" : "ready");
  const lastOk = useRef(0);
  const running = useRef(false);

  const wake = useCallback(async () => {
    if (!healthUrl || running.current) return;
    if (Date.now() - lastOk.current < STALE_MS) return;
    running.current = true;
    const deadline = Date.now() + DEADLINE_MS;
    while (Date.now() < deadline) {
      try {
        await fetch(healthUrl, {
          mode: "no-cors",
          cache: "no-store",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        lastOk.current = Date.now();
        running.current = false;
        setState("ready");
        return;
      } catch {
        await new Promise((r) => setTimeout(r, RETRY_MS));
      }
    }
    running.current = false;
    setState((s) => (s === "ready" ? s : "failed"));
  }, [healthUrl]);

  useEffect(() => {
    // Async on purpose: the wake loop updates state only after the network answers.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void wake();
  }, [wake]);

  if (!demoUrl) {
    return (
      <div data-testid="live-demo">
        <button type="button" disabled className={buttonClass("secondary", "md", true)}>
          {t("notOnline")}
        </button>
        <p className="mt-2 text-sm text-text-muted">
          <TodoMark>{t("notOnlineCaption")}</TodoMark>
        </p>
      </div>
    );
  }

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
            {t("waking")}
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
