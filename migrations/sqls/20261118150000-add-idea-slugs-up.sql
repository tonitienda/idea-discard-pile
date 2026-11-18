-- Public URLs: /ideas/<title-words>-<first 8 chars of the id>.
-- The slug is fixed at creation so links keep working if the title changes.
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS slug VARCHAR(80);

UPDATE ideas
SET slug = concat_ws(
  '-',
  NULLIF(
    trim(both '-' from left(
      trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g')),
      60
    )),
    ''
  ),
  left(id::text, 8)
)
WHERE slug IS NULL;

ALTER TABLE ideas ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ideas_slug_key ON ideas (slug);
