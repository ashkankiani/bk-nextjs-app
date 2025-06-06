import { NextRequest, NextResponse } from 'next/server';
import Qs from 'qs';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(body);
  return NextResponse.redirect('/payment/?' + Qs.stringify(body));
} 