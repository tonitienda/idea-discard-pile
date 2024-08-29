import User from "./User";

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <div>
          <a className="navbar-brand" href="/">
            {
              // TODO - Add a Logo
              //<img src="/images/logo.png" alt="logo" width="60" height="60" />
            }
            AIDIA HUB
          </a>
          <a
            href="https://y5mtc76sp1w.typeform.com/to/gqJGirOo"
            target="_blank"
          >
            We ❤️ Feedback
          </a>
        </div>
        <a href="/ideas">My ideas</a>

        <User />
      </div>
    </nav>
  );
}
