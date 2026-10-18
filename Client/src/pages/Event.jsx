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
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
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

        // Refresh event details to get the latest availability.
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
      <div className="py-20 text-center text-gray-600 dark:text-gray-300">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-20 text-center text-red-500">
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
      value:
        event.ticketPrice === 0 ? "Free" : `₹${event.ticketPrice}`,
      icon: <FaMoneyBillWave />,
    },
    {
      label: "Availability",
      value: isSoldOut ? "Sold Out" : "Available",
      icon: <FaChair />,
      status: true,
    },
    {
      label: "Date",
      value: formattedDate,
      icon: <FaCalendarAlt />,
    },
    {
      label: "Location",
      value: event.location,
      icon: <FaMapMarkerAlt />,
    },
  ];

  return (
    <div className="mx-auto my-6 max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-[#1C1F26]">
      {/* Event Image */}
      {event.image ? (
        <img
          src={event.image}
          alt={event.title}
          className="h-64 w-full object-cover sm:h-80"
        />
      ) : (
        <div className="flex h-64 w-full items-center justify-center bg-gray-100 text-3xl font-bold uppercase tracking-widest text-gray-400 dark:bg-[#252932] dark:text-gray-500">
          {event.category || "Event"}
        </div>
      )}

      <div className="p-5 sm:p-8 md:p-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px]">
          {/* Event Information */}
          <section>
            <span className="mb-4 inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:border-gray-700 dark:bg-[#252932] dark:text-gray-300">
              {event.category || "Event"}
            </span>

            <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
              {event.title}
            </h1>

            <p className="whitespace-pre-line text-base leading-7 text-gray-600 dark:text-gray-300">
              {event.description || "No description available for this event."}
            </p>
          </section>

          {/* Registration Details */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-[#15171C] sm:p-6">
            <h2 className="mb-5 text-xl font-bold text-gray-950 dark:text-white">
              Registration
            </h2>

            <div className="mb-6 space-y-5">
              {detailItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-700 dark:bg-[#252932] dark:text-gray-200">
                    {item.icon}
                  </div>

                  <div className="min-w-0 pt-0.5">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                      {item.label}
                    </p>

                    <p
                      className={`break-words text-sm font-semibold ${
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
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* OTP Input */}
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
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  maxLength={6}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-lg font-bold tracking-[0.4em] text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-[#1C1F26] dark:text-white dark:focus:ring-gray-700"
                />
              </div>
            )}

            {/* Register Button */}
            <button
              type="button"
              onClick={handleBooking}
              disabled={isSoldOut || bookingLoading || (showOTP && otp.length !== 6)}
              className="w-full rounded-xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 dark:focus:ring-gray-700 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
            >
              {bookingLoading
                ? "Please wait..."
                : isSoldOut
                  ? "Sold Out"
                  : showOTP
                    ? "Verify OTP & Register"
                    : "Register"}
            </button>

            {/* Feedback */}
            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
              >
                {error}
              </p>
            )}

            {successMsg && (
              <p
                role="status"
                className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300"
              >
                {successMsg}
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
