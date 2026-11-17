import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import { Callout, SectionHeading } from "@/components/ui";

/** Numbered section of a project write-up. */
export function Section({ number, title, children }: { number?: string; title: string; children: ReactNode }) {
  return (
    <section className="mt-16 md:mt-24">
      <SectionHeading number={number}>{title}</SectionHeading>
      <div className="prose-doc mt-6 max-w-none [&>p]:max-w-(--measure)">{children}</div>
    </section>
  );
}

/** Placeholder text in a write-up. Wave 4 replaces every one. */
export function Todo({ children }: { children: ReactNode }) {
  return (
    <Callout label="TODO" className="mt-6">
      {children}
    </Callout>
  );
}

const components: MDXComponents = {
  Section,
  Todo,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
