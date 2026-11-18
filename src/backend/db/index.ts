// DB Client
import { Pool, PoolClient } from "pg";
import { v4 as uuid } from "uuid";
import {
  Idea,
  User,
  AdminDashboard,
  IdeaModeration,
  INTERACTION_LOVE,
  INTERACTION_FUNNY,
  INTERACTION_NOT_USEFUL,
  INTERACTION_SUPPORT,
  Teardown,
  Comment,
  Notification,
} from "../../app/api/model";

const schema = process.env.POSTGRES_SCHEMA || "public";

const rowToIdea = (row: any): Idea => {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    discardedReason: row.discarded_reason ?? undefined,
    teardown: row.teardown ?? undefined,
    commentCount:
      row.comment_count === undefined ? undefined : Number(row.comment_count),
    owner: {
      id: row.owner_id,
      handle: `@${row.handle}`,
      picture: row.picture,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at ?? undefined,
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
  ssl: true,
});

export async function query(query: string, values: any[] = []) {
  return pool.query(query, values);
}

// Runs fn inside a transaction on a single connection.
async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

// Public ideas (not deleted or flagged), newest first, with reaction counts
// and the viewer's own reactions. Pass slug to fetch a single idea.
export async function getIdeas(
  userId?: string,
  slug?: string
): Promise<Idea[]> {
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
          t.content AS teardown,
          (SELECT COUNT(*) FROM ${schema}.idea_comments c
            WHERE c.idea_id = i.id AND c.deleted_at IS NULL) AS comment_count,
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
    LEFT JOIN ${schema}.idea_teardowns t ON i.id = t.idea_id
    WHERE i.deleted_at IS NULL
    AND i.flagged = false
    AND ($2::text IS NULL OR i.slug = $2)
    GROUP BY i.id, u.handle, u.picture, t.content
    ORDER BY i.created_at DESC`,
    [userId || null, slug || null]
  );

  return result.rows.map(rowToIdea);
}

export async function getIdeaBySlug(
  slug: string,
  userId?: string
): Promise<Idea | null> {
  const [idea] = await getIdeas(userId, slug);
  return idea ?? null;
}

// For the sitemap.
export async function getPublicIdeaSlugs(): Promise<
  { slug: string; updatedAt: string }[]
> {
  const result = await query(
    `SELECT slug, updated_at FROM ${schema}.ideas
     WHERE deleted_at IS NULL AND flagged = false
     ORDER BY created_at DESC`
  );
  return result.rows.map((row) => ({
    slug: row.slug,
    updatedAt: row.updated_at,
  }));
}

export async function getIdeasByUserId(userId: string): Promise<Idea[]> {
  const result = await query(
    `SELECT i.*, u.handle, u.picture, t.content AS teardown
      FROM ${schema}.ideas as i INNER JOIN ${schema}.users as u
      ON i.owner_id = u.id
      LEFT JOIN ${schema}.idea_teardowns t ON i.id = t.idea_id
      WHERE i.deleted_at IS NULL
      AND i.owner_id = $1
      ORDER BY i.created_at DESC`,
    [userId]
  );

  return result.rows.map(rowToIdea);
}

export async function getIdeaById(id: string): Promise<Idea | null> {
  const result = await query(
    `SELECT i.*, u.handle, u.picture, t.content AS teardown
    FROM ${schema}.ideas as i
    INNER JOIN ${schema}.users as u
    ON i.owner_id = u.id
    LEFT JOIN ${schema}.idea_teardowns t ON i.id = t.idea_id
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
  const now = new Date().toISOString();

  await withTransaction(async (client) => {
    await client.query(
      `INSERT INTO ${schema}.ideas (id, title, description, discarded_reason, tags, owner_id, flagged, created_at, updated_at, slug) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        idea.id,
        idea.title,
        idea.description,
        idea.discardedReason || null,
        idea.tags,
        idea.owner.id,
        idea.isFlagged,
        now,
        now,
        idea.slug,
      ]
    );

    const pct = (v: number) => Math.round((Number(v) || 0) * 100);

    await client.query(
      `INSERT INTO ${schema}.ideas_moderation (idea_id, idea_probability, spam_probability, spam_explanation, offensive_probability, relevance_probability, sentiment, uniqueness_probability, clarity_probability, cultural_sensitivity, engagement_potential) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        idea.id,
        pct(ideaModeration.ideaProbability),
        pct(ideaModeration.spamProbability),
        ideaModeration.spamExplanation || "",
        pct(ideaModeration.offensiveProbability),
        pct(ideaModeration.relevanceProbability),
        ideaModeration.sentiment || "neutral",
        pct(ideaModeration.uniquenessProbability),
        pct(ideaModeration.clarityProbability),
        pct(ideaModeration.culturalSensitivity),
        pct(ideaModeration.engagementPotential),
      ]
    );
  });
}

