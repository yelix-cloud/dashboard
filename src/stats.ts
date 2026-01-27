// deno-lint-ignore-file no-explicit-any

/**
 * In-memory storage for dashboard metrics
 */
export interface EventData {
  requestId: string;
  timestamp: number;
  method: string;
  pathname: string;
  duration?: string;
  status?: number;
  middlewares: MiddlewareData[];
  headers?: Record<string, string>;
  body?: unknown;
  bodyType?: string;
  queryParams?: Record<string, string | string[]>;
  pathParams?: Record<string, string | string[]>;
  responseBody?: unknown;
  responseHeaders?: Record<string, string>;
  responseBodyType?: string;
}

export interface MiddlewareData {
  name: string;
  duration: string;
  startTime: number;
}

export interface EndpointStats {
  path: string;
  method: string;
  count: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  lastCalled: number;
  successCount: number;
  errorCount: number;
}

export interface MiddlewareStats {
  name: string;
  count: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
}

export interface LogData {
  requestId: string;
  middlewareName: string;
  middlewareCount: number;
  messages: unknown[];
  timestamp: number;
}

export interface Stats {
  totalRequests: number;
  uniqueEndpoints: number;
  avgDuration: number;
  maxDuration: number;
  successCount: number;
  errorCount: number;
  uptime: number;
}

export interface EventResponse {
  requestId: string;
  timestamp: string;
  method: string;
  pathname: string;
  duration?: string;
  status?: number;
  middlewares: MiddlewareData[];
  log_count: number;
}

export interface RequestDetails {
  request: {
    requestId: string;
    request_id: string;
    method: string;
    pathname: string;
    status?: number;
    duration?: string;
    timestamp: string;
    started_at: string;
    url: string;
    headers?: Record<string, string>;
    body?: unknown;
    body_type?: string;
    query_params?: Record<string, string | string[]>;
    path_params?: Record<string, string | string[]>;
    response_body?: unknown;
    response_headers?: Record<string, string>;
    response_body_type?: string;
  };
  middleware: Array<{
    middleware_name: string;
    name: string;
    middleware_count: number;
    duration: string;
    started_at: string;
    timestamp: string;
  }>;
  logs: Array<{
    request_id: string;
    middleware_name: string;
    name: string;
    middleware_count: number;
    messages: unknown[];
    logged_at: string;
    timestamp: string;
  }>;
}

/**
 * Dashboard statistics engine
 */
export class DashboardStats {
  private events: EventData[] = [];
  private maxEvents: number;
  private endpoints: Map<string, EndpointStats> = new Map();
  private middlewares: Map<string, MiddlewareStats> = new Map();
  private logs: LogData[] = [];
  private maxLogs: number;
  private startTime: number = Date.now();

  constructor(maxEvents: number = 100, maxLogs: number = 10000) {
    this.maxEvents = maxEvents;
    this.maxLogs = maxLogs;
  }

  /**
   * Handle request.start event
   */
  onRequestStart(payload: any): void {
    const event: EventData = {
      requestId: payload.requestId,
      timestamp: Date.now(),
      method: payload.method,
      pathname: payload.pathname,
      middlewares: [],
      headers: payload.headers || {},
      body: payload.body,
      bodyType: payload.bodyType,
      queryParams: payload.query,
      pathParams: payload.params,
    };

    this.events.unshift(event);
    if (this.events.length > this.maxEvents) {
      this.events.pop();
    }
  }

  /**
   * Handle request.end event
   */
  onRequestEnd(payload: any): void {
    const event = this.events.find((e) => e.requestId === payload.requestId);
    if (event) {
      event.duration = payload.duration;
      event.status = payload.status;
      event.responseBody = payload.responseBody;
      event.responseHeaders = payload.responseHeaders;
      event.responseBodyType = payload.responseBodyType;
      // Update path params and query from request.end (more reliable)
      event.pathParams = payload.params || event.pathParams;
      event.queryParams = payload.query || event.queryParams;

      // Update endpoint stats
      const key = `${payload.pathname}`;
      const stats = this.endpoints.get(key) || {
        path: payload.pathname,
        method: 'N/A',
        count: 0,
        avgDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
        lastCalled: 0,
        successCount: 0,
        errorCount: 0,
      };

      stats.count++;
      stats.lastCalled = Date.now();

      if (payload.status >= 200 && payload.status < 300) {
        stats.successCount++;
      } else if (payload.status >= 400) {
        stats.errorCount++;
      }

      // Parse duration string
      const durationMs = this.parseDuration(payload.duration);
      if (durationMs !== null) {
        stats.avgDuration = (stats.avgDuration * (stats.count - 1) + durationMs) / stats.count;
        stats.minDuration = Math.min(stats.minDuration, durationMs);
        stats.maxDuration = Math.max(stats.maxDuration, durationMs);
      }

      this.endpoints.set(key, stats);
    }
  }

  /**
   * Handle middleware.start event
   */
  onMiddlewareStart(payload: any): void {
    const event = this.events.find((e) => e.requestId === payload.requestId);
    if (event) {
      event.middlewares.push({
        name: payload.middlewareName,
        duration: '',
        startTime: Date.now(),
      });
    }
  }

