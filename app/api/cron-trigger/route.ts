import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const cronKey = process.env.CRON_AUTH_KEY;
    if (!cronKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 调用原来的 POST 接口
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/cron`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cronKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Cron trigger error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
