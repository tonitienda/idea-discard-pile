// Generates teardowns for public ideas that don't have one yet.
// By default only IdeaBot's example ideas; pass --all for every idea.
//
//   npx tsx --env-file=.env.local scripts/generate-teardowns.ts [--all]
//
// Writes to the schema in POSTGRES_SCHEMA and calls OpenAI once per idea.
import { query, saveTeardown } from "../src/backend/db";
import { generateTeardown } from "../src/backend/ai/teardown";

const IDEABOT_ID = "a1d1ab07-0000-4000-8000-000000000001";
const schema = process.env.POSTGRES_SCHEMA || "public";
const all = process.argv.includes("--all");

async function main() {
  const { rows } = await query(
    `SELECT i.id, i.title, i.description, i.discarded_reason
     FROM ${schema}.ideas i
     LEFT JOIN ${schema}.idea_teardowns t ON t.idea_id = i.id
     WHERE t.idea_id IS NULL AND i.deleted_at IS NULL AND NOT i.flagged
     AND ($1::boolean OR i.owner_id = $2)
     ORDER BY i.created_at DESC`,
    [all, IDEABOT_ID]
  );

  console.log(`${rows.length} ideas without a teardown in "${schema}"`);

  for (const row of rows) {
    const result = await generateTeardown(
      {
        description: `${row.title}\n\n${row.description}`,
        discardedReason: row.discarded_reason || undefined,
      },
      "teardown-backfill"
    );
    if (!result) {
      console.log(`  failed: ${row.title}`);
      continue;
    }
    await saveTeardown(row.id, result.teardown, result.model);
    console.log(`  ${result.teardown.verdict.padEnd(14)} ${row.title}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
