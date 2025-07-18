import prisma from '@/prisma/client'
import { NextRequest } from 'next/server'
import {
  createSuccessResponseWithData,
  createSuccessResponseWithMessage,
  handlerRequestError,
} from '@/app/api/_utils/handleRequest'

// Helper to handle BigInt serialization
;(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString())
  return int ?? this.toString()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, condition } = body

    if (type === 'condition') {
      const settings = await prisma.settings.findMany()
      const minReservationLock = settings[0].minReservationLock * 60000 // 1min === 60000
      try {
        await prisma.drafts.deleteMany({
          where: {
            ...condition.where,
            createEpoch: {
              lte: body.nowEpoch - minReservationLock,
            },
          },
        })
      } catch (error) {
        return handlerRequestError(error)
      }
      try {
        const draft = await prisma.drafts.findMany({
          where: {
            userId: {
              not: body.userId,
            },
          },
        })
        return createSuccessResponseWithData(draft)
      } catch (error) {
        return handlerRequestError(error)
      }
    } else {
      try {
        await prisma.drafts.deleteMany({
          where: {
            userId: body[0].userId,
          },
        })
        const newDraft = await prisma.drafts.createMany({
          data: Object.values(body),
        })
        return createSuccessResponseWithData(newDraft)
      } catch (error) {
        if (error.meta?.target === 'PRIMARY') {
          return createSuccessResponseWithMessage(
            'یک یا چندتا از نوبت های شما در حال رزرو توسط کاربر دیگری هستند.'
          )
        } else {
          return handlerRequestError(error)
        }
      }
    }
  } catch (error) {
    return handlerRequestError(error)
  }
}
