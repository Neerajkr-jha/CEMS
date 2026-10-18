import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaTicketAlt,
  FaArrowRight,
} from "react-icons/fa";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 400);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchEvents = async () => {
    setLoading(true);

    try {
      const { data } = await api.get(
        `/events?search=${encodeURIComponent(search)}`
      );
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Hackathons", "Workshops", "Tech Talks", "College Fests"];

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 transition-colors duration-200 dark:bg-[#111318] dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative mx-4 mb-14 mt-4 overflow-hidden rounded-3xl bg-gray-50 dark:bg-[#1C1F26] sm:mx-6 lg:mx-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-[#252932] dark:via-[#1C1F26] dark:to-[#17191F]" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-5 py-20 text-center sm:px-10 sm:py-24 lg:py-28">
          {/* Eyebrow */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm dark:border-gray-700 dark:bg-[#15171C] dark:text-gray-300">
            <FaTicketAlt className="text-gray-800 dark:text-gray-200" />
            Discover something worth attending
          </div>

          {/* Heading */}
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-gray-950 dark:text-white sm:text-5xl lg:text-7xl">
            Find your next
            <span className="block text-gray-500 dark:text-gray-400">
              great experience.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg sm:leading-8">
            From hackathons and workshops to college fests and conferences,
            discover events that bring people together. Find your next
            opportunity with Gatherr.
          </p>

          {/* Search */}
          <div className="mt-9 flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-gray-100 dark:border-gray-700 dark:bg-[#15171C] dark:focus-within:border-gray-500 dark:focus-within:ring-gray-800 sm:rounded-full">
            <FaSearch className="ml-3 shrink-0 text-gray-400 sm:ml-4" />

            <input
              type="search"
              aria-label="Search events"
              placeholder="Search events, hackathons, workshops..."
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500 sm:text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <a
              href="events"
              className="flex shrink-0 items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 sm:rounded-full sm:px-6"
            >
              Search
              <FaArrowRight className="text-xs" />
            </a>
          </div>

          {/* Category Filters */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-sm text-gray-500 dark:text-gray-400">
              Popular:
            </span>

            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSearch(category)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  search === category
                    ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-950"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-950 dark:border-gray-700 dark:bg-[#1C1F26] dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Trust / Value Line */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <FaSearch className="text-gray-400 dark:text-gray-500" />
              Discover events
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600 sm:block" />

            <span className="flex items-center gap-2">
              <FaTicketAlt className="text-gray-400 dark:text-gray-500" />
              Book your spot
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600 sm:block" />

            <span className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400 dark:text-gray-500" />
              Make it memorable
            </span>
          </div>
        </div>
      </section>

      {/* Events */}
      <main
        id="events"
        className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 sm:px-6 lg:px-10"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-gray-100 pb-5 dark:border-gray-800">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              FIND YOUR NEXT EXPERIENCE
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
              {search ? "Search Results" : "Events"}
            </h2>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {events.length} {events.length === 1 ? "event" : "events"} found
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500 dark:text-gray-400">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-16 text-center dark:border-gray-800 dark:bg-[#1C1F26]">
            <FaCalendarAlt className="mx-auto mb-4 text-3xl text-gray-300 dark:text-gray-600" />

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No events found
            </h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Try another search to discover more events.
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-[#1C1F26] dark:hover:shadow-black/20"
              >
                <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-[#252932]">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500">
                      <FaCalendarAlt className="text-4xl" />
                    </div>
                  )}

                  <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm dark:bg-[#111318] dark:text-white">
                    {event.ticketPrice === 0
                      ? "Free"
                      : `₹${event.ticketPrice}`}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {event.category || "Event"}
                  </p>

                  <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    {event.title}
                  </h3>

                  <div className="mb-5 space-y-3 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-start gap-3">
                      <FaCalendarAlt className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                      <span>
                        {new Date(event.date).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-800">
                    <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                      {Number(event.totalSeats) > 0
                        ? `${event.availableSeats} of ${event.totalSeats} seats remaining`
                        : "View event for details"}
                    </p>

                    <Link
                      to={`/events/${event._id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                    >
                      View Details
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white transition-colors duration-200 dark:border-gray-800 dark:bg-[#111318]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-7 sm:flex-row sm:px-8 lg:px-10">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white"
          >
            <FaTicketAlt />
            Gatherr
          </Link>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Discover events. Find your people. Make memories.
          </p>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Gatherr
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
