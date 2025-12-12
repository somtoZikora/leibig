import { NextRequest, NextResponse } from 'next/server'

/**
 * Newsletter Subscription API Route
 * Connects to Winestro sendDoi endpoint for Double Opt-In newsletter registration
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, vorname, nachname, anrede } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'E-Mail-Adresse ist erforderlich' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      )
    }

    // Get Winestro credentials from environment
    const winestroConfig = {
      baseUrl: process.env.WINESTRO_BASE_URL || 'https://weinstore.net/xml/v22.0/wbo-API.php',
      uid: process.env.WINESTRO_UID,
      apiUser: process.env.WINESTRO_API_USER,
      apiCode: process.env.WINESTRO_API_CODE,
      shopId: process.env.WINESTRO_SHOP_ID || '1',
    }

    // Validate environment variables
    if (!winestroConfig.uid || !winestroConfig.apiUser || !winestroConfig.apiCode) {
      console.error('Missing Winestro API credentials in environment variables')
      return NextResponse.json(
        { error: 'Server-Konfigurationsfehler' },
        { status: 500 }
      )
    }

    // Build Winestro API URL with parameters
    const params = new URLSearchParams({
      UID: winestroConfig.uid,
      apiUSER: winestroConfig.apiUser,
      apiCODE: winestroConfig.apiCode,
      apiShopID: winestroConfig.shopId,
      apiACTION: 'sendDoi',
      email: email,
    })

    // Add optional parameters if provided
    if (anrede) params.append('anrede', anrede)
    if (vorname) params.append('vorname', vorname)
    if (nachname) params.append('nachname', nachname)

    const winestroUrl = `${winestroConfig.baseUrl}?${params.toString()}`

    // Call Winestro sendDoi API
    console.log('Calling Winestro sendDoi API for email:', email)

    const response = await fetch(winestroUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/xml, text/xml',
      },
    })

    const responseText = await response.text()

    console.log('Winestro API Response:', responseText)

    // Check for errors in XML response
    if (responseText.includes('<fehler>')) {
      // Parse error from XML
      const errorMatch = responseText.match(/<text>(.*?)<\/text>/)
      const errorMessage = errorMatch ? errorMatch[1] : 'Fehler beim Newsletter-Anmeldung'

      console.error('Winestro API Error:', errorMessage)

      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    // Success response
    return NextResponse.json({
      success: true,
      message: 'Bitte überprüfen Sie Ihre E-Mail, um die Anmeldung zu bestätigen.',
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    )
  }
}
