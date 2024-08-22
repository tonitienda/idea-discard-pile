import { getSession } from "@auth0/nextjs-auth0";

export default async function User() {
  const session = await getSession();
  const user = session ? session.user : null;
  return user ? (
    <div>
      <img
        src={user.picture}
        alt={user.name}
        style={{ borderRadius: "50%", width: 25, height: 25 }}
      />
      <span>{user.name}</span>
      <a href="/api/auth/logout" style={{ marginLeft: 12 }}>
        <span>Logout</span>
      </a>
      {
        // show a drop down with some options like profile setting, logout, etc
      }
    </div>
  ) : (
    <a href="/api/auth/login">
      <span>Login</span>
    </a>
  );
}
