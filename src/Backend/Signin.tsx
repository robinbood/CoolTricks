import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sql";
import { SQL } from "bun";
import { RedisClient } from "bun";
import { users } from "@/Schema/Schema";
const store = new RedisClient();
const client = new SQL(Bun.env.DATABASE_URL!);
const db = drizzle({ client });

const SignIn = async (req: Request) => {
  const { username, password } = await req.json();

  const exists = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  if (!exists[0]) {
    return new Response(
      JSON.stringify({
        message: "User doesn't exist",
      }),
      {
        status: 401,
      }
    );
  }
  const valid = await Bun.password.verify(password, exists[0]?.password);
  if (!valid) {
    return new Response(
      JSON.stringify({
        message: "Invalid Credentials",
      }),
      { status: 401 }
    );
  }
  const session = Bun.randomUUIDv7();
  const key = `session:${session}`;

  await store.hmset(key, ["userId", exists[0].id.toString()]);

  return new Response(
    JSON.stringify({
      message: `Welcome ${exists[0].name}`,
    }),
    {
      status: 200,
      headers: {
        "Set-Cookie": `sessionId=${key}; HttpOnly; Secure; SameSite=strict; Path=/;`,
      },
    }
  );
};

export default SignIn;
