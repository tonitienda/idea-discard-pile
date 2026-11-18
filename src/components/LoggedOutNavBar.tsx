export default function LoggedOutNavBar() {
  return (
    <nav className="navbar navbar-expand-lg bg-light" data-bs-theme="light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Aidia Hub
        </a>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link active" href="/api/auth/login">
            Log in
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link active"
            href="/api/auth/login?screen_hint=signup"
          >
            Sign up
          </a>
        </li>
      </ul>
    </nav>
  );
}
