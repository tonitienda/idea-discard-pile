import { notFound } from "next/navigation";
import { useUser } from "../hooks/use-user";
import { isAdmin } from "../../backend/users";
import { getAdminDashboardInfo } from "../../backend/db";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const user = await useUser();
  if (!isAdmin(user)) {
    notFound();
  }

  const stats = await getAdminDashboardInfo();
  const tiles = [
    ["Users", stats.usersCount],
    ["Ideas", stats.ideasCount],
    ["Flagged ideas", stats.flaggedIdeasCount],
    ["Reactions", stats.reactionsCount],
  ] as const;

  return (
    <>
      <h1>Admin</h1>
      <dl className={styles.tiles}>
        {tiles.map(([label, value]) => (
          <div className={styles.tile} key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
