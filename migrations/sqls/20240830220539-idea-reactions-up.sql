CREATE TYPE reaction_type AS ENUM (
    'iloveit',
    'icanhelp',
    'notuseful',
    'funny'
);


CREATE TABLE idea_reactions (
    id SERIAL PRIMARY KEY,
    idea_id UUID REFERENCES ideas(id),
    user_id UUID REFERENCES users(id),
    reaction reaction_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE idea_reactions
  ADD CONSTRAINT idea_reactions_unique_idea_id_user_id_reaction_type UNIQUE (idea_id, user_id, reaction);


DROP TABLE idea_interactions;