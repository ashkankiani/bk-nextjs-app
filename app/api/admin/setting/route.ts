import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/client'

export async function GET(req: NextRequest) {
  try {
    const settings = await prisma.settings.findMany()
    return NextResponse.json(settings, { status: 200 })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

async function updateSettings(req: NextRequest) {
  try {
    const body = await req.json()
    const updateSettings = await prisma.settings.update({
      data: body,
      where: { id: 1 },
    })
    return NextResponse.json(updateSettings, { status: 200 })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}

export const PUT = updateSettings
export const PATCH = updateSettings
