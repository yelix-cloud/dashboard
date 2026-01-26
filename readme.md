# Yelix Dashboard

A lightweight, real-time dashboard for monitoring Yelix framework events with built-in authentication.

## Features

- 📊 **Real-time Statistics**: Total requests, endpoints, avg response times, success/error rates
- 📈 **Endpoint Analytics**: Performance metrics per endpoint (avg/min/max duration)
- 🔧 **Middleware Performance**: Execution times and counts for middleware
- 📋 **Live Request Feed**: Stream of recent API requests with full details
- 🔄 **Auto-refresh**: Automatically updates metrics every 5 seconds
- 🔐 **Basic Auth**: Username/password authentication with token support
- ⚡ **Zero Database**: All data stored in memory with event listeners
- 📦 **Single Dependency**: Only requires `@yelix/hono`

## Installation

```bash
deno add @yelix/dashboard
```

## Quick Start

```typescript
import { YelixHono } from "@yelix/hono";
import { YelixDashboard } from "@yelix/dashboard";

const app = new YelixHono();

// Mount dashboard with default credentials (admin/admin123)
const dashboard = new YelixDashboard({
  username: "admin",
  password: "admin123"
});

app.route("/dashboard", dashboard.createRouter(app, "/dashboard"));

// Your routes here
app.get("/api/users", (c) => c.json({ users: [] }));

Deno.serve(app.fetch);
```

The second parameter to `createRouter()` specifies the mount path and is used to filter dashboard requests automatically (preventing tracking loops).

## Configuration

### Mount Path

When mounting the dashboard, specify the exact path where it's accessible:

```typescript
// Mount at /dashboard (default)
app.route("/dashboard", dashboard.createRouter(app, "/dashboard"));

// Or mount at a different path
app.route("/monitoring", dashboard.createRouter(app, "/monitoring"));

// Or mount at root (with auto-detection)
app.route("/", dashboard.createRouter(app, "/"));
```

The mount path parameter is critical because:
- It prevents dashboard requests from being tracked (avoiding loops)
- It allows for custom mount paths
- It works dynamically with any path configuration

### Environment Variables

```bash
YELIX_DASHBOARD_USERNAME=myuser
YELIX_DASHBOARD_PASSWORD=mypassword123
```

### Options

```typescript
interface YelixDashboardOptions {
  username?: string;        // Default: "admin"
  password?: string;        // Default: "admin123"
  path?: string;            // Default: "/dashboard"
  apiPath?: string;         // Default: "/api/dashboard"
  refreshInterval?: number; // Default: 5000ms
}
```

## API Endpoints

All endpoints require basic authentication.

### Dashboard UI
- `GET /dashboard` - Main dashboard HTML page

### API Endpoints
- `GET /api/dashboard/stats` - Overall statistics
- `GET /api/dashboard/events?limit=50` - Recent events
- `GET /api/dashboard/endpoints` - Endpoint performance stats
- `GET /api/dashboard/middleware` - Middleware performance stats

## Usage Examples

### Custom Configuration

```typescript
const dashboard = new YelixDashboard({
  username: process.env.DASHBOARD_USER || "admin",
  password: process.env.DASHBOARD_PASS || "admin123",
  path: "/monitoring",
  apiPath: "/api/monitoring"
});

app.route("/monitoring", dashboard.createRouter(app));
```

### Access Dashboard

Visit `http://localhost:8000/dashboard` and authenticate with your credentials.

## How It Works

1. **Event Listening**: Dashboard listens to all Yelix events (request.start, request.end, middleware.start, middleware.end)
2. **Data Collection**: Events are stored in memory with aggregated statistics
3. **Live Updates**: Frontend polls API endpoints for fresh data
4. **Authentication**: Basic HTTP authentication protects all endpoints
5. **No Database**: All metrics are calculated on-the-fly from event data

## Security Notes

⚠️ **For Development**: This dashboard is designed for development and testing environments.

For production use:
- ✅ Use HTTPS to encrypt basic auth credentials
- ✅ Use strong, randomly generated passwords
- ✅ Restrict access to trusted networks
- ✅ Consider adding rate limiting
- ✅ Rotate credentials regularly

## Architecture

```
YelixDashboard
├── Auth Middleware
├── Event Listeners (request/middleware events)
├── Statistics Engine (real-time aggregation)
├── API Routes
│   ├── /stats - Overall metrics
│   ├── /events - Recent events
│   ├── /endpoints - Endpoint stats
│   └── /middleware - Middleware stats
└── HTML Dashboard
    ├── Real-time stats display
    ├── Event stream viewer
    ├── Filtering & search
    └── Auto-refresh
```

## License

MIT
