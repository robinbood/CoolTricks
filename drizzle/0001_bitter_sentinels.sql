ALTER TABLE "users" ADD COLUMN "emaail" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_emaail_unique" UNIQUE("emaail");