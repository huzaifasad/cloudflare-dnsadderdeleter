// app/api/getdnsrecords/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const apiKey = searchParams.get('apiKey');
  const zoneId = searchParams.get('zoneId');

  if (!apiKey || !zoneId) {
    return NextResponse.json({ error: 'Missing apiKey or zoneId' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?per_page=5000 `, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    // const responseJson = await response.json();
    

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.errors[0].message }, { status: response.status });
    }

    const data = await response.json();
    console.log(data)
    return NextResponse.json(data.result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching DNS records' }, { status: 500 });
  }
}
