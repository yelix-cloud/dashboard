import { Hono } from "hono";
import type { YelixHono } from "@yelix/hono";
import { DashboardAuth } from "./auth.ts";
import { DashboardStats } from "./stats.ts";
import { DASHBOARD_HTML } from "./html.ts";

export interface YelixDashboardOptions {
  username?: string;
  password?: string;
  path?: string;
  apiPath?: string;
  maxEvents?: number;
}

type AppWithEvents = YelixHono & {
  onYelixEvent(eventName: string, callback: (payload: Record<string, unknown>) => void): void;
};

/**
 * Yelix Dashboard - Real-time monitoring dashboard for Yelix events
 */
export class YelixDashboard {
  private auth: DashboardAuth;
  private stats: DashboardStats;
  private options: Required<YelixDashboardOptions>;

  constructor(options: YelixDashboardOptions = {}) {
    const username = options.username || Deno.env.get('YELIX_DASHBOARD_USERNAME') || 'admin';
    const password = options.password || Deno.env.get('YELIX_DASHBOARD_PASSWORD') || 'admin123';

    this.auth = new DashboardAuth(username, password);
    this.stats = new DashboardStats();
    this.options = {
      username,
      password,
      path: options.path || '/dashboard',
      apiPath: options.apiPath || '/api/dashboard',
      maxEvents: options.maxEvents || 1000,
    };
  }

  /**
   * Create a Hono router with dashboard routes
   * @param app - The YelixHono application instance
   * @param mountPath - The path where the dashboard is mounted (default: /dashboard)
   */
  createRouter(app: YelixHono, mountPath: string = '/dashboard'): Hono {
    const router = new Hono();

    // Paths to ignore (don't track dashboard's own requests)
    const ignorePaths = [
      mountPath,
      `${mountPath}/`,
      `${mountPath}/api/dashboard`,
    ];

    // Helper to check if a path should be ignored
    const shouldIgnorePath = (pathname: string): boolean => {
      return ignorePaths.some(p => pathname.startsWith(p));
    };

    // Attach event listeners to the YelixHono instance
    const appWithEvents = app as AppWithEvents;
    
    appWithEvents.onYelixEvent('request.start', (payload: Record<string, unknown>) => {
      const pathname = payload.pathname as string;
      // Don't track dashboard requests to avoid loops
      if (!shouldIgnorePath(pathname)) {
        this.stats.onRequestStart(payload);
      }
    });

    appWithEvents.onYelixEvent('request.end', (payload: Record<string, unknown>) => {
      const pathname = payload.pathname as string;
      // Don't track dashboard requests to avoid loops
      if (!shouldIgnorePath(pathname)) {
        this.stats.onRequestEnd(payload);
      }
    });

    appWithEvents.onYelixEvent('middleware.start', (payload: Record<string, unknown>) => {
      const requestId = payload.requestId as string;
      // Check if this request should be ignored based on stored event
      // We need to track this separately since middleware events don't have pathname
      const event = (this.stats as any).events?.find?.((e: any) => e.requestId === requestId);
      if (event && !shouldIgnorePath(event.pathname)) {
        this.stats.onMiddlewareStart(payload);
      }
    });

    appWithEvents.onYelixEvent('middleware.end', (payload: Record<string, unknown>) => {
      const requestId = payload.requestId as string;
      // Check if this request should be ignored based on stored event
      const event = (this.stats as any).events?.find?.((e: any) => e.requestId === requestId);
      if (event && !shouldIgnorePath(event.pathname)) {
        this.stats.onMiddlewareEnd(payload);
      }
    });

    appWithEvents.onYelixEvent('middleware.log', (payload: Record<string, unknown>) => {
      const requestId = payload.requestId as string;
      // Check if this request should be ignored based on stored event
      const event = (this.stats as any).events?.find?.((e: any) => e.requestId === requestId);
      if (event && !shouldIgnorePath(event.pathname)) {
        this.stats.onMiddlewareLog(payload);
      }
    });

    // Dashboard UI (no auth required for initial load, but auth header will be sent)
    router.get('/', (c) => {
      // Check auth
      const authHeader = c.req.header('Authorization');
      if (!authHeader) {
        return c.html(DASHBOARD_HTML);
      }

      try {
        const base64Credentials = authHeader.slice(6);
        const credentials = atob(base64Credentials);
        const [username, password] = credentials.split(':');

        if (username === this.options.username && password === this.options.password) {
          return c.html(DASHBOARD_HTML);
        }
      } catch {
        // Invalid auth
      }

      return c.html(DASHBOARD_HTML);
    });

    // Protected API Routes
    const apiRouter = new Hono();

    // Apply auth middleware
    apiRouter.use('*', this.auth.middleware());

    // Stats endpoint
    apiRouter.get('/stats', (c) => {
      return c.json(this.stats.getStats());
    });

    // Events endpoint
    apiRouter.get('/events', (c) => {
      const limit = parseInt(c.req.query('limit') || '50');
      return c.json(this.stats.getEvents(Math.min(limit, 500)));
    });

    // Endpoints endpoint
    apiRouter.get('/endpoints', (c) => {
      return c.json(this.stats.getEndpoints());
    });

    // Middleware endpoint
    apiRouter.get('/middleware', (c) => {
      return c.json(this.stats.getMiddlewares());
    });

    // Request detail endpoint
    apiRouter.get('/request/:requestId', (c) => {
      const requestId = c.req.param('requestId');
      const details = this.stats.getRequestDetails(requestId);
      if (!details) {
        return c.json({ error: 'Request not found' }, 404);
      }
      return c.json(details);
    });

    // Mount API router at relative path (becomes /api/dashboard when mounted at /dashboard)
    router.route('/api/dashboard', apiRouter);

    return router;
  }

  /**
   * Get the statistics engine
   */
  getStats(): DashboardStats {
    return this.stats;
  }

  /**
   * Get the auth handler
   */
  getAuth(): DashboardAuth {
    return this.auth;
  }
}
