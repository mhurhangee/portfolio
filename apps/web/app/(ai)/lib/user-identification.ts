import { cookies } from 'next/headers';
import { generateId} from 'ai'
import { NextRequest } from 'next/server';

const USER_ID_COOKIE = 'ai_user_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

export async function getUserId(): Promise<string> {
  const cookieStore = await cookies();
  let userId = cookieStore.get(USER_ID_COOKIE)?.value;
  
  // If no user ID exists, create a new one and set the cookie
  if (!userId) {
    userId = generateId();
    
    // Set the cookie (server-side)
    // This will be available for all routes
    cookieStore.set(USER_ID_COOKIE, userId, {
      maxAge: COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true
    });
  }
  
  return userId;
}

// Client-side version for components that need user ID
export function getUserIdClient(): string | null {
  if (typeof document === 'undefined') return null;
  
  // Parse cookies from document.cookie
  const cookies = document.cookie
    .split(';')
    .map(cookie => cookie.trim())
    .reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
  
  return cookies[USER_ID_COOKIE] || null;
}

/**
 * Extract user information from the request including ID, IP address, and user agent
 * @param req NextRequest object
 * @returns Object containing user information
 */
export async function getUserInfo(req: NextRequest): Promise<{
  userId: string;
  ip: string;
  userAgent: string;
}> {
  // Get user ID
  const userId = await getUserId();
  
  // Get IP address from request
  // Prioritize X-Forwarded-For header which is set by proxies
  let ip = req.headers.get('x-forwarded-for') || req.ip || '';
  
  // If multiple IPs in X-Forwarded-For, get the first one
  if (ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }
  
  // Get user agent
  const userAgent = req.headers.get('user-agent') || '';
  
  return {
    userId,
    ip,
    userAgent
  };
}