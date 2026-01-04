CREATE TABLE "candidates" (
	"candidate_id" uuid PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"middle_name" text NOT NULL,
	"last_name" text NOT NULL,
	"who" text NOT NULL,
	"email" text NOT NULL,
	"phone_country_code" integer NOT NULL,
	"phone_number" bigint NOT NULL,
	"website" text NOT NULL,
	"linkedin" text NOT NULL,
	"github" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
