import React from "react";
import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFailed = () => {
  return (
    <main className="flex min-h-[70vh] w-full items-center justify-center overflow-x-clip bg-gray-50 px-3 py-8 text-gray-900 transition-colors duration-200 dark:bg-[#111318] dark:text-gray-100 min-[400px]:px-4 sm:px-6 sm:py-12">
      <section className="w-full max-w-[460px] rounded-2xl border border-gray-200 border-t-4 border-t-red-500 bg-white p-5 text-center shadow-xl transition-all duration-300 hover:shadow-2xl dark:border-gray-800 dark:border-t-red-500 dark:bg-[#1C1F26] min-[400px]:p-6 sm:rounded-3xl sm:p-8 md:p-10">
        {/* Failure icon */}
        <FaTimesCircle
          aria-hidden="true"
          className="mx-auto mb-5 text-5xl text-red-500 drop-shadow-sm min-[400px]:text-6xl sm:mb-6 sm:text-7xl"
        />

        {/* Heading */}
        <h1 className="text-[clamp(1.75rem,6vw,2.5rem)] font-black tracking-tight text-gray-900 dark:text-white">
          Booking Failed
        </h1>

        {/* Message */}
        <p className="mx-auto mt-3 mb-7 max-w-sm break-words text-sm leading-6 text-gray-500 dark:text-gray-400 min-[400px]:text-base sm:mt-4 sm:mb-8 sm:leading-7">
          We couldn't process your payment. Please ensure your payment details
          are correct and try again.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <Link
            to="/"
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200 dark:focus-visible:ring-red-900 sm:min-h-14 sm:text-base"
          >
            Return to Events
          </Link>

          <Link
            to="/dashboard"
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-200 dark:bg-[#292D36] dark:text-gray-200 dark:hover:bg-[#343945] dark:focus-visible:ring-gray-700 sm:min-h-14 sm:text-base"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
};

export default PaymentFailed;
