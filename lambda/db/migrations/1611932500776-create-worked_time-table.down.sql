-- Your migration code here.
drop trigger if exists
  worked_time_moddatetime on worked_time;
drop table worked_time;
