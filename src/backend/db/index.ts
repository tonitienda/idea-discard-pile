// DB Client
import { Client, Pool } from "pg";
import { Idea, User } from "../../app/api/model";

const schema = process.env.POSTGRES_SCHEMA || "public";

const rowToIdea = (row: any): Idea => {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    owner: {
      id: row.owner_id,
      handle: row.handle,
      picture: row.picture,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    tags: row.tags,
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

export async function getIdeas(): Promise<Idea[]> {
  const result = await query(
    `SELECT i.*, u.handle, u.picture
    FROM ${schema}.ideas as i INNER JOIN ${schema}.users as u 
    ON i.owner_id = u.id 
    WHERE i.deleted_at IS NULL`
  );

  return result.rows.map(rowToIdea);
}

export async function getIdeaById(id: string): Promise<Idea> {
  const result = await query(
    `SELECT i.*, u.handle, u.picture 
    FROM ${schema}.ideas as i INNER JOIN ${schema}.users as u
    ON i.owner_id = u.id
    WHERE i.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return rowToIdea(result.rows[0]);
}

export async function createIdea(idea: Idea): Promise<Idea> {
  console.log("Creating idea", idea);
  return query(
    `INSERT INTO ${schema}.ideas (id, title, description, tags, owner_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      idea.id,
      idea.title,
      idea.description,
      idea.tags,
      idea.owner.id,
      new Date().toISOString(),
      new Date().toISOString(),
    ]
  );
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
