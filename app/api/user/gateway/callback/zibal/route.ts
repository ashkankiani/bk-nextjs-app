import { NextRequest, NextResponse } from 'next/server';
import Qs from 'qs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    query[key] = value;
  });
  console.log(query);
  return NextResponse.redirect('/payment/?' + Qs.stringify(query));
} 