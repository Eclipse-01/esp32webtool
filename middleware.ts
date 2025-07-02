import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // 处理CORS预检请求
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Max-Age': '86400', // 24小时
            },
        });
    }

    // 为其他请求添加CORS头
    const response = NextResponse.next();
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    return response;
}

// 配置中间件匹配的路径
export const config = {
    matcher: '/api/:path*', // 只对API路由应用中间件
};
