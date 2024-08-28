import User from "./User";

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <div>
          <a className="navbar-brand" href="/">
            A Pile of Ideas
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
