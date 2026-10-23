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

  const categories = [
    "Hackathons",
    "Workshops",
    "Tech Talks",
    "College Fests",
  ];

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-white text-gray-900 transition-colors duration-200 dark:bg-[#111318] dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative mx-3 mb-10 mt-3 overflow-hidden rounded-2xl bg-gray-50 min-[480px]:mx-5 min-[480px]:mt-4 min-[480px]:rounded-3xl sm:mx-6 sm:mb-14 lg:mx-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-[#252932] dark:via-[#1C1F26] dark:to-[#17191F]" />

        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-12 text-center min-[400px]:px-5 min-[400px]:py-14 min-[480px]:px-8 min-[480px]:py-16 sm:px-10 sm:py-24 lg:py-28">
          {/* Eyebrow */}
          <div className="mb-5 inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-medium leading-5 text-gray-600 shadow-sm min-[480px]:mb-7 min-[480px]:px-4 min-[480px]:text-sm dark:border-gray-700 dark:bg-[#15171C] dark:text-gray-300">
            <FaTicketAlt className="shrink-0 text-gray-800 dark:text-gray-200" />
            <span>Discover something worth attending</span>
          </div>

          {/* Heading */}
          <h1 className="max-w-4xl text-[clamp(2rem,7vw,4.5rem)] font-bold leading-[1.12] tracking-tight text-gray-950 dark:text-white">
            Find your next
            <span className="block text-gray-500 dark:text-gray-400">
              great experience.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600 min-[480px]:mt-6 min-[480px]:text-base min-[480px]:leading-7 sm:text-lg sm:leading-8 dark:text-gray-300">
            From hackathons and workshops to college fests and conferences,
            discover events that bring people together. Find your next
            opportunity with Gatherr.
          </p>

          {/* Responsive Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("events")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className="mt-7 flex w-full max-w-2xl min-w-0 items-center gap-1.5 rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm transition focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-gray-100 min-[400px]:gap-2 min-[400px]:p-2 min-[480px]:mt-9 min-[480px]:rounded-full dark:border-gray-700 dark:bg-[#15171C] dark:focus-within:border-gray-500 dark:focus-within:ring-gray-800"
          >
            <FaSearch className="ml-2 shrink-0 text-gray-400 min-[400px]:ml-3 min-[480px]:ml-4" />

            <input
              type="search"
              aria-label="Search events"
              placeholder="Search events, hackathons..."
              className="min-h-10 min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 min-[480px]:text-base dark:text-gray-100 dark:placeholder:text-gray-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              type="submit"
              className="flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-700 min-[400px]:gap-2 min-[400px]:px-4 min-[400px]:text-sm min-[480px]:rounded-full min-[480px]:px-6 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
            >
              Search
              <FaArrowRight className="text-[10px] min-[480px]:text-xs" />
            </button>
          </form>

          {/* Category Filters */}
          <div className="mt-5 flex w-full flex-wrap items-center justify-center gap-2 min-[480px]:mt-6">
            <span className="mr-1 text-xs text-gray-500 min-[480px]:text-sm dark:text-gray-400">
              Popular:
            </span>

            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSearch(category)}
                className={`max-w-full rounded-full border px-3 py-2 text-xs transition min-[480px]:px-4 min-[480px]:text-sm ${
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
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-gray-500 min-[480px]:mt-10 min-[480px]:gap-x-6 min-[480px]:text-sm dark:text-gray-400">
            <span className="flex items-center gap-2">
              <FaSearch className="shrink-0 text-gray-400 dark:text-gray-500" />
              Discover events
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-gray-300 min-[480px]:block dark:bg-gray-600" />

            <span className="flex items-center gap-2">
              <FaTicketAlt className="shrink-0 text-gray-400 dark:text-gray-500" />
              Book your spot
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-gray-300 min-[480px]:block dark:bg-gray-600" />

            <span className="flex items-center gap-2">
              <FaCalendarAlt className="shrink-0 text-gray-400 dark:text-gray-500" />
              Make it memorable
            </span>
          </div>
        </div>
      </section>

      {/* Events */}
      <main
        id="events"
        className="mx-auto w-full max-w-7xl flex-1 scroll-mt-24 px-3 pb-12 min-[480px]:px-5 min-[480px]:pb-16 sm:px-6 lg:px-10"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-gray-100 pb-4 min-[480px]:mb-8 min-[480px]:pb-5 dark:border-gray-800">
          <div className="min-w-0">
            <p className="mb-2 text-[10px] font-medium tracking-[0.12em] text-gray-500 min-[480px]:text-sm min-[480px]:tracking-normal dark:text-gray-400">
              FIND YOUR NEXT EXPERIENCE
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-gray-950 min-[480px]:text-3xl dark:text-white">
              {search ? "Search Results" : "Events"}
            </h2>
          </div>

          <p className="text-xs text-gray-500 min-[480px]:text-sm dark:text-gray-400">
            {events.length} {events.length === 1 ? "event" : "events"} found
          </p>
        </div>

        {loading ? (
          <div
            role="status"
            className="py-16 text-center text-sm text-gray-500 min-[480px]:py-20 dark:text-gray-400"
          >
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-12 text-center min-[480px]:px-5 min-[480px]:py-16 dark:border-gray-800 dark:bg-[#1C1F26]">
            <FaCalendarAlt className="mx-auto mb-4 text-3xl text-gray-300 dark:text-gray-600" />

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No events found
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Try another search to discover more events.
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 min-h-11 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 min-[480px]:gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:shadow-lg sm:hover:-translate-y-1 dark:border-gray-800 dark:bg-[#1C1F26] dark:hover:shadow-black/20"
              >
                {/* Event Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 min-[480px]:aspect-[16/9] dark:bg-[#252932]">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 sm:hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500">
                      <FaCalendarAlt className="text-4xl" />
                    </div>
                  )}

                  <div className="absolute right-2 top-2 max-w-[calc(100%-1rem)] rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm min-[480px]:right-3 min-[480px]:top-3 dark:bg-[#111318] dark:text-white">
                    {event.ticketPrice === 0
                      ? "Free"
                      : `₹${event.ticketPrice}`}
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex min-w-0 flex-1 flex-col p-4 min-[480px]:p-5">
                  <p className="mb-2 break-words text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {event.category || "Event"}
                  </p>

                  <h3 className="mb-4 break-words text-lg font-bold leading-snug text-gray-900 min-[480px]:text-xl dark:text-white">
                    {event.title}
                  </h3>

                  <div className="mb-5 space-y-3 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex min-w-0 items-start gap-3">
                      <FaCalendarAlt className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                      <span className="min-w-0 break-words">
                        {new Date(event.date).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex min-w-0 items-start gap-3">
                      <FaMapMarkerAlt className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                      <span className="min-w-0 break-words">
                        {event.location}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-800">
                    <p className="mb-4 break-words text-xs leading-5 text-gray-500 dark:text-gray-400">
                      {Number(event.totalSeats) > 0
                        ? `${event.availableSeats} of ${event.totalSeats} seats remaining`
                        : "View event for details"}
                    </p>

                    <Link
                      to={`/events/${event._id}`}
                      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
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
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 min-[480px]:gap-4 min-[480px]:px-5 min-[480px]:py-7 sm:flex-row sm:px-8 lg:px-10">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white"
          >
            <FaTicketAlt />
            Gatherr
          </Link>

          <p className="text-center text-xs leading-5 text-gray-500 min-[480px]:text-sm dark:text-gray-400">
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
