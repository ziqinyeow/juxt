export const URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
  : "http://localhost:3010/api";

export const WEBSOCKET_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `ws://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
  : "ws://localhost:3010/api";
