CREATE TABLE IF NOT EXISTS idea_comments (
  id UUID PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id),
  user_id UUID NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idea_comments_idea_idx ON idea_comments (idea_id, created_at);

-- In-app notifications. user_id is the recipient, actor_id who caused it.
-- type is 'comment' (comment_id set) or 'icanhelp'.
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  actor_id UUID NOT NULL REFERENCES users(id),
  idea_id UUID NOT NULL REFERENCES ideas(id),
  type VARCHAR(20) NOT NULL,
  comment_id UUID REFERENCES idea_comments(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS notifications_user_idx ON notifications (user_id, created_at DESC);

-- One "I can help" notification per helper and idea, however often the
-- reaction is toggled.
CREATE UNIQUE INDEX IF NOT EXISTS notifications_icanhelp_once
  ON notifications (user_id, actor_id, idea_id) WHERE type = 'icanhelp';