export async function updateIdea(
  id: string,
  { title, description }: { title: string; description: string }
): Promise<void> {
  await query(
    `UPDATE ${schema}.ideas SET title = $1, description = $2, updated_at = $3 WHERE id = $4`,
    [title, description, new Date().toISOString(), id]
  );
}

export async function softDeleteIdea(id: string): Promise<void> {
  const now = new Date().toISOString();
  await query(
    `UPDATE ${schema}.ideas SET deleted_at = $1, updated_at = $1 WHERE id = $2`,
    [now, id]
  );
}

export async function saveTeardown(
  ideaId: string,
  teardown: Teardown,
  model: string
): Promise<void> {
  await query(
    `INSERT INTO ${schema}.idea_teardowns (idea_id, content, model) VALUES ($1, $2, $3)
     ON CONFLICT (idea_id) DO NOTHING`,
    [ideaId, JSON.stringify(teardown), model]
  );
}

export async function getUserBySub(sub: string): Promise<User | null> {
  const result = await query(
    `SELECT * FROM ${schema}.users WHERE auth0_sub = $1`,
    [sub]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return rowToUser(result.rows[0]);
}

export async function isHandleTaken(
  handle: string,
  exceptUserId?: string
): Promise<boolean> {
  const result = await query(
    `SELECT 1 FROM ${schema}.users WHERE lower(handle) = lower($1) AND id IS DISTINCT FROM $2`,
    [handle, exceptUserId || null]
  );
  return result.rows.length > 0;
}

export async function createUser(user: User): Promise<void> {
  await query(
    `INSERT INTO ${schema}.users (id, auth0_sub, name, email, handle, picture) VALUES ($1, $2, $3, $4, $5, $6)`,
    [user.id, user.sub, user.name, user.email, user.handle, user.picture]
  );
}

export async function getAdminDashboardInfo(): Promise<AdminDashboard> {
  const result = await query(`SELECT
      (SELECT COUNT(*) FROM ${schema}.users) AS users_count,
      (SELECT COUNT(*) FROM ${schema}.ideas WHERE deleted_at IS NULL) AS ideas_count,
      (SELECT COUNT(*) FROM ${schema}.ideas WHERE deleted_at IS NULL AND flagged) AS flagged_ideas_count,
      (SELECT COUNT(*) FROM ${schema}.idea_reactions) AS reactions_count`);

  const row = result.rows[0];
  return {
    usersCount: Number(row.users_count),
    ideasCount: Number(row.ideas_count),
    flaggedIdeasCount: Number(row.flagged_ideas_count),
    reactionsCount: Number(row.reactions_count),
  };
}

export async function createIdeaReaction(
  ideaId: string,
  userId: string,
  reaction: string
): Promise<void> {
  await query(
    `INSERT INTO ${schema}.idea_reactions (idea_id, user_id, reaction) VALUES ($1, $2, $3)
     ON CONFLICT (idea_id, user_id, reaction) DO NOTHING`,
    [ideaId, userId, reaction]
  );
}

export async function deleteIdeaReaction(
  ideaId: string,
  userId: string,
  reaction: string
): Promise<void> {
  await query(
    `DELETE FROM ${schema}.idea_reactions WHERE idea_id=$1 AND user_id=$2 AND reaction=$3`,
    [ideaId, userId, reaction]
  );
}

export async function updateUserProfile(
  id: string,
  { name, handle, picture }: { name: string; handle: string; picture: string }
): Promise<User> {
  const result = await query(
    `UPDATE ${schema}.users SET name=$1, handle = $2, picture = $3, updated_at = $4 WHERE id = $5 RETURNING *`,
    [name, handle, picture, new Date().toISOString(), id]
  );
  return rowToUser(result.rows[0]);
}

export async function countIdeasByUserIdSince(
  userId: string,
  since: Date
): Promise<number> {
  const result = await query(
    `SELECT COUNT(*) FROM ${schema}.ideas WHERE owner_id = $1 AND created_at > $2`,
    [userId, since.toISOString()]
  );
  return Number(result.rows[0].count);
}

// ---- Comments ----

const rowToComment = (row: any): Comment => ({
  id: row.id,
  ideaId: row.idea_id,
  body: row.body,
  createdAt: row.created_at,
  author: {
    id: row.user_id,
    handle: `@${row.handle}`,
    picture: row.picture,
  },
});

export async function getComments(ideaId: string): Promise<Comment[]> {
  const result = await query(
    `SELECT c.*, u.handle, u.picture
     FROM ${schema}.idea_comments c
     INNER JOIN ${schema}.users u ON u.id = c.user_id
     WHERE c.idea_id = $1 AND c.deleted_at IS NULL
     ORDER BY c.created_at ASC`,
    [ideaId]
  );
  return result.rows.map(rowToComment);
}

export async function getCommentById(
  id: string
): Promise<(Comment & { deletedAt?: string }) | null> {
  const result = await query(
    `SELECT c.*, u.handle, u.picture
     FROM ${schema}.idea_comments c
     INNER JOIN ${schema}.users u ON u.id = c.user_id
     WHERE c.id = $1`,
    [id]
  );
  const row = result.rows[0];
  return row ? { ...rowToComment(row), deletedAt: row.deleted_at ?? undefined } : null;
}

// Saves the comment and, unless owners comment on their own idea, notifies
// the idea owner.
export async function createComment(
  comment: { id: string; ideaId: string; userId: string; body: string },
  ideaOwnerId: string
): Promise<void> {
  await withTransaction(async (client) => {
    await client.query(
      `INSERT INTO ${schema}.idea_comments (id, idea_id, user_id, body) VALUES ($1, $2, $3, $4)`,
      [comment.id, comment.ideaId, comment.userId, comment.body]
    );
    if (ideaOwnerId !== comment.userId) {
      await client.query(
        `INSERT INTO ${schema}.notifications (id, user_id, actor_id, idea_id, type, comment_id)
         VALUES ($1, $2, $3, $4, 'comment', $5)`,
        [uuid(), ideaOwnerId, comment.userId, comment.ideaId, comment.id]
      );
    }
  });
}

export async function softDeleteComment(id: string): Promise<void> {
  await query(
    `UPDATE ${schema}.idea_comments SET deleted_at = $1 WHERE id = $2`,
    [new Date().toISOString(), id]
  );
}

export async function countCommentsByUserIdSince(
  userId: string,
  since: Date
): Promise<number> {
  const result = await query(
    `SELECT COUNT(*) FROM ${schema}.idea_comments WHERE user_id = $1 AND created_at > $2`,
    [userId, since.toISOString()]
  );
  return Number(result.rows[0].count);
}

// People who reacted "I can help" to an idea, earliest first.
export async function getHelpers(ideaId: string) {
  const result = await query(
    `SELECT u.id, u.handle, u.picture
     FROM ${schema}.idea_reactions r
     INNER JOIN ${schema}.users u ON u.id = r.user_id
     WHERE r.idea_id = $1 AND r.reaction = 'icanhelp'
     ORDER BY r.created_at ASC`,
    [ideaId]
  );
  return result.rows.map((row) => ({
    id: row.id,
    handle: `@${row.handle}`,
    picture: row.picture,
  }));
}

// ---- Notifications ----

// Once per helper and idea, however often the reaction is toggled.
export async function notifyHelpOffered(
  ideaOwnerId: string,
  helperId: string,
  ideaId: string
): Promise<void> {
  if (ideaOwnerId === helperId) {
    return;
  }
  await query(
    `INSERT INTO ${schema}.notifications (id, user_id, actor_id, idea_id, type)
     VALUES ($1, $2, $3, $4, 'icanhelp')
     ON CONFLICT (user_id, actor_id, idea_id) WHERE type = 'icanhelp' DO NOTHING`,
    [uuid(), ideaOwnerId, helperId, ideaId]
  );
}

export async function getNotifications(
  userId: string,
  limit = 30
): Promise<{ items: Notification[]; unreadCount: number }> {
  const [items, unread] = await Promise.all([
    query(
      `SELECT n.id, n.type, n.created_at, n.read_at,
         a.id AS actor_id, a.handle, a.picture,
         i.id AS idea_id, i.slug, i.title,
         CASE WHEN c.deleted_at IS NULL THEN left(c.body, 140) END AS excerpt
       FROM ${schema}.notifications n
       INNER JOIN ${schema}.users a ON a.id = n.actor_id
       INNER JOIN ${schema}.ideas i ON i.id = n.idea_id
       LEFT JOIN ${schema}.idea_comments c ON c.id = n.comment_id
       WHERE n.user_id = $1 AND i.deleted_at IS NULL
       ORDER BY n.created_at DESC
       LIMIT $2`,
      [userId, limit]
    ),
    query(
      `SELECT COUNT(*) FROM ${schema}.notifications n
       INNER JOIN ${schema}.ideas i ON i.id = n.idea_id
       WHERE n.user_id = $1 AND n.read_at IS NULL AND i.deleted_at IS NULL`,
      [userId]
    ),
  ]);

  return {
    items: items.rows.map((row) => ({
      id: row.id,
      type: row.type,
      createdAt: row.created_at,
      read: !!row.read_at,
      actor: {
        id: row.actor_id,
        handle: `@${row.handle}`,
        picture: row.picture,
      },
      idea: { id: row.idea_id, slug: row.slug, title: row.title },
      excerpt: row.excerpt ?? undefined,
    })),
    unreadCount: Number(unread.rows[0].count),
  };
}

export async function markNotificationsRead(userId: string): Promise<void> {
  await query(
    `UPDATE ${schema}.notifications SET read_at = $1 WHERE user_id = $2 AND read_at IS NULL`,
    [new Date().toISOString(), userId]
  );
}
