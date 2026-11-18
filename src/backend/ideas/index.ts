// Public URL slug: title words plus the first 8 chars of the id, e.g.
// "home-gardening-robot-3f2a9c1d". Matches the backfill in the
// add-idea-slugs migration, except that accented letters become plain
// letters here instead of being dropped.
export const toSlug = (title: string, id: string): string => {
  const words = title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");

  return [words, id.slice(0, 8)].filter(Boolean).join("-");
};
