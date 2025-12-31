DROP INDEX "credentials_candidate_id_index";--> statement-breakpoint
DROP INDEX "roles_candidate_id_index";--> statement-breakpoint
CREATE INDEX "credentials_candidate_id_end_date_start_date_index" ON "credentials" USING btree ("candidate_id","end_date","start_date");--> statement-breakpoint
CREATE INDEX "roles_candidate_id_end_date_start_date_company_index" ON "roles" USING btree ("candidate_id","end_date","start_date","company");