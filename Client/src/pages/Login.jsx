import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  FaTicketAlt,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import ThemeToggle from "../components/ThemeToggle";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, verifyOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let data;

      if (!showOTP) {
        data = await login(email, password);
      } else {
        data = await verifyOTP(email, otp);
      }

      navigate(data.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      if (err?.needsVerification) {
        setShowOTP(true);
        setError(
          "Your account is not verified. A new OTP has been sent to your email."
        );
      } else {
        setError(
          typeof err === "string"
            ? err
            : err?.message || "Unable to sign in. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-72px)] items-center justify-center bg-gray-50 px-4 py-5 text-gray-900 transition-colors duration-200 dark:bg-[#111318] dark:text-gray-100 sm:px-6">
      <div className="w-full max-w-102.5">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-gray-700 dark:bg-[#1C1F26] sm:p-7">
          <div className="mb-6 text-center">

            <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
              {showOTP ? "Verify your account" : "Welcome back"}
            </h1>

            <p className="mt-1.5 text-sm leading-5 text-gray-500 dark:text-gray-400">
              {showOTP
                ? `Enter the verification code for ${email}`
                : "Sign in to discover and book your next event."}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className={`mb-4 rounded-lg border px-3 py-2.5 text-sm ${
                showOTP && error.includes("not verified")
                  ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                  : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
              }`}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {!showOTP ? (
              <>
                {/* Email */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500" />

                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-[#15171C] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-400 dark:focus:ring-gray-700"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500" />

                    <input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-[#15171C] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-400 dark:focus:ring-gray-700"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="login-otp"
                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Verification code
                  </label>

                  <input
                    id="login-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    placeholder="Enter 6-digit OTP"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-center text-xl font-semibold tracking-[0.4em] text-gray-900 outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-[#15171C] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-400 dark:focus:ring-gray-700"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowOTP(false);
                    setOtp("");
                    setError("");
                  }}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <FaArrowLeft className="text-xs" />
                  Back to login
                </button>
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 dark:focus:ring-gray-700"
            >
              {loading
                ? "Please wait..."
                : showOTP
                  ? "Verify and continue"
                  : "Sign in"}

              {!loading && <FaArrowRight className="text-xs" />}
            </button>
          </form>

          {!showOTP && (
            <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-gray-950 underline-offset-4 hover:underline dark:text-white"
              >
                Create account
              </Link>
            </p>
          )}

          <div className="mt-5 border-t border-gray-100 pt-4 text-center dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Your next experience starts with Gatherr.
            </p>
          </div>
        </section>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} Gatherr. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default Login;
