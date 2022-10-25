-- Your migration code here.
drop trigger if exists
  project_moddatetime on project;
drop table project;
