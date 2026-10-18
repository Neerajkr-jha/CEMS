
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { FaTicketAlt, FaArrowRight } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass =
    "text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-950 dark:text-gray-300 dark:hover:text-white";

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md transition-colors duration-200 dark:border-gray-800 dark:bg-[#111318]/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex h-[72px] items-center justify-between gap-4">
          {/* Brand */}
          <Link
            to="/"
            aria-label="Gatherr home"
            className="group flex shrink-0 items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-white transition-transform duration-200 group-hover:scale-105 dark:bg-white dark:text-gray-950">
              <FaTicketAlt className="text-lg" />
            </span>

            <span className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
              Gatherr
              <span className="text-gray-400 dark:text-gray-500">.</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
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
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 hover:text-gray-950 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800 dark:hover:text-white sm:px-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${navLinkClass} hidden sm:inline-flex`}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 sm:px-5"
                >
                  <span>Get Started</span>
                  <FaArrowRight className="text-xs" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
