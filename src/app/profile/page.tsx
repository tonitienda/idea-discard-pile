import { ProfileForm } from "./ProfileForm";
import { useUser } from "../hooks/use-user";

export default async function Profile() {
  const user = await useUser();

  return user ? (
    <ProfileForm user={user} />
  ) : (
    <p>
      <a href="/api/auth/login?returnTo=%2Fprofile">Log in</a> to edit your
      profile.
    </p>
  );
}
