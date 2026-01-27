/**
 * Example: Yelix Dashboard Integration
 * 
 * This example shows how to set up the Yelix Dashboard with a YelixHono application
 */

import { YelixHono } from "@yelix/hono";
import { YelixDashboard } from "@yelix/dashboard";

// Create a YelixHono application
const app = new YelixHono(undefined, {
  environment: "development"
});

// Create the dashboard with custom credentials
const dashboard = new YelixDashboard({
  username: "admin",
  password: "supersecure123"
});

// Mount the dashboard at the /dashboard path
// Pass the mount path as second parameter (defaults to /dashboard)
// This automatically filters out dashboard requests to avoid loops
app.route("/dashboard", dashboard.createRouter(app, "/dashboard"));

// Define some API routes
app.get("/", (c) => {
  app.yelixLog(c, "Hello from Yelix!");
  return c.json({ message: "Hello from Yelix!" });
});

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];
app.get("/api/users", (c) => {
  app.yelixLog(c, "Users fetched", { users });
  return c.json(users);
});

app.get("/api/users/:id", (c) => {
  const id = Number(c.req.param("id"));
  const user = users.find((u) => u.id === id);

  if (!user) {
    app.yelixLog(c, `User with id ${id} not found`, { id });
    return c.json({ error: "User not found" }, 404);
  }

  app.yelixLog(c, `User with id ${id} fetched`, { user });
  return c.json(user);
});

app.post("/api/users", async (c) => {
  const user = await c.req.json();
  if (!user?.name) {
    app.yelixLog(c, "User creation failed", { error: "Name is required" });
    return c.json({ error: "Name is required" }, 400);
  }
  users.push(user);
  app.yelixLog(c, "User created", { user });
  return c.json(user, 201);
});

app.get('/api/users/add-some' , (c) => {
  const newUsers = [
    { id: users.length + 1, name: "Charlie" },  
    { id: users.length + 2, name: "Diana" },  
    { id: users.length + 3, name: "Eve" },      
    { id: users.length + 4, name: "Frank" },
    { id: users.length + 5, name: "Grace" },
    { id: users.length + 6, name: "Hank" },
  ];

  users.push(...newUsers);
  app.yelixLog(c, "Added some users", { newUsers });
  return c.json({ message: "Added some users", newUsers });
});

// Listen on port 8000
Deno.serve({ port: 8000 }, app.fetch);

console.log("🚀 Server running at http://localhost:8000");
console.log("📊 Dashboard available at http://localhost:8000/dashboard");
console.log("   Username: admin");
console.log("   Password: supersecure123");

// fetches
async function fetches() {
  const res1 = await fetch("http://localhost:8000/api/users");
  const res2 = await fetch("http://localhost:8000/api/users/1");
  const addJSON = { name: "New User" };
  const resPost = await fetch("http://localhost:8000/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(addJSON),
  });
  const res3 = await fetch("http://localhost:8000/api/users/add-some?msg=hello");
}
fetches();
