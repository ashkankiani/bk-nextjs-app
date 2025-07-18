/*<====================================>*/
// Create Response Request
/*<====================================>*/

// تابع عمومی برای ایجاد پاسخ صحیح دارای دیتا
export function createSuccessResponseWithData<T>(Data: T, header?: { [key: string]: string }) {
  return new Response(createTemplateSuccessResponseWithData(Data), {
    headers: {
      'Content-Type': 'application/json',
      ...header,
    },
  })
}

// تابع عمومی برای ایجاد پاسخ صحیح دارای پیام
export function createSuccessResponseWithMessage(Message: string) {
  return new Response(createTemplateSuccessResponseWithMessage(Message), {
    headers: { 'Content-Type': 'application/json' },
  })
}

// تابع عمومی برای ایجاد پاسخ خطا دارای پیام
export function createErrorResponseWithMessage(
  Message: string,
  Errors: {
    Code: string | number
    Details: string
  } | null = null
) {
  return new Response(createTemplateErrorResponseWithMessage(Message, Errors), {
    headers: { 'Content-Type': 'application/json' },
  })
}

/*<====================================>*/
// Create Template Response
/*<====================================>*/
export function createTemplateSuccessResponseWithData<T>(
  Data: T,
  Success: boolean = true,
  Message: string = 'عملیات با موفقیت انجام شد'
) {
  return JSON.stringify({
    Message: Message,
    Success: Success,
    Data: Data,
  })
}

export function createTemplateSuccessResponseWithMessage(Message: string, Success: boolean = true) {
  return JSON.stringify({
    Message,
    Success,
  })
}

export function createTemplateErrorResponseWithMessage(
  Message: string,
  Errors: {
    Code: string | number
    Details: string
  } | null = null,
  Success: boolean = false
) {
  return JSON.stringify({
    Message,
    Success,
    Errors,
  })
}

/*<====================================>*/
// Check Method Request
/*<====================================>*/

// اگر متد مجاز بود، هیچ چیزی برنمی‌گرداند
export function checkMethodAllowed(request: Request, allowedMethods: string[]) {
  if (!allowedMethods.includes(request.method)) {
    return createMethodNotAllowedResponse(request.method)
  }
  return null
}

export function createMethodNotAllowedResponse(method: string) {
  return createErrorResponseWithMessage(`Method ${method} Not Allowed`, {
    Code: 405,
    Details: 'Method Not Allowed',
  })
}

/*<====================================>*/
// Request Error Response
/*<====================================>*/

// خطاهای ناشناخته
export function handlerRequestError(error: unknown) {
  return createErrorResponseWithMessage(`Internal Server Error`, {
    Code: 500,
    Details: error instanceof Error ? error.message : 'Unknown error',
  })
}

/*<====================================>*/
// دریافت مقدار کلید از کئوری Get
/*<====================================>*/
export function getQueryStringByUrl(url: string, key: string = 'id') {
  const newUrl = new URL(url)
  return newUrl.searchParams.get(key)
}

/*<====================================>*/
// دریافت مقدار کلید از کئوری ترکیبی
// ?status=REVIEW&status=COMPLETED
// ?status[0]=REVIEW&status[1]=COMPLETED
/*<====================================>*/
export function getQueryArrayFlexible(url: string, baseKey: string): string[] {
  const searchParams = new URL(url).searchParams

  // حالت ۱: status[0], status[1], ...
  const indexed = Array.from(searchParams.entries())
    .filter(([key]) => key.startsWith(`${baseKey}[`))
    .sort(([a], [b]) => {
      const iA = parseInt(a.match(/\[(\d+)\]/)?.[1] || '0')
      const iB = parseInt(b.match(/\[(\d+)\]/)?.[1] || '0')
      return iA - iB
    })
    .map(([_, value]) => value)

  if (indexed.length > 0) return indexed

  // حالت ۲: status=REVIEW&status=...
  return searchParams.getAll(baseKey)
}

/*<====================================>*/
// سریال سازی مقدار داده bigint
/*<====================================>*/
export function serializeBigIntToNumber<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_key, value) => (typeof value === 'bigint' ? Number(value) : value))
  )
}

export function serializeBigIntToString<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_key, value) => (typeof value === 'bigint' ? value.toString() : value))
  )
}

/*<====================================>*/
// بررسی الزامی بودن داده های ورودی درخواست
/*<====================================>*/
export function checkRequiredFields(fields: Record<string, any>): string | null {
  const missing = Object.entries(fields)
    .filter(([_, value]) => value === undefined || value === null || value === '')
    .map(([key]) => key)

  if (missing.length === 0) return null

  return `${missing.join(', ')} ${missing.length > 1 ? 'are' : 'is'} required`
}
