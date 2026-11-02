import { Link } from "react-router-dom";

function Footer({ variant = "public" }) {
  const isAdmin = variant === "admin";

  return (
    <footer
      className={`site-footer${isAdmin ? " site-footer-admin" : ""}`}
      id={isAdmin ? undefined : "contact"}
    >
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <Link to="/" aria-label="YatraPulse home">
            <img src="/YatraPulse_logo_transparent(1).png" alt="YatraPulse" />
          </Link>
          <p>Travel, thoughtfully.</p>
        </div>

        <nav aria-label={isAdmin ? "Admin footer navigation" : "Footer navigation"}>
          <Link to="/">Home</Link>
          <Link to="/tours">Explore tours</Link>
          {isAdmin ? (
            <Link to="/admin/dashboard">Admin workspace</Link>
          ) : (
            <Link to="/login">Admin access</Link>
          )}
        </nav>
      </div>

      <div className="site-footer-bottom">
        <span>&copy; {new Date().getFullYear()} YatraPulse</span>
        <span>Curated journeys. Lasting memories.</span>
      </div>
    </footer>
  );
}

export default Footer;
