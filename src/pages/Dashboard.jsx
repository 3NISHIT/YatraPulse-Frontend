import { useState } from "react";
import { Link } from "react-router-dom";
import EntityForm from "../components/EntityForm";
import Footer from "../components/Footer";

const sections = [
  {
    id: "booking",
    label: "Bookings",
    icon: "BK",
    description: "Reservations and guest details",
  },
  {
    id: "itinerary",
    label: "Itineraries",
    icon: "IT",
    description: "Day-by-day tour plans",
  },
  {
    id: "tour",
    label: "Tours",
    icon: "TR",
    description: "Experiences and pricing",
  },
  {
    id: "destination",
    label: "Destinations",
    icon: "DS",
    description: "Places in your collection",
  },
];

function Dashboard() {
  const [activeSection, setActiveSection] = useState("booking");
  const active = sections.find((section) => section.id === activeSection);

  return (
    <div className="admin-shell">
      <nav id="sidebar" aria-label="Admin navigation">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="brand-logo">
              <img src="/YatraPulse_logo_transparent.png" alt="Yatra Pulse" />
            </span>
          </div>
        </div>

        <div className="sidebar-section-label">WORKSPACE</div>
        <ul className="components">
          {sections.map((section) => (
            <li
              className={activeSection === section.id ? "active" : ""}
              key={section.id}
            >
              <button
                className="booking-nav-toggle"
                type="button"
                onClick={() => setActiveSection(section.id)}
                aria-current={activeSection === section.id ? "page" : undefined}
              >
                <span className="nav-icon" aria-hidden="true">
                  {section.icon}
                </span>
                <span>{section.label}</span>
                <span className="nav-chevron" aria-hidden="true">
                  ›
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <div className="profile-card">
            <span className="profile-avatar">NP</span>
            <span className="profile-copy">
              <strong>Nishit Pandya</strong>
              <small>
                <span className="online-dot" /> Online Admin
              </small>
            </span>
            <span className="profile-menu" aria-hidden="true">
              ···
            </span>
          </div>
        </div>
      </nav>

      <main className="admin-main">
        <header className="admin-header">
          <strong className="dashboard-header-brand">YatraPulse Admin</strong>
          <Link to="/" className="dashboard-home-link">
            Home
          </Link>
        </header>

        <section className="admin-content">
          <div className="page-intro">
            <div>
              <p className="page-kicker">
                TRAVEL OPERATIONS <span>/</span> {active.label.toUpperCase()}
              </p>
              <h1>{active.label}</h1>
              <p className="page-subtitle">{active.description}</p>
            </div>
            <div className="date-stamp">
              <span>
                {new Intl.DateTimeFormat("en", { weekday: "long" })
                  .format(new Date())
                  .toUpperCase()}
              </span>
              <strong>
                {new Intl.DateTimeFormat("en", { day: "2-digit" }).format(
                  new Date(),
                )}{" "}
                <small>
                  {new Intl.DateTimeFormat("en", { month: "short" })
                    .format(new Date())
                    .toUpperCase()}
                </small>
              </strong>
            </div>
          </div>

          <EntityForm key={activeSection} entity={activeSection} />
        </section>
        <Footer variant="admin" />
      </main>
    </div>
  );
}

export default Dashboard;
