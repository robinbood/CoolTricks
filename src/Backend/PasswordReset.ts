import { drizzle } from "drizzle-orm/bun-sql";
import { eq } from "drizzle-orm";
import { SQL } from "bun";
import { users, tokens } from "@/Schema/Schema";
import generator from "@/Functionalities/Token";

const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle({ client });

const passWordReset = async (req: Request) => {
  const { email } = await req.json();
  // well it's obvious || get the user..remember this line returns an array unless you choose a limit
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
  // base64 hashed hashed API keys
  const info = btoa(`${process.env.MAILJET_API}:${process.env.MAILJET_SECRET}`);
  const authHeaders = new Headers({
    "Content-type": "application/json",
    Authorization: `Basic ${info}`,
  });

  // my technique failed and i think this works just fine
   
  await db.delete(tokens).where(eq(tokens.user, usero[0].id))
  await db
    .insert(tokens)
    .values({ token: token1, user: usero[0].id })
  // emails end up in spam due to me not having a domain
  await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      Messages: [
        {
          From: { Email: "tensorcensor@gmail.com", Name: "Host" },
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
