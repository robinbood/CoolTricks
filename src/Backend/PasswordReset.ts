import { drizzle } from "drizzle-orm/bun-sql";
import { eq } from "drizzle-orm";
import { SQL } from "bun";
import { users,tokens } from "@/Schema/Schema";

const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle({ client });

const passWordReset =  async (req:Request) => {
    const [email] = await req.json()

    const user = await db.select().from(users).where(eq(users.email,email))
    if ()
}