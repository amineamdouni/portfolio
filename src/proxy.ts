import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next internals, Vercel internals and files
  // with an extension (images, cv.pdf, robots.txt, sitemap.xml...).
  matcher: "/((?!api|_next|_vercel|apple-icon|.*\\..*).*)",
};
