import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import axios from 'axios';
import QS from 'qs';

function meliPayamakURL(baseURL: string, type: string, token: string) {
  switch (type) {
    case 'OTP':
    case 'cancellationReservation':
    case 'confirmReservation':
    case 'changeStatusReservation':
    case 'reminderReservation':
    case 'appreciationReservation':
      return (baseURL || '') + 'shared/' + (token || '');
  }
  return '';
}
function kaveNegarURL(baseURL: string, type: string, token: string) {
  switch (type) {
    case 'OTP':
    case 'cancellationReservation':
    case 'confirmReservation':
    case 'changeStatusReservation':
    case 'reminderReservation':
    case 'appreciationReservation':
      return (baseURL || '') + (token || '') + '/verify/lookup.json?';
  }
  return '';
}
function farazSmsURL(baseURL: string, type: string) {
  switch (type) {
    case 'OTP':
    case 'cancellationReservation':
    case 'confirmReservation':
    case 'changeStatusReservation':
    case 'reminderReservation':
    case 'appreciationReservation':
      return (baseURL || '') + '/sms/pattern/normal/send';
  }
  return '';
}
function ipPanelURL(baseURL: string, type: string) {
  switch (type) {
    case 'OTP':
    case 'cancellationReservation':
    case 'confirmReservation':
    case 'changeStatusReservation':
    case 'reminderReservation':
    case 'appreciationReservation':
      return baseURL || '';
  }
  return '';
}
function smsIrURL(baseURL: string, type: string) {
  switch (type) {
    case 'OTP':
    case 'cancellationReservation':
    case 'confirmReservation':
    case 'changeStatusReservation':
    case 'reminderReservation':
    case 'appreciationReservation':
      return (baseURL || '') + '/send/verify';
  }
  return '';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type } = body;
    let connections = await prisma.connections.findMany();
    connections = connections[0];
    let params: any = '';
    let URL = '';
    if (!connections) {
      return NextResponse.json({ error: 'سامانه پیامکی در سیستم ثبت نشده است.' }, { status: 500 });
    }
    switch (connections.smsName) {
      case 'KAVENEGAR': {
        switch (type) {
          case 'OTP':
            params = {
              template: connections.smsCodePattern1 || '',
              receptor: body.mobile || '',
              token: (body.code || '').toString(),
            };
            break;
          case 'cancellationReservation':
            if ((connections.smsCodePattern2 || '').length === 0) {
              return NextResponse.json({ error: 'پیامک برای لغو سرویس غیرفعال است.' }, { status: 201 });
            }
            params = {
              template: connections.smsCodePattern2 || '',
              receptor: body.mobile || '',
              token: body.trackingCode || '',
              token2: body.date || '',
              token3: body.time || '',
            };
            break;
          case 'confirmReservation':
            params = {
              template: connections.smsCodePattern3 || '',
              receptor: body.mobile || '',
              token: body.trackingCode || '',
              token2: body.date || '',
              token3: body.time || '',
            };
            break;
          case 'changeStatusReservation':
            params = {
              template: Number(connections.smsCodePattern4 || 0),
              receptor: body.mobile || '',
              token: body.trackingCode || '',
              token2: (body.date || '') + ' ' + (body.time || ''),
              token3: body.status || '',
            };
            break;
          case 'reminderReservation':
            params = {
              template: Number(connections.smsCodePattern5 || 0),
              receptor: body.mobile || '',
              token: body.trackingCode || '',
              token2: (body.dateName || '') + ' ' + (body.date || '') + ' ' + (body.time || ''),
              token3: (body.service || '') + ' ' + (body.provider || ''),
            };
            break;
          case 'appreciationReservation':
            params = {
              template: Number(connections.smsCodePattern6 || 0),
              receptor: body.mobile || '',
              token: body.fullName || '',
              token2: body.discountCode || '',
            };
            break;
        }
        URL = kaveNegarURL(connections.smsURL || '', type, connections.smsToken || '');
        try {
          const response = await axios.post(URL + QS.stringify(params), {}, {
            headers: { 'Content-Type': 'application/json' },
          });
          return NextResponse.json(response.data, { status: 200 });
        } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      }
      case 'MELIPAYAMAK': {
        switch (type) {
          case 'OTP':
            params = JSON.stringify({
              bodyId: Number(connections.smsCodePattern1 || 0),
              to: body.mobile || '',
              args: [(body.code || '').toString()],
            });
            break;
          case 'cancellationReservation':
            if ((connections.smsCodePattern2 || '').length === 0) {
              return NextResponse.json({ error: 'پیامک برای لغو سرویس غیرفعال است.' }, { status: 201 });
            }
            params = JSON.stringify({
              bodyId: Number(connections.smsCodePattern2 || 0),
              to: body.mobile || '',
              args: [body.trackingCode || '', body.dateName || '', body.date || '', body.time || ''],
            });
            break;
          case 'confirmReservation':
            params = JSON.stringify({
              bodyId: Number(connections.smsCodePattern3 || 0),
              to: body.mobile || '',
              args: [body.trackingCode || '', body.dateName || '', body.date || '', body.time || '', body.service || '', body.provider || ''],
            });
            break;
          case 'changeStatusReservation':
            params = JSON.stringify({
              bodyId: Number(connections.smsCodePattern4 || 0),
              to: body.mobile || '',
              args: [body.trackingCode || '', body.dateName || '', body.date || '', body.time || '', body.service || '', body.provider || '', body.status || ''],
            });
            break;
          case 'reminderReservation':
            params = JSON.stringify({
              bodyId: Number(connections.smsCodePattern5 || 0),
              to: body.mobile || '',
              args: [body.trackingCode || '', body.dateName || '', body.date || '', body.time || '', body.service || '', body.provider || ''],
            });
            break;
          case 'appreciationReservation':
            params = JSON.stringify({
              bodyId: Number(connections.smsCodePattern6 || 0),
              to: body.mobile || '',
              args: [body.fullName || '', body.discountCode || ''],
            });
            break;
        }
        URL = meliPayamakURL(connections.smsURL || '', type, connections.smsToken || '');
        try {
          const response = await axios.post(URL, params, {
            headers: { 'Content-Type': 'application/json' },
          });
          return NextResponse.json(response.data, { status: 200 });
        } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      }
      case 'IPPANEL': {
        switch (type) {
          case 'OTP':
            params = {
              op: 'pattern',
              user: connections.smsUserName || '',
              pass: connections.smsPassword || '',
              fromNum: connections.smsFrom || '',
              toNum: body.mobile || '',
              patternCode: connections.smsCodePattern1 || '',
              inputData: [{ code: body.code || '' }],
            };
            break;
          case 'cancellationReservation':
            if ((connections.smsCodePattern2 || '').length === 0) {
              return NextResponse.json({ error: 'پیامک برای لغو سرویس غیرفعال است.' }, { status: 201 });
            }
            params = {
              op: 'pattern',
              user: connections.smsUserName || '',
              pass: connections.smsPassword || '',
              fromNum: connections.smsFrom || '',
              toNum: body.mobile || '',
              patternCode: connections.smsCodePattern2 || '',
              inputData: [{
                trackingCode: body.trackingCode || '',
                dateName: body.dateName || '',
                date: body.date || '',
                time: body.time || '',
              }],
            };
            break;
          case 'confirmReservation':
            params = {
              op: 'pattern',
              user: connections.smsUserName || '',
              pass: connections.smsPassword || '',
              fromNum: connections.smsFrom || '',
              toNum: body.mobile || '',
              patternCode: connections.smsCodePattern3 || '',
              inputData: [{
                trackingCode: body.trackingCode || '',
                dateName: body.dateName || '',
                date: body.date || '',
                time: body.time || '',
                service: body.service || '',
                provider: body.provider || '',
              }],
            };
            break;
          case 'changeStatusReservation':
            params = {
              op: 'pattern',
              user: connections.smsUserName || '',
              pass: connections.smsPassword || '',
              fromNum: connections.smsFrom || '',
              toNum: body.mobile || '',
              patternCode: connections.smsCodePattern4 || '',
              inputData: [{
                trackingCode: body.trackingCode || '',
                dateName: body.dateName || '',
                date: body.date || '',
                time: body.time || '',
                service: body.service || '',
                provider: body.provider || '',
                status: body.status || '',
              }],
            };
            break;
          case 'reminderReservation':
            params = {
              op: 'pattern',
              user: connections.smsUserName || '',
              pass: connections.smsPassword || '',
              fromNum: connections.smsFrom || '',
              toNum: body.mobile || '',
              patternCode: connections.smsCodePattern5 || '',
              inputData: [{
                trackingCode: body.trackingCode || '',
                dateName: body.dateName || '',
                date: body.date || '',
                time: body.time || '',
                service: body.service || '',
                provider: body.provider || '',
              }],
            };
            break;
          case 'appreciationReservation':
            params = {
              op: 'pattern',
              user: connections.smsUserName || '',
              pass: connections.smsPassword || '',
              fromNum: connections.smsFrom || '',
              toNum: body.mobile || '',
              patternCode: connections.smsCodePattern6 || '',
              inputData: [{
                fullName: body.fullName || '',
                discountCode: body.discountCode || '',
              }],
            };
            break;
        }
        URL = ipPanelURL(connections.smsURL || '', type);
        try {
          const response = await axios.post(URL, params, {
            headers: { 'Content-Type': 'application/json' },
          });
          return NextResponse.json(response.data, { status: 200 });
        } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      }
      case 'FARAZSMS': {
        const patternMap = {
          OTP: 1,
          cancellationReservation: 2,
          confirmReservation: 3,
          changeStatusReservation: 4,
          reminderReservation: 5,
          appreciationReservation: 6,
        } as const;
        const patternKey = type as keyof typeof patternMap;
        switch (type) {
          case 'OTP':
          case 'cancellationReservation':
          case 'confirmReservation':
          case 'changeStatusReservation':
          case 'reminderReservation':
          case 'appreciationReservation':
            params = {
              op: 'pattern',
              user: connections.smsUserName || '',
              pass: connections.smsPassword || '',
              from: connections.smsFrom || '',
              to: body.mobile || '',
              patternCode: connections[`smsCodePattern${String(patternMap[patternKey])}`] || '',
              inputData: body,
            };
            break;
        }
        URL = farazSmsURL(connections.smsURL || '', type);
        try {
          const response = await axios.post(URL, params, {
            headers: { 'Content-Type': 'application/json' },
          });
          return NextResponse.json(response.data, { status: 200 });
        } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      }
      case 'SMSIR': {
        const patternMap = {
          OTP: 1,
          cancellationReservation: 2,
          confirmReservation: 3,
          changeStatusReservation: 4,
          reminderReservation: 5,
          appreciationReservation: 6,
        } as const;
        const patternKey = type as keyof typeof patternMap;
        switch (type) {
          case 'OTP':
          case 'cancellationReservation':
          case 'confirmReservation':
          case 'changeStatusReservation':
          case 'reminderReservation':
          case 'appreciationReservation':
            params = {
              TemplateId: Number(connections[`smsCodePattern${String(patternMap[patternKey])}`] || 0),
              Mobile: body.mobile || '',
              Parameters: Object.entries(body).map(([key, value]) => ({ name: key, value })),
            };
            break;
        }
        URL = smsIrURL(connections.smsURL || '', type);
        try {
          const response = await axios.post(URL, params, {
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': connections.smsToken || '',
            },
          });
          return NextResponse.json(response.data, { status: 200 });
        } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      }
      default:
        return NextResponse.json({ error: 'سامانه پیامکی در سیستم ثبت نشده است.' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
} 