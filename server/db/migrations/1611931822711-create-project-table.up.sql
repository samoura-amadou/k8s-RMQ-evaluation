create table project (
  id uuid primary key default uuid_generate_v4(),
  info json,
  owner text not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

create trigger project_moddatetime
  before update on project
  for each row
  execute procedure moddatetime (updated_at);
