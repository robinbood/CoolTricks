import { RedisClient } from "bun";
import { eq, name } from "drizzle-orm";
import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import { users } from "@/Schema/Schema";
const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle({ client });

const store = new RedisClient();

const SignOut = async (req: Request) => {
  // get the cookie
  const coookie = req.headers.get("cookie");
// get the session id from the fookie
  const sessionId = coookie?.split("=")[1]?.split(";")[0];
  if (!sessionId) {
    return Response.redirect("/api/home");
  }

  const newCookie =
    "sessionId= ; HttpOnly; sameSite=Lax ; Path=/ , MaxAge=0";

  try {
    const exists = await store.exists(sessionId);
    const [user] = await store.hmget(sessionId, ["userId"]);
    if (!user) {
      throw new Error("User not found");
    }
    const userID = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(user)));
    if (!userID[0]) throw new Error("User not found in database");
    const name = userID[0].name;
    if (exists) {
      await store.del(sessionId);
      return new Response(
        JSON.stringify({
          message: "Come back any time",
          Name:name
        }),
        {
          headers: {
            // delete the coookie
            "Set-Cookie": newCookie,
            "Content-type": "application/json",
          },
        }
      );
    }
  } catch (error: unknown) {
    return new Response(
      JSON.stringify({
        message: "Session doesn't exist",
      }),
      {
        headers: {
          "Content-type": "application/json",
        },
        status: 404,
      }
    );
  }
};

export default SignOut;
