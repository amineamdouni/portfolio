import { notFound } from "next/navigation";

// Any unknown path under a locale renders app/[locale]/not-found.tsx inside the site layout
// (which sets its own <title> and noindex).
export default function CatchAll() {
  notFound();
}
