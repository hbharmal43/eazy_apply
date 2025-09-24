import { NextRequest, NextResponse } from 'next/server';

const SNOV_API_BASE = 'https://api.snov.io';

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const endpoint = url.searchParams.get('endpoint');
    
    if (!endpoint) {
      return NextResponse.json({ error: 'Missing endpoint parameter' }, { status: 400 });
    }

    // Get the request body - handle both FormData and URLSearchParams
    const contentType = request.headers.get('content-type') || '';
    let body;
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      // For auth requests
      body = await request.text();
    } else if (contentType.includes('multipart/form-data')) {
      // For requests with form data
      body = await request.formData();
    } else if (contentType.includes('application/json')) {
      // For JSON requests (email search)
      body = await request.text();
    } else {
      // For requests without body
      body = null;
    }
    
    // Get authorization header (optional for auth requests)
    const authorization = request.headers.get('authorization');
    
    console.log('🔍 Proxying Snov request:', { endpoint, authorization: authorization ? '***' : 'none' });

    // Handle authentication requests server-side
    if (endpoint === '/v1/oauth/access_token') {
      const snovClientId = process.env.SNOV_CLIENT_ID;
      const snovClientSecret = process.env.SNOV_CLIENT_SECRET;
      
      if (!snovClientId || !snovClientSecret) {
        console.error('❌ Snov credentials not configured on server');
        return NextResponse.json(
          { error: 'Snov.io API credentials not configured on server' },
          { status: 500 }
        );
      }
      
      // Use server-side credentials for auth
      body = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: snovClientId,
        client_secret: snovClientSecret,
      }).toString();
    }

    // Make the request to Snov.io
    const headers: HeadersInit = {};
    
    if (authorization) {
      headers['Authorization'] = authorization;
    }
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else if (contentType.includes('application/json')) {
      headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(`${SNOV_API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: body,
    });

    console.log('🔍 Snov response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Snov error:', { status: response.status, errorText });
      return NextResponse.json(
        { error: `Snov API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Snov success:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const endpoint = url.searchParams.get('endpoint');
    
    if (!endpoint) {
      return NextResponse.json({ error: 'Missing endpoint parameter' }, { status: 400 });
    }

    // Get authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    // Extract all query parameters except 'endpoint' and pass them to Snov
    const queryParams = new URLSearchParams();
    url.searchParams.forEach((value, key) => {
      if (key !== 'endpoint') {
        queryParams.append(key, value);
      }
    });

    // Build the full URL with query parameters
    const snovUrl = queryParams.toString() 
      ? `${SNOV_API_BASE}${endpoint}?${queryParams.toString()}`
      : `${SNOV_API_BASE}${endpoint}`;

    console.log('🔍 Proxying Snov GET request:', { endpoint, queryParams: queryParams.toString() });

    // Make the request to Snov.io
    const response = await fetch(snovUrl, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
      },
    });

    console.log('🔍 Snov GET response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Snov GET error:', { status: response.status, errorText });
      return NextResponse.json(
        { error: `Snov API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Snov GET success:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Proxy GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
