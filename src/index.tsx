import { serve } from "bun";
import index from "./index.html";
import SignIn from "./Backend/Signin";
import SignUp from "./Backend/Signup";
import passWordReset from "./Backend/PasswordReset";
import TokenVerify from "./Backend/TokenVerify";
import CreatePaymentIntent from "./Backend/create-payment-intent";
import Webhook from "./Backend/Webhook";

const server = serve({
  port: 3000,
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,
    "/Signin" : {
      async POST(req) {
        return SignIn(req)
      }
    },
    "/Signup" : {
      async POST(req) {
        return SignUp(req)
      }
    },
    "/forgot-pass":{
      async POST(req) {
        return passWordReset(req)
      }
    },
    '/token-lookup': {
      async POST(req) {
        return TokenVerify(req)
      }
    },
    "/create-payment-intent": {
      async POST(req) {
        return CreatePaymentIntent(req)
      }
    },
    "/webhook": {
      async POST(req) {
        return Webhook(req)
      }
    }
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
