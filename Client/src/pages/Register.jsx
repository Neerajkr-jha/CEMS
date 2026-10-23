import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, verifyOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      if (!showOTP) {
        await register(name, email, password);
        setShowOTP(true);
      } else {
        await verifyOTP(email, otp);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRegistration = () => {
    setShowOTP(false);
    setOtp("");
    setError("");
  };

  const inputClass =
    "min-h-12 w-full min-w-0 rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-[#15171C] dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-gray-500 dark:focus:ring-gray-800 sm:text-sm";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <main className="relative flex min-h-[calc(100svh-72px)] w-full items-center justify-center overflow-x-clip bg-gray-50 px-3 py-6 text-gray-900 transition-colors duration-200 dark:bg-[#111318] dark:text-gray-100 min-[400px]:px-4 sm:px-6 sm:py-10">
      <div className="w-full max-w-[410px] min-w-0">
        <section className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-[#1C1F26] dark:shadow-black/20 min-[400px]:p-5 sm:rounded-3xl sm:p-7 md:p-8">
          {/* Heading */}
          <div className="mb-5 text-center sm:mb-6">
            <h1 className="text-[clamp(1.4rem,5vw,1.875rem)] font-bold tracking-tight text-gray-950 dark:text-white">
              {showOTP ? "Verify your email" : "Create your account"}
            </h1>

            <p className="mx-auto mt-2 break-words text-sm leading-6 text-gray-500 dark:text-gray-400">
              {showOTP
                ? `Enter the verification code sent to ${email}`
                : "Join Gatherr and discover events worth attending."}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-4 break-words rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm leading-5 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {!showOTP ? (
              <>
                {/* Full name */}
                <div className="min-w-0">
                  <label htmlFor="name" className={labelClass}>
                    Full name
                  </label>

                  <div className="relative">
                    <FaUser
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500"
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your full name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="min-w-0">
                  <label htmlFor="email" className={labelClass}>
                    Email address
                  </label>

                  <div className="relative">
                    <FaEnvelope
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="min-w-0">
                  <label htmlFor="password" className={labelClass}>
                    Password
                  </label>

                  <div className="relative">
                    <FaLock
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500"
                    />

                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Create a password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* OTP success message */}
                <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-sm leading-5 text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
                  Verification code sent. Check your inbox and spam folder.
                </div>

                {/* OTP input */}
                <div className="min-w-0">
                  <label htmlFor="otp" className={labelClass}>
                    Verification code
                  </label>

                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    title="Enter the 6-digit verification code"
                    placeholder="Enter 6-digit OTP"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="min-h-14 w-full min-w-0 rounded-xl border border-gray-200 bg-white px-2 py-3 text-center text-lg font-semibold tracking-[0.3em] text-gray-900 outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-[#15171C] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 dark:focus:ring-gray-800 min-[400px]:tracking-[0.45em] sm:text-xl"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleBackToRegistration}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-gray-500 transition hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:text-gray-400 dark:hover:text-white"
                >
                  <FaArrowLeft aria-hidden="true" className="text-xs" />
                  Back to registration
                </button>
              </>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 dark:focus-visible:ring-gray-700"
            >
              {loading
                ? "Please wait..."
                : showOTP
                  ? "Verify and continue"
                  : "Create account"}

              {!loading && (
                <FaArrowRight aria-hidden="true" className="text-xs" />
              )}
            </button>
          </form>

          {/* Login link */}
          {!showOTP && (
            <p className="mt-5 break-words text-center text-sm leading-6 text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="inline-block font-semibold text-gray-950 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:text-white"
              >
                Sign in
              </Link>
            </p>
          )}

          {/* Footer message */}
          <div className="mt-5 border-t border-gray-100 pt-4 text-center dark:border-gray-800">
            <p className="break-words text-xs leading-5 text-gray-400 dark:text-gray-500">
              By creating an account, you can discover and book events on
              Gatherr.
            </p>
          </div>
        </section>

        {/* Copyright */}
        <p className="mt-4 px-2 text-center text-xs leading-5 text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} Gatherr. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default Register;
