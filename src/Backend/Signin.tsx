import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sql";
import { SQL } from "bun";
import { RedisClient } from "bun";
import { users } from "@/Schema/Schema";
const store = new RedisClient();
const client = new SQL(Bun.env.DATABASE_URL!)
const db = drizzle({client})



