CREATE TABLE "api_tokens" (
	"token_id" uuid PRIMARY KEY NOT NULL,
	"candidate_id" uuid NOT NULL,
	"token_name" text NOT NULL,
	"prefix" text NOT NULL,
	"hash" text NOT NULL,
	"scopes" text[] NOT NULL,
	"expires_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "roles_candidate_end_start_company_role_id_index";--> statement-breakpoint
ALTER TABLE "api_tokens" ADD CONSTRAINT "api_tokens_candidate_id_candidates_candidate_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("candidate_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "api_tokens_hash_unique_index" ON "api_tokens" USING btree ("hash");--> statement-breakpoint
CREATE INDEX "api_tokens_candidate_index" ON "api_tokens" USING btree ("candidate_id");--> statement-breakpoint
CREATE INDEX "roles_candidate_end_start_company_role_index" ON "roles" USING btree ("candidate_id","end_date" DESC NULLS FIRST,"start_date" DESC NULLS LAST,"company","role","role_id");