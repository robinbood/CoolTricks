DROP INDEX "user_unique_idx";--> statement-breakpoint
ALTER TABLE "tokens" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "tokens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_unique" UNIQUE("user");