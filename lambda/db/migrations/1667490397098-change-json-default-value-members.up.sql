ALTER TABLE project ALTER COLUMN members SET DEFAULT to_json('[]'::text);
ALTER TABLE tenant ALTER COLUMN members SET DEFAULT to_json('[]'::text);
