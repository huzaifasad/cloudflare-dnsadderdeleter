import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const { apiKey, zoneId, recordType, recordName, recordContent, recordTTL, recordProxied, recordPriority } = await req.json();

  if (!apiKey || !zoneId || !recordType || !recordName || !recordContent || !recordTTL) {
    console.error('Missing required fields:', { apiKey, zoneId, recordType, recordName, recordContent, recordTTL });
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  const data = {
    type: recordType,
    name: recordName,
    content: recordContent,
    ttl: parseInt(recordTTL, 10),
    proxied: recordProxied || false,
    priority: recordType === 'MX' ? recordPriority : undefined,
  };

  try {
    console.log('Sending data to Cloudflare:', data);
    const response = await axios.post(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, data, { headers });

    if (response.data && response.data.success) {
      return NextResponse.json(response.data.result, { status: 200 });
    } else {
      console.error('Error response from Cloudflare:', response.data);
      return NextResponse.json({ error: response.data.errors[0].message }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error('Error creating DNS record:', error);

    if (axios.isAxiosError(error) && error.response) {
      console.error('Response data:', error.response.data);
      return NextResponse.json({ error: error.response.data.message }, { status: error.response.status });
    }

    return NextResponse.json({ error: 'Error creating DNS record' }, { status: 500 });
  }
}
