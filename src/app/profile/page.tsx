import { ProfileForm } from "./ProfileForm";
import { useUser } from "../hooks/use-user";

export default async function Profile() {
  const user = await useUser();

  return user ? (
    <div>
      <ProfileForm user={user} />
    </div>
  ) : (
    <a href="/api/auth/login">
      <span>Login</span>
    </a>
  );
}
