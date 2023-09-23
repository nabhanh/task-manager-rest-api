CREATE TABLE IF NOT EXISTS "movie" (
	"movie_id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"language" text NOT NULL,
	"duration" integer NOT NULL,
	"release_date" text NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movie_screening" (
	"movie_id" integer NOT NULL,
	"screen_id" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"custom_repeat" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT movie_screening_movie_id_screen_id PRIMARY KEY("movie_id","screen_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movie_theatre" (
	"movie_id" integer NOT NULL,
	"theatre_id" integer NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "screen" (
	"screen_id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"theatre_id" integer NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "theatre" (
	"theatre_id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"pincode" integer NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"password" text NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "movie_theatre_pk" ON "movie_theatre" ("movie_id","theatre_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "user" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movie_screening" ADD CONSTRAINT "movie_screening_movie_id_movie_movie_id_fk" FOREIGN KEY ("movie_id") REFERENCES "movie"("movie_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movie_screening" ADD CONSTRAINT "movie_screening_screen_id_screen_screen_id_fk" FOREIGN KEY ("screen_id") REFERENCES "screen"("screen_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "screen" ADD CONSTRAINT "screen_theatre_id_theatre_theatre_id_fk" FOREIGN KEY ("theatre_id") REFERENCES "theatre"("theatre_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
