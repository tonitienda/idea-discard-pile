-- export type Idea = {
-- id: string;
--  title: string;
--  description?: string;
--  discardedReason?: string;
 -- tags: string[];
--  createdAt: string;
--  updatedAt: string;
--  deletedAt?: string;
--  owner: PublicUser;
--- };

CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discarded_reason TEXT,
  tags VARCHAR(255)[] NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP,
  owner_id UUID NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);