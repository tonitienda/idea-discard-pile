export default function NavBar() {
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
            login
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link active" href="/api/auth/login">
            sign_up
          </a>
        </li>
      </ul>
    </nav>
  );
}
