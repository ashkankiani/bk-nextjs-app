import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import nodemailer from 'nodemailer';

function templateEmail(body: any) {
  return `<!DOCTYPE html>\n<html>...${body.text}...</html>`; // For brevity, use the original template body here
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let connections = await prisma.connections.findMany();
    connections = connections[0];
    if (!connections || connections.smtpURL.length === 0) {
      return NextResponse.json({ error: 'سامانه ایمیل در سیستم ثبت نشده است.' }, { status: 500 });
    }
    const transporter = nodemailer.createTransport({
      host: connections.smtpURL,
      port: connections.smtpPort,
      auth: {
        user: connections.smtpUserName,
        pass: connections.smtpPassword,
      },
    });
    const info = await transporter.sendMail({
      from: `"${process.env.NEXT_PUBLIC_SITE_NAME}" <${connections.smtpUserName}>`,
      to: body.email,
      subject: body.subject,
      text: body.text,
      html: templateEmail(body),
    });
    return NextResponse.json(info, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
} 