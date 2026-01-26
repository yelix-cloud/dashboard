/**
 * @yelix/dashboard - Live monitoring dashboard for Yelix framework events
 *
 * @module
 * @example
 * ```typescript
 * import { YelixHono } from "@yelix/hono";
 * import { YelixDashboard } from "@yelix/dashboard";
 *
 * const app = new YelixHono();
 *
 * // Create and mount dashboard
 * const dashboard = new YelixDashboard({
 *   username: "admin",
 *   password: "admin123"
 * });
 *
 * app.route("/dashboard", dashboard.createRouter(app));
 *
 * // Your routes
 * app.get("/api/users", (c) => c.json({ users: [] }));
 *
 * Deno.serve(app.fetch);
 * ```
 */

export { YelixDashboard, type YelixDashboardOptions } from './src/middleware.ts';
export { DashboardAuth } from './src/auth.ts';
export { DashboardStats, type EventData, type MiddlewareData, type EndpointStats, type MiddlewareStats } from './src/stats.ts';
