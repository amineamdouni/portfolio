import { getTranslations } from "next-intl/server";

/** Skills from the CV, unranked. Tech names keep their own casing in both languages. */
export const skillGroups = [
  { key: "languages", items: ["TypeScript", "JavaScript", "Java", "Python", "SQL"] },
  { key: "frontend", items: ["React", "Next.js (App Router)", "React Native (Expo)", "Tailwind CSS", "SCSS"] },
  { key: "backend", items: ["NestJS", "Node.js", "Express.js", "Spring Boot", "REST APIs", "WebSockets"] },
  { key: "databases", items: ["PostgreSQL", "Prisma", "Redis", "MySQL", "MongoDB"] },
  { key: "aiPayments", items: ["Anthropic and OpenAI APIs", "Stripe", "MyFatoorah"] },
  { key: "tools", items: ["Git", "GitHub Actions", "AWS", "Turborepo", "Jest", "Vitest", "Playwright", "Agile / Scrum"] },
] as const;

export async function SkillsList() {
  const t = await getTranslations("skills");
  return (
    <dl className="overflow-hidden rounded-md border bg-surface">
      {skillGroups.map((g, i) => (
        <div
          key={g.key}
          className={`grid grid-cols-[110px_minmax(0,1fr)] gap-4 px-[18px] py-4 sm:grid-cols-[140px_minmax(0,1fr)] ${i > 0 ? "border-t" : ""}`}
        >
          <dt className="eyebrow pt-0.5">{t(g.key)}</dt>
          <dd className="text-[15px] text-pretty">{g.items.join(" · ")}</dd>
        </div>
      ))}
    </dl>
  );
}
