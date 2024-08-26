// DB Client
import { Client, Pool } from "pg";
import { Idea, User } from "../../app/api/model";

const schema = process.env.POSTGRES_SCHEMA || "public";

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
    `SELECT * FROM ${schema}.ideas WHERE deleted_at IS NULL`
  );

  const ideas: Idea[] = result.rows.map((row: any) => {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      owner: row.owner,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  });

  return ideas;
}

export async function getIdeaById(id: string): Promise<Idea> {
  return query(`SELECT * FROM ${schema}.ideas WHERE id = $1`, [id]);
}

export async function createIdea(idea: Idea): Promise<Idea> {
  return query(
    `INSERT INTO ${schema}.ideas (title, description, owner, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [idea.title, idea.description, idea.owner, idea.createdAt, idea.updatedAt]
  );
}

export async function updateIdea(idea: Idea): Promise<Idea> {
  return query(
    `UPDATE ${schema}.ideas SET title = $1, description = $2, owner = $3, updated_at = $4 WHERE id = $5 RETURNING *`,
    [idea.title, idea.description, idea.owner, idea.updatedAt, idea.id]
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

  return {
    id: result.rows[0].id,
    sub: result.rows[0].auth0_sub,
    name: result.rows[0].name,
    email: result.rows[0].email,
    handle: result.rows[0].handle,
    picture: result.rows[0].picture,
  };
}

export async function createUser(user: User): Promise<User> {
  console.log("Creating user", user);
  return query(
    `INSERT INTO ${schema}.users (id, auth0_sub, name, email, handle, picture) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [user.id, user.sub, user.name, user.email, user.handle, user.picture]
  );
}
