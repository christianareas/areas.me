DROP INDEX "accomplishments_candidate_id_role_id_sort_order_index";--> statement-breakpoint
DROP INDEX "credentials_candidate_id_end_date_start_date_index";--> statement-breakpoint
DROP INDEX "skill_sets_candidate_id_sort_order_index";--> statement-breakpoint
DROP INDEX "skills_candidate_id_skill_set_id_sort_order_index";--> statement-breakpoint
CREATE INDEX "accomplishments_candidate_role_sort_index" ON "accomplishments" USING btree ("candidate_id","role_id","sort_order");--> statement-breakpoint
CREATE INDEX "credentials_candidate_end_start_index" ON "credentials" USING btree ("candidate_id","end_date","start_date");--> statement-breakpoint
CREATE INDEX "skill_sets_candidate_sort_index" ON "skill_sets" USING btree ("candidate_id","sort_order");--> statement-breakpoint
CREATE INDEX "skills_candidate_skill_set_sort_index" ON "skills" USING btree ("candidate_id","skill_set_id","sort_order");