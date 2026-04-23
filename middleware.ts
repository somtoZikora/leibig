import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

const isPublicRoute = createRouteMatcher([
  "/",
  "/index.php(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/shop(.*)",
  "/product(.*)",
  "/cart(.*)",
  "/checkout(.*)",
  "/track-order(.*)",
  "/orders/(.*)",
  "/wishlist(.*)",
  "/ueber-uns(.*)",
  "/api/products(.*)",
  "/api/sanity(.*)",
  "/api/orders(.*)",
  "/api/vouchers(.*)",
  "/api/winestro-webhook(.*)",
  "/api/test-sanity(.*)",
  "/api/newsletter(.*)"
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/studio(.*)",
  "/api/winestro-sync(.*)"
]);

async function redirectLegacyWineUrl(req: Request): Promise<NextResponse | null> {
  const url = new URL(req.url);
  const isLegacyWineRoute = url.pathname === "/index.php" && url.searchParams.get("site") === "wein";

  if (!isLegacyWineRoute) {
    return null;
  }

  const wineId = url.searchParams.get("weinnr");
  if (!wineId) {
    return NextResponse.redirect(new URL("/shop?notfound=1", req.url), 307);
  }

  try {
    const product = await client.fetch<{ slug?: string } | null>(
      `*[_type == "product" && !isArchived && (winestroId == $wineId || artikelnummer == $wineId)][0]{
        "slug": slug.current
      }`,
      { wineId }
    );

    if (!product?.slug) {
      const fallbackUrl = new URL("/shop", req.url);
      fallbackUrl.searchParams.set("notfound", "1");
      fallbackUrl.searchParams.set("weinnr", wineId);
      return NextResponse.redirect(fallbackUrl, 307);
    }

    return NextResponse.redirect(new URL(`/product/${product.slug}`, req.url), 308);
  } catch (error) {
    console.error("Error resolving legacy wine URL:", error);
    return null;
  }
}

export default clerkMiddleware(async (auth, req) => {
  const legacyRedirect = await redirectLegacyWineUrl(req);
  if (legacyRedirect) {
    return legacyRedirect;
  }

  // Protect admin routes - requires authentication AND admin role
  if (isAdminRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Check if user has admin role in publicMetadata
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);

      if (user.publicMetadata?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Protect all non-public routes - requires authentication only
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
  runtime: 'nodejs',
};