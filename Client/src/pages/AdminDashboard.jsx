import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaTicketAlt,
  FaTrash,
  FaPlus,
  FaTimes,
  FaMapMarkerAlt,
  FaUsers,
  FaMoneyBillWave,
  FaCheck,
  FaBan,
  FaClock,
} from "react-icons/fa";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initialForm = {
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    totalSeats: "",
    ticketPrice: "",
    image: "",
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        api.get("/events"),
        api.get("/bookings/my"),
      ]);

      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date || Number.isNaN(new Date(date).getTime())) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date || Number.isNaN(new Date(date).getTime())) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSavingEvent(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/events", {
        ...formData,
        totalSeats: Number(formData.totalSeats),
        ticketPrice: Number(formData.ticketPrice),
      });

      setShowEventForm(false);
      setFormData(initialForm);
      setSuccess("Event published successfully.");
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Error creating event.");
    } finally {
      setSavingEvent(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    setActionId(id);
    setError("");
    setSuccess("");

    try {
      await api.delete(`/events/${id}`);
      setSuccess("Event deleted successfully.");
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting event.");
    } finally {
      setActionId(null);
    }
  };

  const handleConfirmBooking = async (id) => {
    setActionId(id);
    setError("");
    setSuccess("");

    try {
      await api.put(`/bookings/${id}/confirm`);
      setSuccess("Booking updated successfully.");
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Error confirming booking."
      );
    } finally {
      setActionId(null);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Reject this user's booking request?")) {
      return;
    }

    setActionId(id);
    setError("");
    setSuccess("");

    try {
      await api.delete(`/bookings/${id}/cancel`);
      setSuccess("Booking request rejected.");
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Error cancelling booking."
      );
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center px-4 text-center text-gray-600 dark:text-gray-300">
        Loading admin dashboard...
      </div>
    );
  }

  const revenue = bookings.reduce(
    (sum, booking) =>
      booking.paymentStatus === "paid" &&
      booking.status === "confirmed"
        ? sum + Number(booking.amount || 0)
        : sum,
    0
  );

  const paidClients = new Set(
    bookings
      .filter(
        (booking) =>
          booking.paymentStatus === "paid" &&
          booking.status === "confirmed"
      )
      .map((booking) => booking.userId?._id)
      .filter(Boolean)
  ).size;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const inputClass =
    "min-h-12 w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:bg-[#15171C] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 dark:focus:ring-gray-800";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

  const cardClass =
    "min-w-0 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#1C1F26]";

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${revenue.toLocaleString("en-IN")}`,
      description: "From paid, confirmed bookings",
      icon: <FaMoneyBillWave />,
      iconClass:
        "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400",
    },
    {
      label: "Paid Clients",
      value: paidClients,
      description: "Unique users with paid bookings",
      icon: <FaUsers />,
      iconClass:
        "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
    },
    {
      label: "Pending Requests",
      value: pendingBookings,
      description: "Awaiting your decision",
      icon: <FaClock />,
      iconClass:
        "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-6 px-3 py-4 wrap-anywhere min-[480px]:space-y-8 min-[480px]:px-5 sm:px-6 lg:px-8">
      {/* Dashboard header */}
      <header className="flex min-w-0 flex-col gap-5 rounded-2xl bg-gray-950 p-4 text-white min-[480px]:p-6 sm:p-8 md:flex-row md:items-center md:justify-between dark:bg-[#1C1F26]">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
            Gatherr Management
          </p>
          <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-tight tracking-tight">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-300">
            Manage events and review registration requests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowEventForm(!showEventForm);
            setError("");
            setSuccess("");
          }}
          className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-950 transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 md:w-auto dark:bg-white dark:hover:bg-gray-200"
        >
          {showEventForm ? <FaTimes /> : <FaPlus />}
          {showEventForm ? "Close Form" : "Create New Event"}
        </button>
      </header>

      {/* Feedback */}
      {error && (
        <div
          role="alert"
          className="wrap-break-word rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="wrap-break-word rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300"
        >
          {success}
        </div>
      )}

      {/* Statistics */}
      <section
        aria-label="Dashboard statistics"
        className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-3 min-[480px]:gap-4"
      >
        {stats.map((stat) => (
          <article
            key={stat.label}
            className={`${cardClass} flex min-w-0 items-center justify-between gap-3 p-4 min-[480px]:p-5 sm:p-6`}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              <h2 className="mt-2 wrap-break-word text-[clamp(1.5rem,4vw,1.875rem)] font-bold text-gray-950 dark:text-white">
                {stat.value}
              </h2>
              <p className="mt-1 text-xs leading-5 text-gray-400">
                {stat.description}
              </p>
            </div>
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg min-[480px]:h-12 min-[480px]:w-12 ${stat.iconClass}`}
              aria-hidden="true"
            >
              {stat.icon}
            </div>
          </article>
        ))}
      </section>

      {/* Create event form */}
      {showEventForm && (
        <section className={`${cardClass} p-4 min-[480px]:p-6 sm:p-8`}>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-950 sm:text-2xl dark:text-white">
              Create New Event
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Add the details below to publish your event.
            </p>
          </div>

          <form
            onSubmit={handleCreateEvent}
            className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2"
          >
            <div className="min-w-0">
              <label className={labelClass} htmlFor="event-title">
                Event title
              </label>
              <input
                id="event-title"
                required
                type="text"
                placeholder="Enter event title"
                className={inputClass}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="event-category">
                Category
              </label>
              <input
                id="event-category"
                required
                type="text"
                placeholder="e.g. Technology, Music"
                className={inputClass}
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="event-date">
                Event date
              </label>
              <input
                id="event-date"
                required
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                className={inputClass}
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="event-location">
                Location
              </label>
              <input
                id="event-location"
                required
                type="text"
                placeholder="Enter venue or location"
                className={inputClass}
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="event-seats">
                Total seats
              </label>
              <input
                id="event-seats"
                required
                type="number"
                min="1"
                placeholder="Enter capacity"
                className={inputClass}
                value={formData.totalSeats}
                onChange={(e) =>
                  setFormData({ ...formData, totalSeats: e.target.value })
                }
              />
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="event-price">
                Ticket price (₹)
              </label>
              <input
                id="event-price"
                required
                type="number"
                min="0"
                placeholder="Enter 0 for a free event"
                className={inputClass}
                value={formData.ticketPrice}
                onChange={(e) =>
                  setFormData({ ...formData, ticketPrice: e.target.value })
                }
              />
            </div>

            <div className="min-w-0 md:col-span-2">
              <label className={labelClass} htmlFor="event-image">
                Image URL (optional)
              </label>
              <input
                id="event-image"
                type="url"
                placeholder="https://example.com/image.jpg"
                className={inputClass}
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </div>

            <div className="min-w-0 md:col-span-2">
              <label className={labelClass} htmlFor="event-description">
                Event description
              </label>
              <textarea
                id="event-description"
                required
                rows={4}
                placeholder="Describe your event..."
                className={`${inputClass} min-h-28 resize-y`}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="flex min-w-0 flex-col gap-3 min-[480px]:flex-row md:col-span-2">
              <button
                type="submit"
                disabled={savingEvent}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60 min-[480px]:w-auto dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
              >
                <FaPlus />
                {savingEvent ? "Publishing..." : "Publish Event"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowEventForm(false);
                  setFormData(initialForm);
                }}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 min-[480px]:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-[#252932]"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Events and booking requests */}
      <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-2 xl:gap-8">
        {/* Events */}
        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex min-w-0 items-center gap-2 text-lg font-bold text-gray-950 min-[480px]:gap-3 min-[480px]:text-xl dark:text-white">
              <FaCalendarAlt
                className="shrink-0 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
              />
              <span>All Events</span>
            </h2>
            <span className="shrink-0 rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
              {events.length}
            </span>
          </div>

          <div className={`${cardClass} overflow-hidden`}>
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {events.length === 0 ? (
                <li className="p-6 text-center text-sm text-gray-500 sm:p-8 dark:text-gray-400">
                  No events created yet.
                </li>
              ) : (
                events.map((event) => {
                  const soldOut = Number(event.availableSeats) <= 0;

                  return (
                    <li
                      key={event._id}
                      className="flex min-w-0 flex-col gap-4 p-4 transition hover:bg-gray-50 min-[480px]:p-5 sm:flex-row sm:items-start sm:justify-between dark:hover:bg-[#252932]"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="wrap-break-word font-bold leading-snug text-gray-950 dark:text-white">
                          {event.title}
                        </h3>

                        <p className="mt-1 wrap-break-word text-xs font-medium uppercase tracking-wide text-gray-400">
                          {event.category || "Event"}
                        </p>

                        <div className="mt-3 flex min-w-0 flex-col gap-2 text-sm text-gray-500 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:gap-x-4 dark:text-gray-400">
                          <span className="flex min-w-0 items-start gap-2">
                            <FaCalendarAlt
                              className="mt-1 shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <span>{formatDate(event.date)}</span>
                          </span>

                          <span className="flex min-w-0 items-start gap-2">
                            <FaMapMarkerAlt
                              className="mt-1 shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <span className="wrap-break-word">{event.location}</span>
                          </span>
                        </div>

                        <span
                          className={`mt-3 inline-flex max-w-full rounded-full border px-2.5 py-1 text-xs font-semibold ${
                            soldOut
                              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                              : "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300"
                          }`}
                        >
                          {soldOut ? "Sold Out" : "Available"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(event._id)}
                        disabled={actionId === event._id}
                        className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 sm:w-auto dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                      >
                        <FaTrash aria-hidden="true" />
                        {actionId === event._id ? "Deleting..." : "Delete"}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </section>

        {/* Booking requests */}
        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex min-w-0 items-center gap-2 text-lg font-bold text-gray-950 min-[480px]:gap-3 min-[480px]:text-xl dark:text-white">
              <FaTicketAlt
                className="shrink-0 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
              />
              <span>Booking Requests</span>
            </h2>
            <span className="shrink-0 rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
              {bookings.length}
            </span>
          </div>

          <div className={`${cardClass} overflow-hidden`}>
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {bookings.length === 0 ? (
                <li className="p-6 text-center text-sm text-gray-500 sm:p-8 dark:text-gray-400">
                  No booking requests yet.
                </li>
              ) : (
                bookings.map((booking) => {
                  const isPending = booking.status === "pending";
                  const isConfirmed = booking.status === "confirmed";
                  const isCancelled = booking.status === "cancelled";

                  const statusClass = isConfirmed
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300"
                    : isCancelled
                      ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                      : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300";

                  return (
                    <li
                      key={booking._id}
                      className="min-w-0 p-4 min-[480px]:p-5"
                    >
                      <div className="mb-4 flex min-w-0 flex-col gap-3 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
                        <div className="min-w-0">
                          <h3 className="wrap-break-word font-bold leading-snug text-gray-950 dark:text-white">
                            {booking.eventId?.title || "Deleted Event"}
                          </h3>
                          <p className="mt-1 wrap-break-word text-sm text-gray-500 dark:text-gray-400">
                            {booking.userId?.name || "Unknown user"}
                          </p>
                        </div>

                        <div className="flex min-w-0 flex-wrap items-center gap-2 min-[420px]:shrink-0 min-[420px]:flex-col min-[420px]:items-end">
                          <span
                            className={`max-w-full rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusClass}`}
                          >
                            {booking.status}
                          </span>

                          {!isCancelled && booking.paymentStatus && (
                            <span className="max-w-full rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-600 dark:border-gray-700 dark:bg-[#252932] dark:text-gray-300">
                              {booking.paymentStatus.replace(/_/g, " ")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm dark:border-gray-800 dark:bg-[#15171C]">
                        <p className="wrap-break-word text-gray-600 dark:text-gray-300">
                          <span className="font-medium text-gray-500 dark:text-gray-400">
                            Email:{" "}
                          </span>
                          {booking.userId?.email || "Unavailable"}
                        </p>

                        <p className="wrap-break-word text-gray-600 dark:text-gray-300">
                          <span className="font-medium text-gray-500 dark:text-gray-400">
                            Amount:{" "}
                          </span>
                          {booking.amount === 0
                            ? "Free"
                            : `₹${booking.amount}`}
                        </p>

                        <p className="wrap-break-word text-gray-600 dark:text-gray-300">
                          <span className="font-medium text-gray-500 dark:text-gray-400">
                            Requested:{" "}
                          </span>
                          {formatDateTime(booking.bookedAt)}
                        </p>

                        {booking.eventId && (
                          <p className="wrap-break-word text-gray-600 dark:text-gray-300">
                            <span className="font-medium text-gray-500 dark:text-gray-400">
                              Event availability:{" "}
                            </span>
                            {Number(booking.eventId.availableSeats) > 0
                              ? "Available"
                              : "Sold Out"}
                          </p>
                        )}
                      </div>

                      {isPending && (
                        <div className="mt-4 grid grid-cols-1 gap-2 min-[480px]:grid-cols-2">
                          <button
                            type="button"
                            disabled={actionId === booking._id}
                            onClick={() =>
                              handleConfirmBooking(booking._id)
                            }
                            className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-xs font-semibold text-green-700 transition hover:bg-green-600 hover:text-white disabled:opacity-50 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300 dark:hover:bg-green-700 dark:hover:text-white"
                          >
                            <FaCheck aria-hidden="true" />
                            {actionId === booking._id
                              ? "Processing..."
                              : "Confirm booking"}
                          </button>

                          <button
                            type="button"
                            disabled={actionId === booking._id}
                            onClick={() =>
                              handleCancelBooking(booking._id)
                            }
                            className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-500 hover:text-white disabled:opacity-50 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-700 dark:hover:text-white"
                          >
                            <FaBan aria-hidden="true" />
                            Reject
                          </button>
                        </div>
                      )}

                      {actionId === booking._id && (
                        <p
                          role="status"
                          className="mt-3 text-xs text-gray-500 dark:text-gray-400"
                        >
                          Processing request...
                        </p>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;