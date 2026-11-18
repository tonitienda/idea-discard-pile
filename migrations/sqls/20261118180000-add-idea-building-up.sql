-- "I'm building it": the owner says the idea has left the pile.
-- building_since is set when they start (NULL means not being built) and
-- building_url optionally points at a prototype, repo or demo.
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS building_since TIMESTAMP;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS building_url TEXT;

-- People who offered to help hear about it once per idea, however often the
-- owner stops and starts again.
CREATE UNIQUE INDEX IF NOT EXISTS notifications_building_once
  ON notifications (user_id, actor_id, idea_id) WHERE type = 'building';
