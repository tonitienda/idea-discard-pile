import { getSession } from "@auth0/nextjs-auth0";
import { useUser } from "../app/hooks/use-user";

export default async function User() {
  const user = await useUser();
  return user ? (
    <div>
      <img
        src={user.picture}
        alt={user.name || user.handle}
        style={{ borderRadius: "50%", width: 25, height: 25 }}
      />
      <span>{user.name || `@${user.handle}`}</span>
      <a href="/api/auth/logout" style={{ marginLeft: 12 }}>
        <span>Logout</span>
      </a>
    </div>
  ) : (
    <a href="/api/auth/login">
      <span>Login</span>
    </a>
  );
}
