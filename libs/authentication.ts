import * as jose from 'jose'
import { hookGetSession } from '@/hooks/user/hookSession'
import { hookGetPermission } from '@/hooks/admin/hookPermissions'
import { apiRoutes } from '@/libs/apiRoutes'
import { TypeSession } from '@/types/typeConfig'

export const jwtConfig = {
  secret: new TextEncoder().encode(process.env.NEXT_JWT_SECRET_KEY),
  issuer: 'urn:nextJsBooking:issuer',
  audience: 'urn:nextJsBooking:audience',
  expireDate: '1d',
  algo: { alg: 'HS256' },
}

export const encodeJwt = async (payload: TypeSession): Promise<string> => {
  const jwt = await new jose.SignJWT(payload)
    .setExpirationTime(jwtConfig.expireDate)
    .setProtectedHeader(jwtConfig.algo)
    .setIssuer(jwtConfig.issuer)
    .setAudience(jwtConfig.audience)
    .sign(jwtConfig.secret)
  return jwt
}

export const decodeJwt = async <T extends Record<string, unknown>>(
  payload: string
): Promise<T | null> => {
  try {
    const { payload: decodedPayload } = await jose.jwtVerify(payload, jwtConfig.secret)
    return decodedPayload as T
  } catch (e) {
    console.error(e)
    return null
  }
}

export const isAuthenticated = async (token: string) => {
  if (!token) return { status: false, message: 'Authorization required' }
  const decodedToken = await decodeJwt<TypeSession>(token)
  if (!decodedToken)
    return {
      status: false,
      message: 'Authorization required (Token Not Verify)',
    }
  const compareToken = await validateSession(decodedToken.userId, token)
  if (!compareToken)
    return {
      status: false,
      message: 'Authorization required (Token Not Valid)',
    }

  const permissions = await getPermissions(decodedToken.catalogId)

  if (!permissions.status)
    return {
      status: false,
      message: 'Authorization required (Permissions Not Received!)',
    }

  return {
    status: true,
    message: 'Authorization success',
    userId: decodedToken.userId,
    catalogId: decodedToken.catalogId,
    permissions: permissions.data,
  }
}

async function validateSession(userId: number, token: string) {
  // eslint-disable-next-line no-undef
  return new Promise(resolve => {
    hookGetSession(userId, (response, message) => {
      if (response && message && message.sessionToken === token) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  }).catch(() => {
    return false
  })
}

async function getPermissions(catalogId: number) {
  return new Promise(resolve => {
    hookGetPermission(catalogId, (response, message) => {
      if (response) {
        delete message.id
        delete message.catalogId
        resolve({ status: true, data: message })
      } else {
        resolve({ status: false })
      }
    })
  }).catch(() => {
    return false
  })
}

export const isAccess = async (method: 'GET' | 'POST', pathname: string, query, permissions) => {
  if (pathname.startsWith('/api/')) {
    const route = apiRoutes.find(
      r => r.route === removeTrailingSegment(pathname, query) && r.method === method
    )

    // console.log('////////////////////////////////')
    // console.log("method : " + method + " => pathname : " + pathname)
    // console.log("removeTrailingSegment : " + removeTrailingSegment(pathname))
    // console.log(route)
    // console.log('////////////////////////////////')

    if (!route) {
      return {
        status: false,
        message: 'Invalid path Api',
      }
    }
    if (!permissions[route.key]) {
      return {
        status: false,
        message: 'The user does not have the required permission',
      }
    }
  }
  return {
    status: true,
    message: 'Authorization success',
  }
}

const removeTrailingSegment = (pathname: string, query) => {
  const segments = pathname.split('/')
  const exclude = [
    '/api/admin/user/importUser',
    '/api/admin/provider/timesheet',
    '/api/admin/reservation/editReserve',
    '/api/admin/reservation/changeStatusReserve',
    '/api/admin/reservation/appreciationReserve',
    '/api/admin/reservation/reminderReserve',
    '/api/admin/reservation/isReservation',
  ]

  if (query !== undefined && query.length > 0) {
    return pathname
  }

  if (
    (exclude.includes(pathname) && segments.length === 4) ||
    segments.length === 4 ||
    (exclude.includes(pathname) && segments.length === 5)
  ) {
    return pathname
  }
  return pathname.substring(0, pathname.lastIndexOf('/'))
}
