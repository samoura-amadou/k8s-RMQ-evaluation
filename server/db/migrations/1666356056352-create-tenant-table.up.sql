create table tenant (
  id uuid primary key default uuid_generate_v4(),
  info json,
  owner uuid not NULL,
  members json,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

create trigger tenant_moddatetime
  before update on tenant
  for each row
  execute procedure moddatetime (updated_at);
