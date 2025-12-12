import { requireAdmin } from '@/lib/adminAuth'
import WinestroSyncClient from './WinestroSyncClient'

export default async function WinestroSyncAdmin() {
  // Server-side admin check - will redirect if not admin
  await requireAdmin()

  return <WinestroSyncClient />
}
