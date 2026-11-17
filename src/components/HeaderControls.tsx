"use client";

import { Suspense, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cx } from "./ui";

const iconButton =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-sm border bg-surface text-text-primary no-underline transition-colors duration-[120ms] ease-out-std hover:bg-surface-sunken hover:text-text-primary active:translate-y-px";

const subscribe = () => () => {};

/** True after hydration; avoids a theme icon mismatch between server and client. */
function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";
  const label = !mounted ? t("loading") : isDark ? t("toLight") : t("toDark");

  return (
    <button
      type="button"
      className={iconButton}
      aria-label={label}
      title={label}
      data-testid="theme-toggle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Fixed-size slot: the icon swaps after mount, the box never moves. */}
      {mounted ? (
        isDark ? (
          <Sun size={20} strokeWidth={1.5} aria-hidden />
        ) : (
          <Moon size={20} strokeWidth={1.5} aria-hidden />
        )
      ) : (
        <span className="size-5" aria-hidden />
      )}
    </button>
  );
}

/**
 * EN/FR toggle. The accessible name starts with the visible code ("FR, Français")
 * so it matches what sighted voice-control users see (WCAG 2.5.3). The projects
 * filter (?type=) is carried over; reading the query needs a Suspense boundary
 * on static pages, so the server renders the link without it.
 */
export function LocaleSwitch() {
  return (
    <Suspense fallback={<LocaleSwitchLink search="" />}>
      <LocaleSwitchWithQuery />
    </Suspense>
  );
}

function LocaleSwitchWithQuery() {
  const params = useSearchParams();
  const type = params.get("type");
  return <LocaleSwitchLink search={type ?? ""} />;
}

function LocaleSwitchLink({ search }: { search: string }) {
  const t = useTranslations("locale");
  const locale = useLocale();
  const pathname = usePathname();
  const other = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;
  const href = search ? { pathname, query: { type: search } } : pathname;

  return (
    <Link
      href={href}
      locale={other}
      hrefLang={other}
      lang={other}
      title={t("switchLabel")}
      data-testid="locale-switch"
      className={cx(iconButton, "font-mono text-[13px] font-medium tracking-[0.04em]")}
    >
      {t("switchShort")}
      <span className="sr-only">, {t("switchLabel")}</span>
    </Link>
  );
}
