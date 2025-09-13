import {integer,varchar,pgTable} from "drizzle-orm/pg-core"

export const users = pgTable("users",{
    id:integer().generatedAlwaysAsIdentity().primaryKey(),
    email:varchar({length:255}).notNull().unique(),
    name:varchar({length:255}),
    username:varchar({length:255}).notNull().unique(),
    password:varchar({length:255}).notNull()
})