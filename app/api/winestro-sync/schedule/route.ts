import { NextRequest, NextResponse } from 'next/server'
import { WinestroSyncService } from '@/lib/winestro-sync'

// This endpoint can be called by a cron job or scheduler
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from an authorized source
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.SYNC_SCHEDULE_TOKEN || 'your-secret-token'
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const syncService = new WinestroSyncService()
    
    console.log('🕐 Scheduled sync started...')
    const result = await syncService.syncProducts({ 
      limit: 100, 
      batchSize: 20 
    })
    
    console.log('🕐 Scheduled sync completed:', result)
    
    return NextResponse.json({
      success: true,
      message: 'Scheduled sync completed',
      result
    })
  } catch (error: any) {
    console.error('❌ Scheduled sync failed:', error)
    return NextResponse.json(
      { error: 'Scheduled sync failed', message: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Winestro Scheduled Sync Endpoint',
    usage: 'POST with Authorization: Bearer <token>'
  })
}