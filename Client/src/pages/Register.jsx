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
import ThemeToggle from "../components/ThemeToggle";

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

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:bg-[#15171C] dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-gray-500 dark:focus:ring-gray-800";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <main className="relative flex min-h-[calc(100vh-72px)] items-center justify-center bg-gray-50 px-4 py-5 transition-colors duration-200 dark:bg-[#111318] sm:px-6">

      <div className="w-full max-w-102.5">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-[#1C1F26] dark:shadow-black/20 sm:p-7">
          {/* Heading */}
          <div className="mb-5 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
              {showOTP ? "Verify your email" : "Create your account"}
            </h1>

            <p className="mt-1.5 text-sm leading-5 text-gray-500 dark:text-gray-400">
              {showOTP
                ? `Enter the verification code sent to ${email}`
                : "Join Gatherr and discover events worth attending."}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!showOTP ? (
              <>
                {/* Name */}
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Full name
                  </label>

                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500" />

                    <input
                      id="name"
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
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email address
                  </label>

                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500" />

                    <input
                      id="email"
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
                <div>
                  <label htmlFor="password" className={labelClass}>
                    Password
                  </label>

                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500" />

                    <input
                      id="password"
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
                {/* OTP Success Message */}
                <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
                  Verification code sent. Check your inbox and spam folder.
                </div>

                {/* OTP */}
                <div>
                  <label htmlFor="otp" className={labelClass}>
                    Verification code
                  </label>

                  <input
                    id="otp"
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
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-center text-xl font-semibold tracking-[0.4em] text-gray-900 outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:bg-[#15171C] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 dark:focus:ring-gray-800"
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
                  Back to registration
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
                  : "Create account"}

              {!loading && <FaArrowRight className="text-xs" />}
            </button>
          </form>

          {/* Login Link */}
          {!showOTP && (
            <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-gray-950 underline-offset-4 hover:underline dark:text-white"
              >
                Sign in
              </Link>
            </p>
          )}

          {/* Footer */}
          <div className="mt-5 border-t border-gray-100 pt-4 text-center dark:border-gray-800">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              By creating an account, you can discover and book events on Gatherr.
            </p>
          </div>
        </section>

        <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} Gatherr. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default Register;
