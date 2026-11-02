import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const menuPanelRef = useRef(null);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = menuPanelRef.current?.querySelectorAll(
        'a[href], button:not([disabled])',
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <>
      <header className="site-header">
        <Link to="/" className="logo logo-link" aria-label="YatraPulse home">
          <img
            src="/YatraPulse_logo_transparent.png"
            alt="YatraPulse"
            className="logo-image"
          />
        </Link>
        <nav aria-label="Main navigation">
          <Link to="/" className="header-nav-link" aria-current="page">
            Home
          </Link>
          <Link to="/tours" className="header-nav-link">
            Tours
          </Link>
          <a href="/contact" className="header-nav-link">
            Contact
          </a>
        </nav>
        <Link to="/login" className="header-admin-link">
          Admin panel <span aria-hidden="true">&#8599;</span>
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          className="mobile-menu-toggle"
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-site-menu"
          onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {createPortal(
        <>
          <button
            className={`mobile-menu-backdrop${isMobileMenuOpen ? " is-open" : ""}`}
            type="button"
            aria-label="Close navigation menu"
            tabIndex={isMobileMenuOpen ? 0 : -1}
            onClick={closeMobileMenu}
          />

          <aside
            id="mobile-site-menu"
            ref={menuPanelRef}
            className={`mobile-offcanvas${isMobileMenuOpen ? " is-open" : ""}`}
            aria-hidden={!isMobileMenuOpen}
            aria-labelledby="mobile-menu-title"
            aria-modal={isMobileMenuOpen ? "true" : undefined}
            role="dialog"
            inert={!isMobileMenuOpen}
          >
            <div className="mobile-offcanvas-header">
              <div className="mobile-offcanvas-brand">
                <img src="/YatraPulse_logo_transparent.png" alt="" />
                <span id="mobile-menu-title">Explore YatraPulse</span>
              </div>
              <button
                ref={closeButtonRef}
                className="mobile-menu-close"
                type="button"
                aria-label="Close navigation menu"
                onClick={closeMobileMenu}
              >
                <span aria-hidden="true">&#215;</span>
              </button>
            </div>

            <nav className="mobile-offcanvas-nav" aria-label="Mobile navigation">
              <Link to="/" onClick={closeMobileMenu} aria-current="page">
                <span>01</span> Home
              </Link>
              <Link to="/tours" onClick={closeMobileMenu}>
                <span>02</span> Tours
              </Link>
              <a href="/contact" onClick={closeMobileMenu}>
                <span>03</span> Contact
              </a>
            </nav>

            <Link
              to="/login"
              className="mobile-offcanvas-admin"
              onClick={closeMobileMenu}
            >
              Admin panel <span aria-hidden="true">&#8599;</span>
            </Link>
            <p className="mobile-offcanvas-note">Find your way to wonder.</p>
          </aside>
        </>,
        document.body,
      )}
    </>
  );
}

export default Header;
