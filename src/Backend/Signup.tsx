import { drizzle } from "drizzle-orm/bun-sql";
import { eq } from "drizzle-orm";
import { SQL } from "bun";
import { users } from "@/Schema/Schema";

const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle({ client });

const SignUp = async (req: Request) => {
  const { name, username, password } = await req.json();

  const exists = await db
    .select()
    .from(users)
    .where(eq(username, users.username));
  if (exists.length > 0) {
    return new Response("Username already exists", { status: 400 });
  }
  const newPassword = await Bun.password.hash(password, {
    algorithm: "argon2id",
    memoryCost: 10,
  });
  await db.insert(users).values({ name, username, password: newPassword });
  return new Response("User Created Successfully", { status: 201 });
};
export default SignUp;
