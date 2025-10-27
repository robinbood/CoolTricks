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

const withAuth = (handler: (req: Request, userId: number) => Promise<Response>) => {
  return async (req: Request) => {
    const authResult = await Authenticate(req);
    if (authResult instanceof Response) {
      return authResult; // Authentication failed, return the redirect response
    }
    // Ensure authResult is not undefined before accessing userId
    if (authResult && authResult.userId !== undefined) {
      return handler(req, authResult.userId); // Authentication successful, call the original handler
    }
    // If authResult is undefined or userId is missing, it's an internal error
    return new Response(JSON.stringify({ message: "Authentication internal error" }), { status: 500 });
  };
};

const publicRoutes = {
  "/*": index,
  "/Signin" : {
    async POST(req: Request) {
      return SignIn(req)
    }
  },
  "/Signup" : {
    async POST(req: Request) {
      return SignUp(req)
    }
  },
  "/forgot-pass":{
    async POST(req: Request) {
      return passWordReset(req)
    }
  },
  '/token-lookup': {
    async POST(req: Request) {
      return TokenVerify(req)
    }
  },
  "/webhook": { // Webhook is typically public for external services
    async POST(req: Request) {
      return Webhook(req)
    }
  },
};

// Protected routes (authentication required)
const protectedRoutes = {
  "/get-publishable-key": {
    async GET(req: Request, userId: number) {
      return getPublishableKey(req);
    }
  },
  "/create-payment-intent": {
    async POST(req: Request, userId: number) {
      return CreatePaymentIntent(req, userId);
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

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
