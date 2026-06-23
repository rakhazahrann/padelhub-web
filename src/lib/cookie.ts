const AUTH_COOKIE_NAME = 'padelhub-auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

type AuthCookiePayload = {
  isAuthenticated: boolean;
  role: string;
  email: string;
  name: string;
};

export function setAuthCookie(payload: AuthCookiePayload): void {
  if (typeof document === 'undefined') return;
  const value = encodeURIComponent(JSON.stringify(payload));
  document.cookie = `${AUTH_COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearAuthCookie(): void {
  if (typeof document === 'undefined') return;
  // Delete the padelhub-auth cookie by clearing its value with same parameters as set
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax; Secure`;
  
  // Also clear Better Auth session cookies
  document.cookie = 'better-auth.session_token=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'better-auth.session_token=; path=/; max-age=0; SameSite=Lax; Secure';
}
