import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import RazorpayCheckout from "@razorpay/razorpay-js/checkout";
import {
  FaTicketAlt,
  FaTimesCircle,
  FaCalendarAlt,
  FaArrowRight,
} from "react-icons/fa";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
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

  const cancelBooking = async (id) => {
    if (
      !window.confirm("Are you sure you want to cancel this booking request?")
    ) {
      return;
    }

    setCancellingId(id);

    try {
      await api.delete(`/bookings/${id}/cancel`);
      await fetchBookings();
    } catch (error) {
      window.alert(error.response?.data?.message || "Error cancelling booking");
    } finally {
      setCancellingId(null);
    }
  };

  const payForBooking = async (booking) => {
    try {
      // Ask the backend to calculate the amount and create the order.
      const { data } = await api.post("/payments/create-order", {
        bookingId: booking._id,
      });

      const checkout = await RazorpayCheckout({
        key: data.keyId,
        order_id: data.orderId,
        amount: data.amount,
        currency: data.currency,
        name: "Gatherr",
        description: "Event ticket payment",

        handler: async (response) => {
          try {
            await api.post("/payments/verify", {
              bookingId: booking._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert("Payment successful!");
            await fetchBookings();
          } catch (error) {
            alert(
              error.response?.data?.message ||
                "Payment verification failed. Please contact support if money was deducted.",
            );
          }
        },
      });

      checkout.on("payment.failed", (response) => {
        alert(
          response.error?.description || "Payment failed. Please try again.",
        );
      });

      checkout.open();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to start payment. Please try again.",
      );
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-600 dark:text-gray-300">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl py-4">
      {/* User Profile */}
      <section className="mb-8 flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-[#1C1F26] sm:flex-row sm:gap-6 sm:p-8">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gray-100 text-3xl font-bold uppercase text-gray-800 dark:bg-[#252932] dark:text-white">
          {user?.name?.charAt(0) || "U"}
        </div>

        <div className="flex flex-col items-center sm:items-start">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            Welcome, {user?.name || "User"}!
          </h1>

          <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            User Dashboard
          </p>

          {user?.email && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          )}
        </div>
      </section>

      {/* Bookings Heading */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            <FaTicketAlt className="text-gray-600 dark:text-gray-300" />
            My Bookings
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage your event registrations.
          </p>
        </div>

        <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 dark:border-gray-700 dark:bg-[#1C1F26] dark:text-gray-300">
          {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
        </span>
      </div>

      {/* Empty State */}
      {bookings.length === 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white px-5 py-16 text-center shadow-sm dark:border-gray-800 dark:bg-[#1C1F26]">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-[#252932]">
            <FaTicketAlt className="text-2xl text-gray-400 dark:text-gray-500" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            No bookings yet
          </h3>

          <p className="mx-auto mb-6 mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
            You haven't registered for any events yet. Explore upcoming events
            and find something you would love to attend.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
          >
            Browse Events
            <FaArrowRight className="text-xs" />
          </Link>
        </section>
      ) : (
        /* Booking Cards */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => {
            const isCancelled = booking.status === "cancelled";
            const event = booking.eventId;

            const statusClass =
              booking.status === "confirmed"
                ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300"
                : isCancelled
                  ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                  : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300";

            const paymentClass =
              booking.paymentStatus === "paid"
                ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300"
                : "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-[#252932] dark:text-gray-300";

            return (
              <article
                key={booking._id}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-[#1C1F26] dark:hover:shadow-black/20"
              >
                <div className="flex-1 p-5 sm:p-6">
                  {event ? (
                    <>
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <h3 className="min-w-0 flex-1 text-lg font-bold leading-snug text-gray-950 dark:text-white">
                          {event.title}
                        </h3>

                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusClass}`}
                          >
                            {booking.status}
                          </span>

                          {!isCancelled &&
                            booking.paymentStatus &&
                            !(
                              booking.status === "confirmed" &&
                              booking.paymentStatus === "not_paid"
                            ) && (
                              <span
                                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${paymentClass}`}
                              >
                                {booking.paymentStatus.replace(/_/g, " ")}
                              </span>
                            )}
                        </div>
                      </div>

                      <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                        <p className="flex items-start gap-2.5">
                          <FaCalendarAlt className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                          <span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              Event date:{" "}
                            </span>
                            {formatDate(event.date)}
                          </span>
                        </p>

                        <p>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            Amount:{" "}
                          </span>
                          {booking.amount === 0 ? "Free" : `₹${booking.amount}`}
                        </p>

                        <p>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            Requested:{" "}
                          </span>
                          {formatDate(booking.bookedAt)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm italic text-red-500">
                      Event details unavailable. This event may have been
                      deleted.
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-[#15171C]">
                  {event && !isCancelled ? (
                    <>
                      <Link
                        to={`/events/${event._id}`}
                        className="text-sm font-semibold text-gray-800 transition hover:underline dark:text-gray-200"
                      >
                        View Event
                      </Link>

                      <button
                        type="button"
                        onClick={() => cancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FaTimesCircle />
                        {cancellingId === booking._id
                          ? "Cancelling..."
                          : "Cancel"}
                      </button>
                    </>
                  ) : (
                    <span className="w-full text-center text-sm text-gray-400">
                      {isCancelled ? "Booking cancelled" : "Event unavailable"}
                    </span>
                  )}
                </div>

                {/* Payment option display if booking is confirmed and payment is not done */}

                {booking.status === "confirmed" &&
                  booking.paymentStatus === "not_paid" &&
                  booking.amount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        payForBooking(booking);
                      }}
                      className="bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 dark:bg-white dark:text-gray-950"
                    >
                      Pay Now · ₹{booking.amount}
                    </button>
                  )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
