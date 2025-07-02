// CORS工具函数
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
};

export const jsonHeaders = {
  'Content-Type': 'application/json',
  ...corsHeaders,
};

// 创建带CORS头的JSON响应
export function createCorsResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders,
  });
}

// 创建OPTIONS响应
export function createOptionsResponse() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}
