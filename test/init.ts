import { YelixHono } from "@yelix/hono";
import { YelixDashboard } from "../mod.ts";

// Basic instantiation test
const app = new YelixHono();
const dashboard = new YelixDashboard({
  username: "admin",
  password: "admin123"
});

const router = dashboard.createRouter(app);

console.log("✅ YelixDashboard module initialized successfully");
