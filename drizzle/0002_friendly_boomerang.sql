ALTER TABLE "tokens" DROP CONSTRAINT "tokens_user_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tokens" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "tokens" ALTER COLUMN "token" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_unique_idx" ON "tokens" USING btree ("user");