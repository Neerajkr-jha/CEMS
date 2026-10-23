import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import RazorpayCheckout from "@razorpay/razorpay-js/checkout";
import {
  FaTicketAlt,
  FaTimesCircle,
  FaCalendarAlt,
  FaArrowRight,
  FaUser,
  FaEnvelope,
  FaReceipt,
  FaCreditCard,
} from "react-icons/fa";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [payingId, setPayingId] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchBookings();
  }, [user, navigate, fetchBookings]);

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
      !window.confirm(
        "Are you sure you want to cancel this booking request?"
      )
    ) {
      return;
    }

    setCancellingId(id);

    try {
      await api.delete(`/bookings/${id}/cancel`);
      await fetchBookings();
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Error cancelling booking"
      );
    } finally {
      setCancellingId(null);
    }
  };

  const payForBooking = async (booking) => {
    if (payingId) return;

    setPayingId(booking._id);

    try {
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

            window.alert("Payment successful!");
            await fetchBookings();
          } catch (error) {
            window.alert(
              error.response?.data?.message ||
                "Payment verification failed. Please contact support if money was deducted."
            );
          } finally {
            setPayingId(null);
          }
        },
      });

      checkout.on("payment.failed", (response) => {
        window.alert(
          response.error?.description ||
            "Payment failed. Please try again."
        );
        setPayingId(null);
      });

      checkout.open();
    } catch (error) {
      window.alert(
        error.response?.data?.message ||
          "Unable to start payment. Please try again."
      );
      setPayingId(null);
    }
  };

  const getStatusClass = (status) => {
    if (status === "confirmed") {
      return "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300";
    }

    if (status === "cancelled") {
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300";
    }

    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300";
  };

  const getPaymentClass = (status) => {
    if (status === "paid") {
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300";
    }

    return "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-[#252932] dark:text-gray-300";
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] w-full items-center justify-center bg-gray-50 px-4 py-12 text-gray-600 dark:bg-[#111318] dark:text-gray-300">
        <div className="text-center">
          <div
            className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800 dark:border-gray-700 dark:border-t-white"
            role="status"
            aria-label="Loading"
          />
          <p className="text-sm font-medium sm:text-base">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] w-full overflow-x-clip bg-gray-50 text-gray-900 transition-colors duration-200 dark:bg-[#111318] dark:text-gray-100">
      <div className="mx-auto w-full max-w-7xl px-3 py-5 min-[400px]:px-4 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* User profile */}
        <section className="mb-7 flex min-w-0 flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#1C1F26] min-[400px]:p-6 sm:mb-9 sm:flex-row sm:gap-5 sm:p-7 lg:p-8">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-2xl font-bold uppercase text-gray-800 dark:bg-[#252932] dark:text-white sm:h-20 sm:w-20 sm:rounded-3xl sm:text-3xl">
            {user?.name?.charAt(0) || <FaUser />}
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
              Your account
            </p>

            <h1 className="break-words text-[clamp(1.4rem,4vw,2rem)] font-bold tracking-tight text-gray-950 dark:text-white">
              Welcome, {user?.name || "User"}!
            </h1>

            <p className="mt-2 inline-flex max-w-full items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 sm:justify-start">
              <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
              User Dashboard
            </p>

            {user?.email && (
              <p className="mt-2 flex min-w-0 items-start justify-center gap-2 break-all text-sm text-gray-500 dark:text-gray-400 sm:justify-start">
                <FaEnvelope className="mt-1 shrink-0 text-xs" />
                <span>{user.email}</span>
              </p>
            )}
          </div>

          <Link
            to="/"
            className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-[#252932] sm:w-auto"
          >
            Explore Events
            <FaArrowRight className="text-xs" />
          </Link>
        </section>

        {/* Booking overview heading */}
        <section className="mb-5 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:items-end min-[480px]:justify-between sm:mb-6">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-gray-950 dark:text-white sm:gap-3 sm:text-2xl">
              <FaTicketAlt className="shrink-0 text-gray-600 dark:text-gray-300" />
              My Bookings
            </h2>

            <p className="mt-1.5 text-sm leading-6 text-gray-500 dark:text-gray-400">
              View and manage your event registrations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 dark:border-gray-700 dark:bg-[#1C1F26] dark:text-gray-300">
              <FaReceipt className="text-gray-400" />
              {bookings.length}{" "}
              {bookings.length === 1 ? "booking" : "bookings"}
            </span>
          </div>
        </section>

        {/* Empty state */}
        {bookings.length === 0 ? (
          <section className="rounded-2xl border border-gray-200 bg-white px-4 py-12 text-center shadow-sm dark:border-gray-800 dark:bg-[#1C1F26] min-[400px]:px-6 sm:py-16">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-[#252932]">
              <FaTicketAlt className="text-2xl text-gray-400 dark:text-gray-500" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              No bookings yet
            </h3>

            <p className="mx-auto mb-6 mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
              You haven't registered for any events yet. Explore upcoming
              events and find something you would love to attend.
            </p>

            <Link
              to="/"
              className="inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-300 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 dark:focus-visible:ring-gray-700 sm:px-6"
            >
              Browse Events
              <FaArrowRight className="shrink-0 text-xs" />
            </Link>
          </section>
        ) : (
          /* Booking cards */
          <section
            aria-label="Your event bookings"
            className="grid grid-cols-1 items-stretch gap-4 min-[600px]:grid-cols-2 sm:gap-5 xl:grid-cols-3"
          >
            {bookings.map((booking) => {
              const isCancelled = booking.status === "cancelled";
              const event = booking.eventId;
              const isUnpaid =
                booking.status === "confirmed" &&
                booking.paymentStatus === "not_paid" &&
                booking.amount > 0;

              return (
                <article
                  key={booking._id}
                  className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:shadow-md dark:border-gray-800 dark:bg-[#1C1F26] dark:hover:shadow-black/20"
                >
                  {/* Card content */}
                  <div className="min-w-0 flex-1 p-4 min-[400px]:p-5 sm:p-6">
                    {event ? (
                      <>
                        <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
                          <h3 className="min-w-0 flex-1 break-words text-base font-bold leading-snug text-gray-950 dark:text-white sm:text-lg">
                            {event.title}
                          </h3>

                          <div className="flex max-w-[48%] shrink-0 flex-col items-end gap-2">
                            <span
                              className={`max-w-full break-words rounded-full border px-2 py-1 text-center text-[10px] font-bold uppercase tracking-wide sm:px-2.5 ${getStatusClass(
                                booking.status
                              )}`}
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
                                  className={`max-w-full break-words rounded-full border px-2 py-1 text-center text-[10px] font-bold uppercase tracking-wide sm:px-2.5 ${getPaymentClass(
                                    booking.paymentStatus
                                  )}`}
                                >
                                  {booking.paymentStatus.replace(/_/g, " ")}
                                </span>
                              )}
                          </div>
                        </div>

                        <div className="space-y-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                          <p className="flex min-w-0 items-start gap-2.5">
                            <FaCalendarAlt className="mt-1 shrink-0 text-gray-400 dark:text-gray-500" />
                            <span className="min-w-0 break-words">
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                Event date:{" "}
                              </span>
                              {formatDate(event.date)}
                            </span>
                          </p>

                          <p className="flex min-w-0 items-start gap-2.5">
                            <FaReceipt className="mt-1 shrink-0 text-gray-400 dark:text-gray-500" />
                            <span className="min-w-0 break-words">
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                Amount:{" "}
                              </span>
                              {booking.amount === 0
                                ? "Free"
                                : `₹${booking.amount}`}
                            </span>
                          </p>

                          <p className="flex min-w-0 items-start gap-2.5">
                            <FaCalendarAlt className="mt-1 shrink-0 text-gray-400 dark:text-gray-500" />
                            <span className="min-w-0 break-words">
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                Requested:{" "}
                              </span>
                              {formatDate(booking.bookedAt)}
                            </span>
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="break-words text-sm leading-6 text-red-500">
                        Event details unavailable. This event may have been
                        deleted.
                      </p>
                    )}
                  </div>

                  {/* Booking actions */}
                  <div className="mt-auto border-t border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-[#15171C] min-[400px]:px-5">
                    {event && !isCancelled ? (
                      <div className="flex flex-col gap-2 min-[380px]:flex-row min-[380px]:items-center">
                        <Link
                          to={`/events/${event._id}`}
                          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-center text-sm font-semibold text-gray-800 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:border-gray-700 dark:bg-[#1C1F26] dark:text-gray-200 dark:hover:bg-[#252932]"
                        >
                          View Event
                        </Link>

                        <button
                          type="button"
                          onClick={() => cancelBooking(booking._id)}
                          disabled={
                            cancellingId === booking._id ||
                            payingId === booking._id
                          }
                          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:bg-[#1C1F26] dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          <FaTimesCircle className="shrink-0" />
                          {cancellingId === booking._id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      </div>
                    ) : (
                      <p className="py-2 text-center text-sm text-gray-400">
                        {isCancelled
                          ? "Booking cancelled"
                          : "Event unavailable"}
                      </p>
                    )}

                    {/* Payment action */}
                    {isUnpaid && (
                      <button
                        type="button"
                        onClick={() => payForBooking(booking)}
                        disabled={payingId !== null}
                        className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 dark:focus-visible:ring-gray-700"
                      >
                        <FaCreditCard className="shrink-0" />
                        {payingId === booking._id
                          ? "Processing payment..."
                          : `Pay Now · ₹${booking.amount}`}
                        {payingId !== booking._id && (
                          <FaArrowRight className="shrink-0 text-xs" />
                        )}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
};

export default UserDashboard;
