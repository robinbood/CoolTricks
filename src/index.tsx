import { serve } from "bun";
import index from "./index.html";
import SignIn from "./Backend/Signin";
import SignUp from "./Backend/Signup";
import passWordReset from "./Backend/PasswordReset";
import TokenVerify from "./Backend/TokenVerify";
import Authenticate from "./Backend/Authenticate";
import CreatePaymentIntent from "./Backend/create-payment-intent";
import Webhook from "./Backend/Webhook";
import getPublishableKey from "./Backend/get-publishable-key";
import getUserInfo from "./Backend/get-user-info";
import getUserPosts from "./Backend/get-user-posts";
import createPost from "./Backend/create-post";

// CORS middleware
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.NODE_ENV === "production"
    ? "https://your-production-domain.com" // Replace with your actual production domain
    : "http://localhost:3000", // Development origin
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Allow-Credentials": "true",
};

const corsMiddleware = (request: Request) => {
  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }
  return null; // Continue with normal request processing
};

const withAuth = (handler: (req: Request, userId: number) => Promise<Response>) => {
  return async (req: Request) => {
    const authResult = await Authenticate(req);
    if (authResult instanceof Response) {
      // Add CORS headers to the authentication response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        authResult.headers.set(key, value);
      });
      return authResult; // Authentication failed, return the redirect response
    }
    // Ensure authResult is not undefined before accessing userId
    if (authResult && authResult.userId !== undefined) {
      const response = await handler(req, authResult.userId); // Authentication successful, call the original handler
      // Add CORS headers to the response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
    // If authResult is undefined or userId is missing, it's an internal error
    const errorResponse = new Response(JSON.stringify({ message: "Authentication internal error" }), { status: 500 });
    // Add CORS headers to the error response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      errorResponse.headers.set(key, value);
    });
    return errorResponse;
  };
};

const publicRoutes = {
  "/*": index,
  "/Signin" : {
    async POST(req: Request) {
      const response = await SignIn(req);
      // Add CORS headers to the response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
  },
  "/Signup" : {
    async POST(req: Request) {
      const response = await SignUp(req);
      // Add CORS headers to the response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
  },
  "/forgot-pass":{
    async POST(req: Request) {
      const response = await passWordReset(req);
      // Add CORS headers to the response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
  },
  '/token-lookup': {
    async POST(req: Request) {
      const response = await TokenVerify(req);
      // Add CORS headers to the response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
  },
  "/webhook": { // Webhook is typically public for external services
    async POST(req: Request) {
      const response = await Webhook(req);
      // Add CORS headers to the response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
  },
};

// Protected routes (authentication required)
const protectedRoutes = {
  "/get-publishable-key": {
    async GET(req: Request, userId: number) {
      const response = await getPublishableKey(req);
      // Add CORS headers to the response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
  },
  "/create-payment-intent": {
    async POST(req: Request, userId: number) {
      const response = await CreatePaymentIntent(req, userId);
      // Add CORS headers to the response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
  },
  "/get-user-info": {
    async GET(req: Request, userId: number) {
      const response = await getUserInfo(req, userId);
      // Add CORS headers to the response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
  },
  "/get-user-posts": {
    async GET(req: Request, userId: number) {
      const response = await getUserPosts(req, userId);
      // Add CORS headers to the response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
  },
  "/create-post": {
    async POST(req: Request, userId: number) {
      const response = await createPost(req, userId);
      // Add CORS headers to the response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
  },
};

// Wrap protected routes with withAuth
const wrappedProtectedRoutes = Object.fromEntries(
  Object.entries(protectedRoutes).map(([path, methods]) => [
    path,
    Object.fromEntries(
      Object.entries(methods).map(([method, handler]) => [
        method,
        withAuth(handler as (req: Request, userId: number) => Promise<Response>),
      ])
    ),
  ])
);

// Merge all routes
const allRoutes = {
  ...publicRoutes,
  ...wrappedProtectedRoutes,
};

const server = serve({
  port: 3000,
  routes: allRoutes,
  
  // Add CORS middleware using the built-in fetch method
  async fetch(request) {
    // Check if this is a preflight request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }
    
    // Find the matching route
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Check if the path exists in our routes
    const route = (allRoutes as Record<string, any>)[path];
    
    if (route) {
      // Handle static file serving
      if (typeof route === "string") {
        const file = Bun.file(route);
        const response = new Response(file);
        
        // Add CORS headers to the response
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        
        return response;
      }
      
      // Handle API routes
      const method = request.method.toUpperCase();
      if (route[method]) {
        const response = await route[method](request);
        
        // Add CORS headers to the response
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        
        return response;
      }
    }
    
    // Default 404 response with CORS headers
    const notFoundResponse = new Response("Not Found", { status: 404 });
    Object.entries(corsHeaders).forEach(([key, value]) => {
      notFoundResponse.headers.set(key, value);
    });
    
    return notFoundResponse;
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
