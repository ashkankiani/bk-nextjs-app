import {NextRequest, NextResponse} from 'next/server';
import {isAccess, isAuthenticated} from "@/libs/authentication";

export async function middleware(request: NextRequest) {
    // const token = request.cookies.get('bk-session')?.value;
    //
    // const authStatus = await isAuthenticated(token);
    //
    // if (!authStatus.status) return NextResponse.redirect(new URL('/unauthorized', request.url));
    //
    // const pathname = request.nextUrl.pathname;
    // const query = request.nextUrl.search;
    // const method = request.method
    //
    // const authAccess = await isAccess(method, pathname, query, authStatus.permissions)
    //
    // if (!authAccess.status) {
    //     return NextResponse.json({message: 'unAuthorized', reason: authAccess.message, status: 401}, {status: 201});
    // }

    const requestHeaders = new Headers(request.headers)

    // return NextResponse.next();
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};

