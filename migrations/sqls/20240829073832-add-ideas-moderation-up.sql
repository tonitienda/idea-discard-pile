
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS "flagged" BOOLEAN DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS ideas_moderation (
  idea_id UUID NOT NULL PRIMARY KEY,
  idea_probability smallint NOT NULL,
  spam_probability smallint NOT NULL,
  spam_explanation TEXT NOT NULL,
  offensive_probability smallint NOT NULL,
  relevance_probability smallint NOT NULL,
  sentiment TEXT NOT NULL,
  uniqueness_probability smallint NOT NULL,
  clarity_probability smallint NOT NULL,
  cultural_sensitivity smallint NOT NULL,
  engagement_potential smallint NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idea_id) REFERENCES ideas(id)
);