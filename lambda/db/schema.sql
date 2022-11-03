CREATE TABLE public.__caravel_migrations (
    version text NOT NULL,
    hash text NOT NULL
);
CREATE TABLE public.project (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    info json,
    owner text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    members json DEFAULT to_json('[]'::text)
);
CREATE TABLE public.tenant (
    id text DEFAULT public.uuid_generate_v4() NOT NULL,
    info json,
    owner text NOT NULL,
    members json DEFAULT to_json('[]'::text),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE public.user_info (
    id text NOT NULL,
    info json,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE public.worked_time (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    info json,
    project uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    owner text NOT NULL
);
ALTER TABLE ONLY public.__caravel_migrations
    ADD CONSTRAINT __caravel_migrations_pkey PRIMARY KEY (version);
ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.tenant
    ADD CONSTRAINT tenant_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.worked_time
    ADD CONSTRAINT worked_time_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.worked_time
    ADD CONSTRAINT worked_time_project_fkey FOREIGN KEY (project) REFERENCES public.project(id);
