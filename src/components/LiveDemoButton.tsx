"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { Spinner, buttonClass, iconProps } from "./ui";

/** One probe never waits longer than this; a stuck connection must not stall the loop. */
const ATTEMPT_TIMEOUT_MS = 15_000;
const RETRY_MS = 3_000;
/** After this, keep checking but less often, and say the check could not confirm. */
const SLOW_AFTER_MS = 3 * 60_000;
const SLOW_RETRY_MS = 15_000;

type State = "waking" | "ready" | "unknown";

/**
 * True when the backend answered. A CORS request can read the status (2xx = up,
 * the host's 502/503 while it starts = not yet). If it fails fast without a
 * timeout (an origin the API does not allow, e.g. a preview URL), an opaque
 * no-cors request is the fallback: the host holds requests until the app is up,
 * so any answer means it is up.
 */
async function probeHealth(url: string): Promise<boolean> {
  const init = { cache: "no-store", credentials: "omit" } as const;
  try {
    const res = await fetch(url, { ...init, mode: "cors", signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS) });
    return res.ok;
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") return false;
    try {
      await fetch(url, { ...init, mode: "no-cors", signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS) });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Wakes this project's backend only (never all backends) and shows its state.
 * The demo link is always usable: the check only informs, it never blocks.
 * Besides fetch, an image request pings /health, which wakes the host even
 * when a browser extension blocks cross-site fetches.
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
  const [seconds, setSeconds] = useState(0);
  const started = useRef(0);

  useEffect(() => {
    if (!healthUrl) return;
    let cancelled = false;
    let timer: number | undefined;
    started.current = Date.now();

    const ping = new Image();
    ping.src = `${healthUrl}${healthUrl.includes("?") ? "&" : "?"}wake=${Date.now()}`;

    const tick = window.setInterval(() => setSeconds(Math.round((Date.now() - started.current) / 1000)), 1000);

    const loop = async () => {
      if (cancelled) return;
      if (await probeHealth(healthUrl)) {
        if (!cancelled) setState("ready");
        window.clearInterval(tick);
        return;
      }
      if (cancelled) return;
      const slow = Date.now() - started.current > SLOW_AFTER_MS;
      if (slow) setState("unknown");
      timer = window.setTimeout(loop, slow ? SLOW_RETRY_MS : RETRY_MS);
    };
    void loop();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.clearInterval(tick);
    };
  }, [healthUrl]);

  const elapsed = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div data-testid="live-demo" data-state={state}>
      <a href={demoUrl} target="_blank" rel="noreferrer noopener" className={buttonClass("primary", "md", true)}>
        {t("openLive")}
        <ExternalLink {...iconProps} className="rtl:-scale-x-100" />
      </a>
      <p className="mt-2.5 flex items-start gap-2 text-sm text-text-muted" role="status">
        {state === "waking" && (
          <>
            <Spinner className="mt-0.5 shrink-0 text-accent" />
            <span>
              {t("waking", { minutes: wakeMinutes })} <span className="font-mono tabular-nums">{elapsed}</span>
            </span>
          </>
        )}
        {state === "ready" && (
          <>
            <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-success" />
            <span>{t("ready")}</span>
          </>
        )}
        {state === "unknown" && (
          <>
            <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-warning" />
            <span>{t("unknown")}</span>
          </>
        )}
      </p>
    </div>
  );
}
