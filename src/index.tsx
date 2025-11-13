import { serve } from "bun";
import { handleRequest } from "./server/routes";

const server = serve({
  port: 3000,
  fetch: handleRequest,
  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