  /**
   * Handle middleware.end event
   */
  onMiddlewareEnd(payload: any): void {
    const event = this.events.find((e) => e.requestId === payload.requestId);
    if (event) {
      const middleware = event.middlewares.find((m) => m.name === payload.middlewareName);
      if (middleware) {
        middleware.duration = payload.duration;
      }

      // Update middleware stats
      const stats = this.middlewares.get(payload.middlewareName) || {
        name: payload.middlewareName,
        count: 0,
        avgDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
      };

      stats.count++;
      const durationMs = this.parseDuration(payload.duration);
      if (durationMs !== null) {
        stats.avgDuration = (stats.avgDuration * (stats.count - 1) + durationMs) / stats.count;
        stats.minDuration = Math.min(stats.minDuration, durationMs);
        stats.maxDuration = Math.max(stats.maxDuration, durationMs);
      }

      this.middlewares.set(payload.middlewareName, stats);
    }
  }

  /**
   * Handle middleware.log event
   */
  onMiddlewareLog(payload: any): void {
    const log: LogData = {
      requestId: payload.requestId,
      middlewareName: payload.middlewareName,
      middlewareCount: typeof payload.count === 'string' ? parseInt(payload.count) : payload.count,
      messages: Array.isArray(payload.messages) ? payload.messages : [payload.messages],
      timestamp: Date.now(),
    };

    this.logs.push(log);
    
    // Limit log storage to prevent memory issues
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * Get overall statistics
   */
  getStats(): Stats {
    const totalRequests = this.events.length;
    const successCount = this.events.filter((e) => e.status && e.status < 300).length;
    const errorCount = this.events.filter((e) => e.status && e.status >= 400).length;

    const durations = this.events
      .filter((e) => e.duration)
      .map((e) => this.parseDuration(e.duration!))
      .filter((d) => d !== null) as number[];

    const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
    const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;

    return {
      totalRequests,
      uniqueEndpoints: this.endpoints.size,
      avgDuration: Math.round(avgDuration * 100) / 100,
      maxDuration: Math.round(maxDuration * 100) / 100,
      successCount,
      errorCount,
      uptime: Math.round((Date.now() - this.startTime) / 1000),
    };
  }

  /**
   * Get recent events
   */
  getEvents(limit: number = 50): EventResponse[] {
    return this.events.slice(0, limit).map((e) => {
      // Count logs for this request
      const logCount = this.logs.filter((log) => log.requestId === e.requestId).length;
      
      return {
        requestId: e.requestId,
        timestamp: new Date(e.timestamp).toISOString(),
        method: e.method,
        pathname: e.pathname,
        duration: e.duration,
        status: e.status,
        middlewares: e.middlewares,
        log_count: logCount,
      };
    });
  }

  /**
   * Get endpoint statistics
   */
  getEndpoints(): EndpointStats[] {
    return Array.from(this.endpoints.values())
      .sort((a, b) => b.lastCalled - a.lastCalled)
      .map((e) => ({
        ...e,
        avgDuration: Math.round(e.avgDuration * 100) / 100,
        minDuration: Math.round(e.minDuration * 100) / 100,
        maxDuration: Math.round(e.maxDuration * 100) / 100,
      }));
  }

  /**
   * Get middleware statistics
   */
  getMiddlewares(): MiddlewareStats[] {
    return Array.from(this.middlewares.values())
      .sort((a, b) => b.count - a.count)
      .map((m) => ({
        ...m,
        avgDuration: Math.round(m.avgDuration * 100) / 100,
        minDuration: Math.round(m.minDuration * 100) / 100,
        maxDuration: Math.round(m.maxDuration * 100) / 100,
      }));
  }

  /**
   * Get request details by ID
   */
  getRequestDetails(requestId: string): RequestDetails | null {
    const event = this.events.find((e) => e.requestId === requestId);
    if (!event) {
      return null;
    }

    // Get all logs for this request
    const requestLogs = this.logs.filter((log) => log.requestId === requestId);

    return {
      request: {
        requestId: event.requestId,
        request_id: event.requestId,
        method: event.method,
        pathname: event.pathname,
        status: event.status,
        duration: event.duration,
        timestamp: new Date(event.timestamp).toISOString(),
        started_at: new Date(event.timestamp).toISOString(),
        url: event.pathname,
        headers: event.headers,
        body: event.body,
        body_type: event.bodyType,
        query_params: event.queryParams,
        path_params: event.pathParams,
        response_body: event.responseBody,
        response_headers: event.responseHeaders,
        response_body_type: event.responseBodyType,
      },
      middleware: event.middlewares.map((m, index) => ({
        middleware_name: m.name,
        name: m.name,
        middleware_count: index + 1,
        duration: m.duration,
        started_at: new Date(m.startTime).toISOString(),
        timestamp: new Date(m.startTime).toISOString(),
      })),
      logs: requestLogs.map((log) => ({
        request_id: log.requestId,
        middleware_name: log.middlewareName,
        name: log.middlewareName,
        middleware_count: log.middlewareCount,
        messages: log.messages,
        logged_at: new Date(log.timestamp).toISOString(),
        timestamp: new Date(log.timestamp).toISOString(),
      })),
    };
  }

  /**
   * Parse duration string (e.g., "123ms", "1.5s", "500μs")
   */
  private parseDuration(duration: string): number | null {
    const match = duration.match(/^([\d.]+)(ms|μs|ns|s)$/);
    if (!match) return null;

    const value = parseFloat(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'ns':
        return value / 1_000_000; // nano to ms
      case 'μs':
        return value / 1000; // micro to ms
      case 'ms':
        return value;
      case 's':
        return value * 1000;
      default:
        return null;
    }
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.events = [];
    this.endpoints.clear();
    this.middlewares.clear();
    this.logs = [];
    this.startTime = Date.now();
  }
}
