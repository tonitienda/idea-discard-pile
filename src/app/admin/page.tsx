import { notFound } from "next/navigation";
import { useUser } from "../hooks/use-user";
import { isAdmin } from "../../backend/users";
import { getAdminDashboardInfo } from "../../backend/db";

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
    <div>
      <h1>Admin</h1>
      <div className="row">
        {tiles.map(([label, value]) => (
          <div className="col-6 col-lg-3 mb-4" key={label}>
            <div className="card">
              <div className="card-body">
                <h6 className="card-subtitle text-muted">{label}</h6>
                <h2 className="card-title mt-2">{value}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
