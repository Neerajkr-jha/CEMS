import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { FaTicketAlt, FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinkClass =
    "text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-950 dark:text-gray-300 dark:hover:text-white";

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md transition-colors duration-200 dark:border-gray-800 dark:bg-[#111318]/95">
      <div className="relative mx-auto w-full max-w-7xl px-4 min-[480px]:px-5 sm:px-6 lg:px-10">
        <div className="flex h-[68px] items-center justify-between gap-3 sm:h-[72px]">
          {/* Logo: stays on the left with mobile padding */}
          <Link
            to="/"
            aria-label="Gatherr home"
            className="group flex shrink-0 items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950 text-white transition-transform duration-200 group-hover:scale-105 sm:h-10 sm:w-10 dark:bg-white dark:text-gray-950">
              <FaTicketAlt className="text-lg" />
            </span>

            <span className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl dark:text-white">
              Gatherr
              <span className="text-gray-400 dark:text-gray-500">.</span>
            </span>
          </Link>

          {/* Desktop navigation: original layout */}
          <div className="hidden items-center gap-3 sm:gap-6 md:flex lg:gap-8">
            <ThemeToggle />

            <Link to="/" className={navLinkClass}>
              Events
            </Link>

            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className={navLinkClass}
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 hover:text-gray-950 sm:px-4 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={navLinkClass}>
                  Login
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700 sm:px-5 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                >
                  <span>Get Started</span>
                  <FaArrowRight className="text-xs" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-800 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {menuOpen ? (
                <FaTimes className="text-lg" />
              ) : (
                <FaBars className="text-lg" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu: opens as a vertical list */}
        {menuOpen && (
          <div
            id="mobile-nav-menu"
            className="absolute left-1/2 right-0 top-full z-100 mx-3 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl md:hidden dark:border-gray-700 dark:bg-[#1C1F26]"
          >
            <div className="flex flex-col gap-1 p-3">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Events
              </Link>

              {user ? (
                <>
                  <Link
                    to={user.role === "admin" ? "/admin" : "/dashboard"}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="mt-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                  >
                    Get Started
                    <FaArrowRight className="text-xs" />
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
