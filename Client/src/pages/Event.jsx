import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChair,
  FaMoneyBillWave,
} from "react-icons/fa";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    let active = true;

    const fetchEvent = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get(`/events/${id}`);
        if (active) setEvent(data);
      } catch (err) {
        if (active) setError("Failed to load event details.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchEvent();

    return () => {
      active = false;
    };
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setBookingLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (!showOTP) {
        await api.post("/bookings/send-otp");
        setShowOTP(true);
        setSuccessMsg(
          "OTP sent to your email. Please verify to confirm registration."
        );
      } else {
        await api.post("/bookings", { eventId: event._id, otp });

        setSuccessMsg(
          "Registration requested! Awaiting admin confirmation."
        );
        setShowOTP(false);
        setOtp("");

        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center px-4 text-center text-gray-600 dark:text-gray-300">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div
        role="alert"
        className="mx-auto my-8 w-[calc(100%-2rem)] max-w-3xl rounded-xl p-4 text-center text-red-500"
      >
        {error || "Event not found."}
      </div>
    );
  }

  const isSoldOut = Number(event.availableSeats) <= 0;

  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const detailItems = [
    {
      label: "Ticket Price",
      value: event.ticketPrice === 0 ? "Free" : `₹${event.ticketPrice}`,
      icon: <FaMoneyBillWave aria-hidden="true" />,
    },
    {
      label: "Availability",
      value: isSoldOut ? "Sold Out" : "Available",
      icon: <FaChair aria-hidden="true" />,
      status: true,
    },
    {
      label: "Date",
      value: formattedDate,
      icon: <FaCalendarAlt aria-hidden="true" />,
    },
    {
      label: "Location",
      value: event.location,
      icon: <FaMapMarkerAlt aria-hidden="true" />,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-360 px-3 py-4 wrap-anywhere min-[480px]:px-5 min-[480px]:py-6 md:px-8 lg:px-10">
      <article className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-800 dark:bg-[#1C1F26] sm:rounded-3xl">
        {/* Responsive event image */}
        {event.image ? (
          <img
            src={event.image}
            alt={`${event.title} event`}
            loading="eager"
            fetchPriority="high"
            className="block aspect-video w-full bg-gray-100 object-cover sm:aspect-2/1 lg:aspect-21/8"
          />
        ) : (
          <div className="grid aspect-video w-full place-items-center bg-gray-100 px-4 text-center text-xl font-bold uppercase tracking-widest text-gray-400 sm:aspect-2/1 sm:text-3xl dark:bg-[#252932] dark:text-gray-500">
            {event.category || "Event"}
          </div>
        )}

        <div className="p-4 min-[480px]:p-6 md:p-8 lg:p-10">
          <div className="grid min-w-0 grid-cols-1 gap-6 md:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:items-start lg:gap-8 xl:gap-12">
            {/* Event information */}
            <section className="min-w-0">
              <span className="mb-3 inline-flex max-w-full rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:border-gray-700 dark:bg-[#252932] dark:text-gray-300">
                {event.category || "Event"}
              </span>

              <h1 className="mb-4 text-[clamp(1.5rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-gray-950 dark:text-white">
                {event.title}
              </h1>

              <p className="whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base dark:text-gray-300">
                {event.description ||
                  "No description available for this event."}
              </p>
            </section>

            {/* Registration details */}
            <aside className="min-w-0 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-6 dark:border-gray-700 dark:bg-[#15171C] lg:sticky lg:top-6">
              <h2 className="mb-5 text-lg font-bold text-gray-950 sm:text-xl dark:text-white">
                Registration
              </h2>

              <dl className="mb-6 grid grid-cols-1 gap-5">
                {detailItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex min-w-0 items-start gap-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-700 dark:bg-[#252932] dark:text-gray-200">
                      {item.icon}
                    </div>

                    <div className="min-w-0 flex-1 pt-0.5">
                      <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                        {item.label}
                      </dt>

                      <dd
                        className={`wrap-break-word text-sm font-semibold ${
                          item.status
                            ? isSoldOut
                              ? "text-red-500"
                              : "text-green-600 dark:text-green-400"
                            : item.label === "Ticket Price" &&
                                event.ticketPrice === 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {item.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>

              {/* OTP input */}
              {showOTP && (
                <div className="mb-4">
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Enter OTP to confirm
                  </label>

                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    required
                    aria-label="Six-digit verification code"
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    maxLength={6}
                    className="min-h-12 w-full min-w-0 rounded-xl border border-gray-200 bg-white px-3 py-3 text-center text-lg font-bold tracking-[0.3em] text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-[#1C1F26] dark:text-white dark:focus:ring-gray-700"
                  />
                </div>
              )}

              {/* Registration button */}
              <button
                type="button"
                onClick={handleBooking}
                disabled={
                  isSoldOut ||
                  bookingLoading ||
                  (showOTP && otp.length !== 6)
                }
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-gray-950 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 dark:focus-visible:ring-offset-[#15171C] dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
              >
                {bookingLoading
                  ? "Please wait..."
                  : isSoldOut
                    ? "Sold Out"
                    : showOTP
                      ? "Verify OTP & Register"
                      : "Register"}
              </button>

              {error && (
                <p
                  role="alert"
                  className="mt-4 wrap-break-word rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                >
                  {error}
                </p>
              )}

              {successMsg && (
                <p
                  role="status"
                  className="mt-4 wrap-break-word rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300"
                >
                  {successMsg}
                </p>
              )}
            </aside>
          </div>
        </div>
      </article>
    </main>
  );
};

export default EventDetail;