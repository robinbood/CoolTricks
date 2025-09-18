import { drizzle } from "drizzle-orm/bun-sql";
import { eq } from "drizzle-orm";
import { SQL } from "bun";
import { users, tokens } from "@/Schema/Schema";

const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle(client, { schema: { users, tokens } });

const TokenVerify = async (req: Request) => {
  const { token, newPass } = await req.json();

  const result = await db.query.tokens.findFirst({
    where: eq(tokens.token, token),
    with: {
      user: users,
    },
  });

  if (!result) {
    return Response.redirect("/signup");
  }

  const user = result.user;

  const hashedpass = await Bun.password.hash(newPass, {
    algorithm: "argon2id",
    memoryCost: 10,
    timeCost: 5,
  });
  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ password: hashedpass })
      .where(eq(users.id, user));

    
    await tx.delete(tokens).where(eq(tokens.token, token));
  });

  return new Response(
    JSON.stringify({
      message: "Password updated successfully",
    }),
    {
      status: 200,
      headers: {
        "Content-type": "application/json",
      },
    }
  );
};

export default TokenVerify;
