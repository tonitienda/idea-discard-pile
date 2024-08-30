CREATE TYPE interaction_type AS ENUM (
    'iloveit',
    'icanhelp',
    'notuseful',
    'funny'
);

CREATE TABLE idea_interactions (
    id SERIAL PRIMARY KEY,
    idea_id UUID REFERENCES ideas(id),
    user_id UUID REFERENCES users(id),
    interaction_type interaction_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE idea_events (
    id SERIAL PRIMARY KEY,
    idea_id UUID REFERENCES ideas(id),
    user_id UUID REFERENCES users(id),
    event_type TEXT NOT NULL,
    event_body JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ON idea_interactions (idea_id);
CREATE INDEX ON idea_interactions (user_id);
CREATE INDEX ON idea_events (idea_id);
CREATE INDEX ON idea_events (user_id);


