// app/api/deletednsrecords/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const apiKey = searchParams.get('apiKey');
  const zoneId = searchParams.get('zoneId');
  const recordId = searchParams.get('recordId');

  if (!apiKey || !zoneId || !recordId) {
    return NextResponse.json({ error: 'Missing apiKey, zoneId, or recordId' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.errors[0].message }, { status: response.status });
    }

    return NextResponse.json({ message: 'DNS record deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting DNS record' }, { status: 500 });
  }
}
