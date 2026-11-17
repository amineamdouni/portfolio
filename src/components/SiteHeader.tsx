"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitch, ThemeToggle } from "./HeaderControls";
import { cx } from "./ui";

const items = [
  { href: "/projects", key: "projects" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close the menu after navigating.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="sticky top-0 z-10 bg-bg">
      <a
        href="#main"
        className="absolute -top-24 left-4 z-20 inline-flex h-10 items-center rounded-sm border border-border-strong bg-surface px-3 text-accent focus:top-2"
      >
        {t("skipToContent")}
      </a>
      <header className="border-b bg-bg">
        <div className="container-page flex h-14 items-center gap-6 md:h-16">
          <Link
            href="/"
            className="inline-flex min-h-11 shrink-0 items-center text-[17px] font-semibold tracking-[-0.01em] whitespace-nowrap text-text-primary no-underline hover:text-text-primary hover:no-underline"
          >
            {t("brand")}
          </Link>

          <nav aria-label={t("primary")} className="ms-auto hidden items-center gap-1 md:flex">
            {items.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={cx(
                    "inline-flex h-10 items-center rounded-sm px-3.5 text-[15px] no-underline transition-colors duration-[120ms] ease-out-std hover:bg-surface-sunken hover:no-underline",
                    current
                      ? "bg-surface-sunken font-semibold text-text-primary hover:text-text-primary"
                      : "font-medium text-text-secondary hover:text-text-primary",
                  )}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="ms-auto flex items-center gap-2 md:ms-3">
            <LocaleSwitch />
            <ThemeToggle />
            <button
              ref={buttonRef}
              type="button"
              className={cx(
                "inline-flex size-11 items-center justify-center rounded-sm border text-text-primary md:hidden",
                open ? "border-border-strong bg-surface-sunken" : "border-border bg-surface",
              )}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t("closeMenu") : t("openMenu")}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={24} strokeWidth={1.5} aria-hidden /> : <Menu size={24} strokeWidth={1.5} aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <nav
          id="mobile-menu"
          aria-label={t("primary")}
          className="flex flex-col border-b bg-surface p-2 shadow-menu md:hidden"
        >
          {items.map((item) => {
            const current = isCurrent(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cx(
                  "flex min-h-[52px] items-center rounded-sm px-3 text-[17px] text-text-primary no-underline hover:bg-surface-sunken hover:text-text-primary hover:no-underline",
                  current ? "bg-surface-sunken font-semibold" : "font-medium",
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
