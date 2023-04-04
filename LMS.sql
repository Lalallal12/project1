-- 모든 테이블 생성 DDL
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
  "code_group" varchar,
  "code" varchar,
  "name" varchar,
  "reg_date" timestamp,
  "mod_date" timestamp,
  PRIMARY KEY ("code_group", "code")
);

COMMENT ON COLUMN "class_category"."description" IS 'Class Category Description';

ALTER TABLE "class" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "class" ADD FOREIGN KEY ("category_id") REFERENCES "class_category" ("id");

-- 테이블 데이터 삽입 DML
-- 1. class_category 테이블
INSERT INTO public.class_category
(id, "name", description, reg_date, mod_date)
VALUES(1, '컴퓨터공학', '', now(), now()),
(2, '영어학', '',  now(), now()),
(3, '경제학', '',  now(), now()),
(4, '경영학', '',  now(), now()),
(5, '법학', '',  now(), now());

-- 2. user 테이블
insert into public.user 
(id,name,type,email,reg_date,mod_date) 
values('1','오태경','PROFESSOR','AA@aaa.com',now(),now()),
('2','박찬규','PROFESSOR','bb@aaa.com',now(),now()),
('3','오로라','STUDENT','cc@aaa.com',now(),now()),
('4','곽원미','STUDENT','dd@aaa.com',now(),now());








-- 5. code 테이블
insert 
  into code
     ( code_group
     , code
     , name
     , reg_date
     , mod_date)
values (
       'USER_TYPE'
     , 'PROFESSOR'
     , '강사'
     , now()
     , now()
);
