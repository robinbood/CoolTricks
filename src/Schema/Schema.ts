import { relations } from "drizzle-orm"
import { boolean } from "drizzle-orm/pg-core"
import {integer,varchar,pgTable} from "drizzle-orm/pg-core"

export const users = pgTable("users",{
    id:integer().generatedAlwaysAsIdentity().primaryKey(),
    email:varchar({length:255}).notNull().unique(),
    name:varchar({length:255}),
    username:varchar({length:255}).notNull().unique(),
    password:varchar({length:255}).notNull()
})

export const usersRelations = relations(users,({one}) => ({
    token:one(tokens),
    subscriptions:one(subscriptions)

}))


export const tokens = pgTable("tokens",{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    token:integer().unique(),
    user:integer().references(() => users.id,{onDelete:"cascade"}).unique()
})

export const tokensRelations = relations(tokens,({one}) => ({
    user:one(users, {fields: [tokens.user], references : [users.id]})
}))

export const subscriptions = pgTable("subscriptions" , {
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    premium:boolean().notNull().default(false),
    user:integer().references(() => users.id,{onDelete:"cascade"}).unique()
})

export const subscriptionsRelations = relations(subscriptions,({one}) => ({
    user:one(users ,{fields: [subscriptions.user], references : [users.id]})
}))