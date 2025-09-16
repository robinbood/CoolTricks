import { drizzle } from "drizzle-orm/bun-sql";
import { eq } from "drizzle-orm";
import { SQL } from "bun";
import { users, tokens } from "@/Schema/Schema";
import generator from "@/Functionalities/Token";

const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle({ client });

const passWordReset = async (req: Request) => {
  const { email } = await req.json();

  const usero = await db.select().from(users).where(eq(users.email, email));
  if (!usero[0]) {
    return new Response(
      JSON.stringify({
        message: "Check your email for the coode",
      }),
      {
        status: 200,
      }
    );
  }
  const token1 = generator();
  const info = btoa(`${process.env.MAILJET_API}:${process.env.MAILJET_SECRET}`);
  const authHeaders = new Headers({
    "Content-type": "application/json",
    Authorization: `Basic ${info}`,
  });

  await db
    .insert(tokens)
    .values({ token: token1, user: usero[0].id })
    .onConflictDoUpdate({
      target: tokens.id,
      set: {
        token: token1,
      },
    });

  await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      Message: [
        {
          From: { Email: "tensorcensor@gmail.com", Name: "Hash" },
          To: [{ Email: email, Name: usero[0].name }],
          Subject: "Password reset request",
          TextPart: `Your token is ${token1}`
        },
      ],
    }),
  });
  return new Response(
    JSON.stringify({
      message: "Check your email for the code",
    }),
    {
      status: 200,
    }
  );
};

export default passWordReset;
