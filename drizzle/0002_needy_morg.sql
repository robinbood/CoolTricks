ALTER TABLE "users" RENAME COLUMN "emaail" TO "email";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_emaail_unique";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");