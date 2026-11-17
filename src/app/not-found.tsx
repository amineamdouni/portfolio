import Link from "next/link";

// Paths the locale proxy does not handle (e.g. a missing file). Locale pages
// use app/[locale]/not-found.tsx instead.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center p-8">
        <main>
          <p className="eyebrow mb-5">Error 404</p>
          <h1 className="text-h1">This page doesn&apos;t exist</h1>
          <p className="mt-5">
            <Link href="/en">Go to the home page</Link> · <Link href="/fr">Aller à l&apos;accueil</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
