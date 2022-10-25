create table user_info (
  id text primary key,
  info json,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

create trigger user_info_moddatetime
  before update on user_info
  for each row
  execute procedure moddatetime (updated_at);
