import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import api from "../api";

const fallbackImage =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=82";

function TourCard({ tour }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const destination = tour.destination;
  const image = destination?.image || fallbackImage;
  const price = Number(tour.price);

  function handleImageError(event) {
    const imageElement = event.currentTarget;
    if (imageElement.dataset.fallbackApplied) {
      imageElement.hidden = true;
      return;
    }
    imageElement.dataset.fallbackApplied = "true";
    imageElement.src = fallbackImage;
  }

 async function handleBookingSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  setBookingSubmitting(true);
  setBookingMessage("");

  const formData = new FormData(form);
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const travelDate = String(formData.get("travel_date") ?? "").trim();
  const touristCount = Number(formData.get("tourist"));

  if (!name || !phone || !travelDate || !Number.isFinite(touristCount) || touristCount < 1) {
    setBookingSubmitting(false);
    setBookingMessage("Please complete all booking details before submitting.");
    return;
  }

  const booking = {
    tour_id: Number(tour.id),
    name,
    phone,
    travel_date: travelDate,
    tourist: touristCount,
  };

  try {
    // If using Laravel Sanctum SPA auth, make sure your axios instance 
    // has `withCredentials: true` configured globally or per request.
    // await api.post("http://localhost:8000/api/bookings", booking);
    await api.post("bookings", booking);
    setBookingMessage("Your booking has been submitted successfully.");
    form.reset();
  } catch (error) {
    const responseData = error?.response?.data;
    let errorMessage = "We couldn't submit your booking. Please try again.";

    // Handle Laravel Validation Errors (Status 422)
    if (error?.response?.status === 422 && responseData?.errors) {
      // Grab the first validation error message from Laravel's errors object
      const firstErrorKey = Object.keys(responseData.errors)[0];
      if (firstErrorKey && responseData.errors[firstErrorKey]?.[0]) {
        errorMessage = responseData.errors[firstErrorKey][0];
      }
    } else {
      errorMessage =
        responseData?.message ||
        responseData?.error ||
        responseData?.detail ||
        (typeof responseData === "string" ? responseData : errorMessage);
    }

    setBookingMessage(
      /POST method is not supported|method is not supported/i.test(errorMessage)
        ? "The booking endpoint is currently unavailable on this server. Please check your Laravel routes (api.php vs web.php)."
        : errorMessage
    );
  } finally {
    setBookingSubmitting(false);
  }
}

  return (
    <article className="tour-card">
      <div className="tour-card-image-wrap">
        <img
          className="tour-card-image"
          src={image}
          alt={destination ? `${destination.name}, ${destination.country}` : tour.title}
          loading="lazy"
          onError={handleImageError}
        />
        <span className="tour-card-destination">
          {destination ? `${destination.name}, ${destination.country}` : "YatraPulse journey"}
        </span>
      </div>

      <div className="tour-card-content">
        <div className="tour-card-meta">
          <span>{tour.duration} {Number(tour.duration) === 1 ? "day" : "days"}</span>
          <span aria-hidden="true">/</span>
          <span>Small-group experience</span>
        </div>
        <h3>{tour.title}</h3>
        <p className="tour-card-description">
          {tour.description || "A thoughtfully planned journey, ready to explore."}
        </p>
        <div className="tour-card-bottom">
          <span className="tour-card-price-label">From</span>
          <strong>
            {Number.isFinite(price)
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(price)
              : "Contact us"}
            <small> / person</small>
          </strong>

          <button
            className="btn btn-success ms-5"
            type="button"
            onClick={() => setBookingOpen(true)}
          >
            Book Tour
          </button>

        </div>
      </div>

      {bookingOpen && createPortal(
        <div
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setBookingOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1050,
            display: "grid",
            placeItems: "center",
            padding: 16,
            background: "rgba(0, 0, 0, 0.6)",
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`booking-title-${tour.id}`}
            style={{
              position: "relative",
              width: "min(100%, 440px)",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 24,
              borderRadius: 12,
              background: "#fff",
              color: "#222",
            }}
          >
            <button
              type="button"
              aria-label="Close booking form"
              onClick={() => setBookingOpen(false)}
              style={{ position: "absolute", top: 12, right: 12 }}
            >
              &times;
            </button>
           <h2 id={`booking-title-${tour.id}`}>Book {tour.title}</h2>
<form onSubmit={handleBookingSubmit} style={{ display: "grid", gap: 12 }}>
  <label>
    <input name="tour_id" type="hidden" value={tour.id} readOnly />
  </label>
  <label>
    Name
    <input name="name" type="text" autoComplete="name" required style={{ display: "block", width: "100%" }} />
  </label>
  <label>
    Phone
    <input name="phone" type="tel" autoComplete="tel" required style={{ display: "block", width: "100%" }} />
  </label>
  <label>
    Travel date
    <input name="travel_date" type="date" required style={{ display: "block", width: "100%" }} />
  </label>
  <label>
    Tourist(s)
    <input name="tourist" type="number" min="1" step="1" defaultValue="1" required style={{ display: "block", width: "100%" }} />
  </label>
  {bookingMessage && <p role="status" style={{ color: bookingMessage.includes("success") ? "green" : "red" }}>{bookingMessage}</p>}
  <button className="btn btn-success" type="submit" disabled={bookingSubmitting}>
    {bookingSubmitting ? "Submitting..." : "Submit booking"}
  </button>
</form>
          </section>
        </div>,
        document.body
      )}
    </article>
  );
}

export default function TourCollection({
  id,
  title = "Journeys worth remembering",
  description = "Discover thoughtful trips shaped by local stories, beautiful places, and time to explore.",
  limit,
  showViewAll = false,
  className = "",
}) {
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [requestId, setRequestId] = useState(0);
  const visibleTours = limit ? tours.slice(0, limit) : tours;

  useEffect(() => {
    let isCurrent = true;

    api
      .get("/tours")
      .then(({ data }) => {
        if (isCurrent) setTours(Array.isArray(data.data) ? data.data : []);
      })
      .catch(() => {
        if (isCurrent) setHasError(true);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [requestId]);

  return (
    <section
      className={`tour-collection ${className}`.trim()}
      id={id}
      aria-labelledby={`${id || "tours"}-title`}
    >
      <div className="tour-collection-inner">
        <header className="tour-collection-heading">
          <div>
            <p className="tour-collection-eyebrow">MADE FOR THE WAY YOU TRAVEL</p>
            <h2 id={`${id || "tours"}-title`}>{title}</h2>
            <p>{description}</p>
          </div>
          {showViewAll && (
            <Link className="tour-view-all" to="/tours">
              View all tours <span aria-hidden="true">&#8594;</span>
            </Link>
          )}
        </header>

        {isLoading && (
          <p className="tour-collection-state" role="status">
            Finding your next journey...
          </p>
        )}

        {!isLoading && hasError && (
          <div className="tour-collection-state" role="alert">
            <p>We couldn&apos;t load the tours right now.</p>
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setHasError(false);
                setRequestId((value) => value + 1);
              }}
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !hasError && tours.length === 0 && (
          <p className="tour-collection-state">
            New journeys are being planned. Check back soon.
          </p>
        )}

        {!isLoading && !hasError && visibleTours.length > 0 && (
          <div className="tour-card-grid">
            {visibleTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}