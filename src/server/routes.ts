import index from "../index.html";
import SignIn from "../Backend/Signin";
import SignUp from "../Backend/Signup";
import SignOut from "../Backend/Signout";
import passWordReset from "../Backend/PasswordReset";
import TokenVerify from "../Backend/TokenVerify";
import CreatePaymentIntent from "../Backend/create-payment-intent";
import Webhook from "../Backend/Webhook";
import getPublishableKey from "../Backend/get-publishable-key";
import getUserInfo from "../Backend/get-user-info";
import getUserPosts from "../Backend/get-user-posts";
import createPost from "../Backend/create-post";
import Authenticate from "../Backend/Authenticate";

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.NODE_ENV === "production"
    ? "https://your-production-domain.com"
    : "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Allow-Credentials": "true",
};

const withAuth = (handler: (req: Request, userId: number) => Promise<Response>) => {
  return async (req: Request) => {
    const authResult = await Authenticate(req);
    if (authResult instanceof Response) {
      return authResult;
    }
    if (authResult && authResult.userId !== undefined) {
      return handler(req, authResult.userId);
    }
    return new Response(JSON.stringify({ message: "Authentication internal error" }), { status: 500 });
  };
};

const publicRoutes = {
  "/": {
    GET: () => new Response(Bun.file(index)),
  },
  "/Signin": {
    POST: SignIn,
  },
  "/Signup": {
    POST: SignUp,
  },
  "/forgot-pass": {
    POST: passWordReset,
  },
  "/token-lookup": {
    POST: TokenVerify,
  },
  "/Signout": {
    POST: SignOut,
  },
  "/webhook": {
    POST: Webhook,
  },
};

const protectedRoutes = {
  "/get-publishable-key": {
    GET: getPublishableKey,
  },
  "/create-payment-intent": {
    POST: CreatePaymentIntent,
  },
  "/get-user-info": {
    GET: withAuth((req, userId) => getUserInfo(userId)),
  },
  "/get-user-posts": {
    GET: withAuth(getUserPosts),
  },
  "/create-post": {
    POST: withAuth(createPost),
  },
};

export const routes = {
  ...publicRoutes,
  ...protectedRoutes,
};

export const handleRequest = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const path = url.pathname;
  const route = (routes as any)[path];

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (route) {
    const handler = route[req.method];
    if (handler) {
      const response = await handler(req);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
  }

  // Serve the index.html for any other GET request that is not an API endpoint.
  if (req.method === "GET") {
    return new Response(Bun.file(index));
  }

  return new Response("Not Found", { status: 404 });
};
