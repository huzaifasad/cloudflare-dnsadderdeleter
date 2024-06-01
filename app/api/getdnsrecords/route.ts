import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const apiKey = searchParams.get('apiKey');
  const zoneId = searchParams.get('zoneId');

  console.log('reached there');

  if (!apiKey || !zoneId) {
    return NextResponse.json({ error: 'Missing apiKey or zoneId' }, { status: 400 });
  }

  const headers: HeadersInit = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, { headers });
    const responseJson = await response.json();

    if (!response.ok) {
      return NextResponse.json({ detail: 'CloudFlare responded with an error. Please double check your API token.' }, { status: 422 });
    }

    const dnsRecords: Array<{ content: string; id: string; name: string; type: string; }> = responseJson.result.map((r: any) => ({
      content: r.content,
      id: r.id,
      name: r.name,
      type: r.type,
    }));

    return NextResponse.json(dnsRecords, { status: 200 });
  } catch (error) {
    console.error('Error fetching DNS records:', error);
    return NextResponse.json({ error: 'Error fetching DNS records' }, { status: 500 });
  }
}
