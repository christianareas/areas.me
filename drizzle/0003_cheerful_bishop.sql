ALTER TABLE "credentials" ALTER COLUMN "start_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "credentials" ALTER COLUMN "start_date" TYPE date USING (
	CASE
		WHEN "start_date" IS NULL OR "start_date" = '' THEN NULL
		WHEN "start_date" ~ '^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$' THEN make_date(
			split_part("start_date", '-', 1)::int,
			split_part("start_date", '-', 2)::int,
			split_part("start_date", '-', 3)::int
		)
		WHEN "start_date" ~ '^[0-9]{4}-[0-9]{1,2}$' THEN make_date(
			split_part("start_date", '-', 1)::int,
			split_part("start_date", '-', 2)::int,
			1
		)
		ELSE NULL
	END
);--> statement-breakpoint
ALTER TABLE "credentials" ALTER COLUMN "end_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "credentials" ALTER COLUMN "end_date" TYPE date USING (
	CASE
		WHEN "end_date" IS NULL OR "end_date" = '' THEN NULL
		WHEN "end_date" ~ '^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$' THEN make_date(
			split_part("end_date", '-', 1)::int,
			split_part("end_date", '-', 2)::int,
			split_part("end_date", '-', 3)::int
		)
		WHEN "end_date" ~ '^[0-9]{4}-[0-9]{1,2}$' THEN make_date(
			split_part("end_date", '-', 1)::int,
			split_part("end_date", '-', 2)::int,
			1
		)
		ELSE NULL
	END
);--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "end_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "end_date" TYPE date USING (
	CASE
		WHEN "end_date" IS NULL OR "end_date" = '' THEN NULL
		WHEN "end_date" ~ '^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$' THEN make_date(
			split_part("end_date", '-', 1)::int,
			split_part("end_date", '-', 2)::int,
			split_part("end_date", '-', 3)::int
		)
		WHEN "end_date" ~ '^[0-9]{4}-[0-9]{1,2}$' THEN make_date(
			split_part("end_date", '-', 1)::int,
			split_part("end_date", '-', 2)::int,
			1
		)
		ELSE NULL
	END
);--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "start_date" TYPE date USING (
	CASE
		WHEN "start_date" IS NULL OR "start_date" = '' THEN NULL
		WHEN "start_date" ~ '^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$' THEN make_date(
			split_part("start_date", '-', 1)::int,
			split_part("start_date", '-', 2)::int,
			split_part("start_date", '-', 3)::int
		)
		WHEN "start_date" ~ '^[0-9]{4}-[0-9]{1,2}$' THEN make_date(
			split_part("start_date", '-', 1)::int,
			split_part("start_date", '-', 2)::int,
			1
		)
		ELSE NULL
	END
);
