-- Your migration code here.
drop trigger if exists
  project_moddatetime on tenant;
drop table tenant;
