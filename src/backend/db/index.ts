// DB Client
import { Client, Pool } from "pg";
import {
  Idea,
  User,
  AdminDashboard,
  IdeaModeration,
  INTERACTION_LOVE,
  INTERACTION_FUNNY,
  INTERACTION_NOT_USEFUL,
  INTERACTION_SUPPORT,
} from "../../app/api/model";

const schema = process.env.POSTGRES_SCHEMA || "public";

const rowToIdea = (row: any): Idea => {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    owner: {
      id: row.owner_id,
      handle: `@${row.handle}`,
      picture: row.picture,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    tags: row.tags,
    isFlagged: row.flagged,
    reactions: {
      [INTERACTION_LOVE]: 0,
      [INTERACTION_FUNNY]: 0,
      [INTERACTION_NOT_USEFUL]: 0,
      [INTERACTION_SUPPORT]: 0,
      ...row.reactions,
    },
    myReactions: {
      [INTERACTION_LOVE]: false,
      [INTERACTION_FUNNY]: false,
      [INTERACTION_NOT_USEFUL]: false,
      [INTERACTION_SUPPORT]: false,
      ...row.my_reactions,
    },
    isExample: false,
  };
};

const rowToUser = (row: any): User => {
  return {
    id: row.id,
    sub: row.auth0_sub,
    name: row.name,
    email: row.email,
    handle: row.handle,
    picture: row.picture,
  };
};

// Create a pool of connections
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  schema: process.env.POSTGRES_SCHEMA,
  ssl: true,
});

export async function connect(): Promise<Client> {
  return pool.connect();
}

export async function query(query: string, values: any[] = []) {
  const client = await connect();
  try {
    return await client.query(query, values);
  } finally {
    client.release();
  }
}

export async function getIdeas(userId?: string): Promise<Idea[]> {
  const result = await query(
    `WITH my_reactions AS (
    SELECT
        idea_id,
        reaction
    FROM
        ${schema}.idea_reactions
    WHERE
        user_id = $1
    ),
    reaction_counts AS (
    SELECT
        idea_id,
        reaction,
        COUNT(*) AS reaction_count
    FROM
        ${schema}.idea_reactions
    GROUP BY
        idea_id, reaction
)
        SELECT 
          i.*, 
          u.handle, 
          u.picture, 
          COALESCE(
        jsonb_object_agg(
            rc.reaction, 
            rc.reaction_count
        ) FILTER (WHERE rc.reaction IS NOT NULL), 
        '{}'::jsonb) AS reactions,
         COALESCE(
        jsonb_object_agg(
            mrc.reaction, TRUE
        ) FILTER (WHERE mrc.reaction IS NOT NULL), 
        '{}'::jsonb) AS my_reactions
    FROM ${schema}.ideas as i 
    INNER JOIN ${schema}.users as u 
      ON i.owner_id = u.id 
    LEFT JOIN 
    reaction_counts rc ON i.id = rc.idea_id
    LEFT JOIN 
    my_reactions mrc ON i.id = mrc.idea_id
    WHERE i.deleted_at IS NULL
    AND i.flagged = false
    GROUP BY i.id, u.handle, u.picture
    ORDER BY i.created_at DESC`,
    [userId || null]
  );

  return result.rows.map(rowToIdea);
}

export async function getIdeasByUserId(userId: string): Promise<Idea[]> {
  console.log("Looking for ideas by user", userId);
  const result = await query(
    `SELECT i.*, u.handle, u.picture
      FROM ${schema}.ideas as i INNER JOIN ${schema}.users as u 
      ON i.owner_id = u.id 
      WHERE i.deleted_at IS NULL
      AND i.owner_id = $1
      ORDER BY i.created_at DESC`,
    [userId]
  );

  return result.rows.map(rowToIdea);
}

export async function getIdeaById(id: string): Promise<Idea> {
  const result = await query(
    `SELECT i.*, u.handle, u.picture 
    FROM ${schema}.ideas as i 
    INNER JOIN ${schema}.users as u
    ON i.owner_id = u.id
    WHERE i.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return rowToIdea(result.rows[0]);
}

export async function createIdea(
  idea: Idea,
  ideaModeration: IdeaModeration
): Promise<void> {
  console.log("Creating idea", idea, ideaModeration);
  // Start a transaction and insert both idea and idea moderation in the same transaction

  try {
    await query("BEGIN");

    await query(
      `INSERT INTO ${schema}.ideas (id, title, description, tags, owner_id, flagged, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        idea.id,
        idea.title,
        idea.description,
        idea.tags,
        idea.owner.id,
        idea.isFlagged,
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    );

    await query(
      `INSERT INTO ${schema}.ideas_moderation (idea_id, idea_probability, spam_probability, spam_explanation, offensive_probability, relevance_probability, sentiment, uniqueness_probability, clarity_probability, cultural_sensitivity, engagement_potential) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        idea.id,
        ideaModeration.ideaProbability * 100,
        ideaModeration.spamProbability * 100,
        ideaModeration.spamExplanation || "",
        ideaModeration.offensiveProbability * 100,
        ideaModeration.relevanceProbability * 100,
        ideaModeration.sentiment || "neutral",
        ideaModeration.uniquenessProbability * 100,
        ideaModeration.clarityProbability * 100,
        ideaModeration.culturalSensitivity * 100,
        ideaModeration.engagementPotential * 100,
      ]
    );

    await query("COMMIT");
  } catch (e) {
    await query("ROLLBACK");
    throw e;
  }
}

export async function updateIdea(idea: Idea): Promise<Idea> {
  return query(
    `UPDATE ${schema}.ideas SET title = $1, description = $2, updated_at = $4 WHERE id = $5 RETURNING *`,
    [idea.title, idea.description, new Date().toISOString(), idea.id]
  );
}

export async function getUserBySub(sub: string): Promise<User> {
  console.log("Getting user by sub", sub);
  const result = await query(
    `SELECT * FROM ${schema}.users WHERE auth0_sub = $1`,
    [sub]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return rowToUser(result.rows[0]);
}

export async function createUser(user: User): Promise<User> {
  console.log("Creating user", user);
  return query(
    `INSERT INTO ${schema}.users (id, auth0_sub, name, email, handle, picture) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [user.id, user.sub, user.name, user.email, user.handle, user.picture]
  );
}

export async function getAdminDashboardInfo(): Promise<AdminDashboard> {
  const ideasCount = await query(`SELECT COUNT(*) FROM ${schema}.ideas`);
  const usersCount = await query(`SELECT COUNT(*) FROM ${schema}.users`);

  return {
    ideasCount: ideasCount.rows[0].count,
    usersCount: usersCount.rows[0].count,
  };
}

// TODO - Also insert events, so we keep track of the changes
export async function createIdeaReaction(
  ideaId: string,
  userId: string,
  reaction: string
): Promise<void> {
  console.log("Inserting idea reaction", ideaId, reaction, userId);
  await query(
    `INSERT INTO ${schema}.idea_reactions (idea_id, user_id, reaction) VALUES ($1, $2, $3)`,
    [ideaId, userId, reaction]
  );
}

// TODO - Also insert events, so we keep track of the changes
export async function deleteIdeaReaction(
  ideaId: string,
  userId: string,
  reaction: string
): Promise<void> {
  console.log("Deleting idea reaction", ideaId, reaction, userId);
  await query(
    `DELETE FROM ${schema}.idea_reactions WHERE idea_id=$1 AND user_id=$2 AND reaction=$3`,
    [ideaId, userId, reaction]
  );
}
