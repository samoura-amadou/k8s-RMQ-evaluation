create table worked_time (
  id uuid primary key default uuid_generate_v4(),
  info json,
  project uuid references project(id) not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

create trigger worked_time_moddatetime
  before update on worked_time
  for each row
  execute procedure moddatetime (updated_at);
