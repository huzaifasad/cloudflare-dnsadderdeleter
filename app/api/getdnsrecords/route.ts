import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const apiKey = searchParams.get('apiKey');
  const zoneId = searchParams.get('zoneId');
 console.log('api hiting')
  if (!apiKey || !zoneId) {
    return NextResponse.json({ error: 'Missing apiKey or zoneId' }, { status: 400 });
  }

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, { headers });
    
    if (response.data ) {
        console.log(response.data)
      return NextResponse.json(response.data.result, { status: 200 });
    } else {
      return NextResponse.json({ error: 'No DNS records found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching DNS records:', error);
    return NextResponse.json({ error: 'Error fetching DNS records' }, { status: 500 });
  }
}
