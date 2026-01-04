CREATE INDEX "accomplishments_candidate_id_role_id_sort_order_index" ON "accomplishments" USING btree ("candidate_id","role_id","sort_order");--> statement-breakpoint
CREATE INDEX "credentials_candidate_id_index" ON "credentials" USING btree ("candidate_id");--> statement-breakpoint
CREATE INDEX "roles_candidate_id_index" ON "roles" USING btree ("candidate_id");--> statement-breakpoint
CREATE INDEX "skill_sets_candidate_id_sort_order_index" ON "skill_sets" USING btree ("candidate_id","sort_order");--> statement-breakpoint
CREATE INDEX "skills_candidate_id_skill_set_id_sort_order_index" ON "skills" USING btree ("candidate_id","skill_set_id","sort_order");