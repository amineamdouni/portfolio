"use client";

import { useRef, useState, type FormEvent } from "react";
import { Mail, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, buttonClass, cx, iconProps } from "./ui";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const control =
  "w-full rounded-sm border bg-surface px-3 text-base text-text-primary aria-invalid:border-danger";

/**
 * No backend and no third-party service: the form validates, then opens the
 * visitor's email app with the message filled in (mailto:).
 */
export function ContactForm({ email }: { email: string }) {
  const t = useTranslations("contact");
  const [errors, setErrors] = useState<Errors>({});
  const [sentName, setSentName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();
    const topic = String(data.get("topic") ?? "");
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = t("nameError");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) next.email = t("emailError");
    if (!message) next.message = t("messageError");
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const subject = topic ? `${t("subject", { name })} · ${t(`topics.${topic}`)}` : t("subject", { name });
    const body = `${message}\n\n${name}\n${from}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSentName(name);
  }

  if (sentName) {
    return (
      <div className="flex max-w-[560px] flex-col items-start gap-4">
        <Alert tone="success" title={t("successTitle")}>
          {t("successBody", { name: sentName, email })}
        </Alert>
        <button type="button" className={buttonClass("secondary")} onClick={() => setSentName(null)}>
          {t("again")}
        </button>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="flex max-w-[560px] flex-col gap-5" data-testid="contact-form">
      {hasErrors && (
        <Alert tone="danger" title={t("errorTitle")}>
          {t("errorBody", { email })}
        </Alert>
      )}
      <Field id="name" label={t("name")} hint={t("required")} error={errors.name}>
        <input id="name" name="name" autoComplete="name" className={cx(control, "h-11")} {...invalid("name", errors.name)} />
      </Field>
      <Field id="email" label={t("email")} hint={t("required")} error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          className={cx(control, "h-11")}
          {...invalid("email", errors.email)}
        />
      </Field>
      <Field id="topic" label={t("topic")} hint={t("optional")}>
        <select id="topic" name="topic" defaultValue="" className={cx(control, "h-11")}>
          <option value="">—</option>
          {(["internship", "project", "job", "other"] as const).map((k) => (
            <option key={k} value={k}>
              {t(`topics.${k}`)}
            </option>
          ))}
        </select>
      </Field>
      <Field id="message" label={t("message")} hint={t("required")} error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={cx(control, "min-h-[110px] resize-y py-2.5 leading-[1.6]")}
          {...invalid("message", errors.message)}
        />
      </Field>
      <div>
        <button type="submit" className={buttonClass("primary")}>
          <Mail {...iconProps} />
          {t("submit")}
        </button>
      </div>
    </form>
  );
}

function invalid(id: string, error?: string) {
  return error ? { "aria-invalid": true, "aria-describedby": `${id}-error` } : {};
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[15px] font-semibold">
        {label} <span className="font-normal text-text-muted">{hint}</span>
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-sm text-danger">
          <TriangleAlert size={15} strokeWidth={1.5} aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
