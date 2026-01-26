import type { Context, Next } from 'hono';

/**
 * Basic authentication middleware for Yelix Dashboard
 * Supports both HTTP Basic Auth and Bearer tokens
 */
export class DashboardAuth {
  private username: string;
  private password: string;
  private tokens: Set<string> = new Set();

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  /**
   * Generate a random Bearer token
   */
  generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Add a valid token
   */
  addToken(token: string): void {
    this.tokens.add(token);
  }

  /**
   * Revoke a token
   */
  revokeToken(token: string): void {
    this.tokens.delete(token);
  }

  /**
   * Create authentication middleware
   */
  middleware(): (c: Context, next: Next) => Promise<Response | void> {
    return async (c: Context, next: Next) => {
      const authHeader = c.req.header('Authorization');

      // Check Bearer token
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        if (this.tokens.has(token)) {
          await next();
          return;
        }
      }

      // Check Basic auth
      if (authHeader && authHeader.startsWith('Basic ')) {
        try {
          const base64Credentials = authHeader.slice(6);
          const credentials = atob(base64Credentials);
          const [username, password] = credentials.split(':');

          if (username === this.username && password === this.password) {
            await next();
            return;
          }
        } catch {
          // Invalid base64, fall through to unauthorized
        }
      }

      // Unauthorized
      return c.text('Unauthorized', 401, {
        'WWW-Authenticate': 'Basic realm="Yelix Dashboard"',
      });
    };
  }
}
