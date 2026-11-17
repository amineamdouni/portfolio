"use client";

import { useSyncExternalStore } from "react";
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

export function LocaleSwitch() {
  const t = useTranslations("locale");
  const locale = useLocale();
  const pathname = usePathname();
  const other = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <Link
      href={pathname}
      locale={other}
      hrefLang={other}
      lang={other}
      aria-label={t("switchLabel")}
      title={t("switchLabel")}
      data-testid="locale-switch"
      className={cx(iconButton, "font-mono text-[13px] font-medium tracking-[0.04em]")}
    >
      {t("switchShort")}
    </Link>
  );
}
