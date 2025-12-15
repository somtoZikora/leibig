import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/shop(.*)",
  "/product(.*)",
  "/cart(.*)",
  "/wishlist(.*)",
  "/ueber-uns(.*)",
  "/api/products(.*)",
  "/api/sanity(.*)",
  "/api/orders(.*)",
  "/api/winestro-webhook(.*)",
  "/api/test-sanity(.*)",
  "/api/newsletter(.*)"
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/studio(.*)",
  "/api/winestro-sync(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
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