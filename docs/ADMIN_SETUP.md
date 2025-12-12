# Admin Setup Guide

This guide explains how to set up admin access for the Kirsten-Liebieg wine shop using Clerk user metadata.

## Overview

The application uses **Clerk publicMetadata** with a `role` field to distinguish between regular shop users and admin users:

- **Regular Users (Customers):** Can browse products, add to cart, checkout, and view their orders
- **Admin Users:** Users with `role: "admin"` in their publicMetadata who have access to:
  - Admin sync page (`/admin/winestro-sync`)
  - Sanity Studio (`/studio`)
  - Winestro sync API (`/api/winestro-sync`)

## How It Works

### User Types

1. **Shop Customers**
   - Regular Clerk users with no role or `role: "customer"`
   - Can sign up and use the shop normally
   - Authenticated via Clerk
   - Access to: shop, cart, checkout, order history

2. **Admin Users**
   - Clerk users with `role: "admin"` in publicMetadata
   - Have elevated permissions
   - Access to: all customer features + admin routes + Sanity Studio

### Protected Routes

The following routes require admin role:

- `/admin/*` - Admin dashboard and sync pages
- `/studio/*` - Sanity Studio CMS
- `/api/winestro-sync` - Product synchronization API

## Setting Up Admin Access

### Step 1: Assign Admin Role via Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Navigate to **Users** in the sidebar
4. Find and click on the user you want to make an admin
5. Click on the **Metadata** tab
6. Under **Public metadata**, add the following JSON:
   ```json
   {
     "role": "admin"
   }
   ```
7. Click **Save**

### Step 2: User Signs Out and Back In

The user needs to sign out and sign back in for the metadata changes to take effect in their session.

### Step 3: Verify Admin Access

1. Sign in as the admin user
2. Try accessing `/admin/winestro-sync`
3. You should see the admin sync dashboard
4. Try accessing `/studio`
5. You should see the Sanity Studio interface

## Managing Admin Users

### Adding New Admins

Repeat Step 1 for each new admin user you want to add.

### Removing Admin Access

1. Go to Clerk Dashboard → Users → Select the user
2. Click the **Metadata** tab
3. Under **Public metadata**, either:
   - Remove the `role` field entirely, or
   - Change it to `"customer"`
   ```json
   {
     "role": "customer"
   }
   ```
4. Click **Save**
5. The user must sign out and back in for the change to take effect

### Checking Admin Status

Admin users can be identified by:
- `publicMetadata.role === "admin"` in their Clerk user object
- Successful access to `/admin/*` and `/studio` routes

## Technical Implementation

### Middleware Protection

The `middleware.ts` file protects admin routes by checking user metadata:

```typescript
if (isAdminRoute(req)) {
  const { userId } = await auth();
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (user.publicMetadata?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }
}
```

### API Protection

Admin API endpoints verify the admin role in metadata:

```typescript
const { userId } = await auth()
const client = await clerkClient()
const user = await client.users.getUser(userId)

if (user.publicMetadata?.role !== 'admin') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

### Page Protection

Admin pages use the `requireAdmin()` utility:

```typescript
import { requireAdmin } from '@/lib/adminAuth'

export default async function AdminPage() {
  await requireAdmin() // Redirects if not admin
  return <AdminContent />
}
```

## Troubleshooting

### "Forbidden - Admin access required"

**Cause:** The user does not have `role: "admin"` in their publicMetadata.

**Solution:**
1. Verify the user has the admin role in Clerk Dashboard → Users → [User] → Metadata
2. Ensure the JSON is correct: `{"role": "admin"}`
3. Have the user sign out and sign back in to refresh their session

### Can't access /studio

**Cause:** Sanity Studio route is protected by admin role check.

**Solution:**
1. Ensure you're signed into Clerk
2. Verify you have `role: "admin"` in your publicMetadata
3. Sign out and back in to refresh your session
4. Check that Sanity is properly configured (see `sanity.config.ts`)

### Regular users can't checkout

**Cause:** Admin role might be incorrectly required for non-admin routes.

**Solution:**
1. Verify the route is in `isPublicRoute` matcher in `middleware.ts`
2. Check that `/checkout` is NOT in `isAdminRoute`
3. Regular users should only need Clerk authentication, not admin role

## Security Notes

- Only users with `role: "admin"` in publicMetadata can:
  - Trigger product syncs from Winestro
  - Access Sanity Studio
  - View admin dashboard
- Regular shop customers cannot access these features
- Admin role is verified on both the middleware level and within API routes
- Sessions are managed by Clerk and automatically refresh

## Further Configuration

### Multiple Admin Roles

If you want different admin levels (e.g., super admin, content editor):

Update the TypeScript type in `types/clerk.ts`:
```typescript
export type UserRole = 'customer' | 'admin' | 'super_admin' | 'editor'
```

Then update your protection logic to check for specific roles:
```typescript
if (user.publicMetadata?.role !== 'super_admin') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

### Granular Permissions

You can add a `permissions` array to publicMetadata:
```json
{
  "role": "admin",
  "permissions": ["sync_products", "edit_content", "manage_users"]
}
```

Then check specific permissions in your code.

## Support

For issues with:
- **Clerk Authentication:** Check [Clerk Documentation](https://clerk.com/docs)
- **Sanity CMS:** Check [Sanity Documentation](https://www.sanity.io/docs)
- **Application-specific issues:** Check the customer handbook or contact the development team
