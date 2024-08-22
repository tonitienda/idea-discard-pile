import User from "./User";

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          💡➡️🗑️
        </a>
        <User />
      </div>
    </nav>
  );
}
