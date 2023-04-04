DROP TABLE IF EXISTS public.nginx;

CREATE TABLE public.nginx (
	id serial4 NOT NULL,
	source_ip varchar NULL,
	"method" varchar NULL,
	status_code varchar NULL,
	"path" varchar NULL,
	"timestamp" timestamptz NULL,
	CONSTRAINT nginx_pk PRIMARY KEY (id)
);