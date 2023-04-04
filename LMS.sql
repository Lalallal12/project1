CREATE TABLE "user" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "type" varchar,
  "email" varchar,
  "reg_date" timestamp,
  "mod_date" timestamp
);

CREATE TABLE "class" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "user_id" integer,
  "category_id" integer,
  "reg_date" timestamp,
  "mod_date" timestamp
);

CREATE TABLE "class_category" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "description" text,
  "reg_date" timestamp,
  "mod_date" timestamp
);

CREATE TABLE "enrolment" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "class_id" integer,
  "status" varchar,
  "reg_date" timestamp,
  "mod_date" timestamp
);

CREATE TABLE "code" (
  "group" varchar,
  "code" varchar,
  "name" varchar,
  "reg_date" timestamp,
  "mod_date" timestamp,
  PRIMARY KEY ("group", "code")
);

COMMENT ON COLUMN "class_category"."description" IS 'Content of the post';

ALTER TABLE "class" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "class" ADD FOREIGN KEY ("category_id") REFERENCES "class_category" ("id");

CREATE TABLE "enrolment_class" (
  "enrolment_class_id" integer,
  "class_id" integer,
  PRIMARY KEY ("enrolment_class_id", "class_id")
);

ALTER TABLE "enrolment_class" ADD FOREIGN KEY ("enrolment_class_id") REFERENCES "enrolment" ("class_id");

ALTER TABLE "enrolment_class" ADD FOREIGN KEY ("class_id") REFERENCES "class" ("id");


CREATE TABLE "enrolment_user" (
  "enrolment_user_id" integer,
  "user_id" integer,
  PRIMARY KEY ("enrolment_user_id", "user_id")
);

ALTER TABLE "enrolment_user" ADD FOREIGN KEY ("enrolment_user_id") REFERENCES "enrolment" ("user_id");

ALTER TABLE "enrolment_user" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

