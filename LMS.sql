CREATE SEQUENCE SEQ_USER_ID start 1;
CREATE SEQUENCE SEQ_CLASS_ID start 1;
CREATE SEQUENCE SEQ_CLASS_CATEGORY_ID start 1;
CREATE SEQUENCE SEQ_ENROLMENT_USER_ID start 1;

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

COMMENT ON COLUMN "class_category"."description" IS 'Class Category Description';

ALTER TABLE "class" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "class" ADD FOREIGN KEY ("category_id") REFERENCES "class_category" ("id");
