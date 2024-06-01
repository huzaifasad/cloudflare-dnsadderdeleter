import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json();
    console.log('we reached therei ')
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch('https://api.cloudflare.com/client/v4/zones', { headers });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ message: errorData.errors[0].message }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data.result);
  } catch (error: any) {
    console.error('Error fetching zones:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
