import { useEffect, useState } from "react";
import api from "../api";

const formSchemas = {
  booking: {
    title: "New booking",
    description: "Record a guest reservation and its trip details.",
    endpoint: "/addbooking",
    sections: [
      {
        title: "Reservation details",
        hint: "Tour and guest information",
        fields: [
          // { name: "tour_id", label: "Tour", type: "tour", required: true },
          
        ],
      },
    ],
  },
  itinerary: {
    title: "New itinerary day",
    description: "Add a day-by-day plan to one of your tours.",
    endpoint: "/additineraries",
    sections: [
      {
        title: "Day details",
        hint: "Choose a tour and describe the day",
        fields: [
          { name: "tour_id", label: "Tour", type: "tour", required: true },
          {
            name: "day_number",
            label: "Day number",
            type: "number",
            min: 1,
            required: true,
            placeholder: "1",
          },
          {
            name: "title",
            label: "Day title",
            type: "text",
            required: true,
            placeholder: "e.g. Arrival and city walk",
          },
          {
            name: "description",
            label: "Plan and activities",
            type: "textarea",
            required: true,
            wide: true,
            placeholder:
              "Describe the schedule, places, and activities for this day.",
          },
        ],
      },
    ],
  },
  tour: {
    title: "Create a tour",
    description: "Build a bookable experience for your destination.",
    endpoint: "/addtour",
    sections: [
      {
        title: "Tour overview",
        hint: "The essential information guests will see",
        fields: [
          {
            name: "destination_id",
            label: "Destination",
            type: "destination",
            required: true,
          },
          {
            name: "title",
            label: "Tour title",
            type: "text",
            required: true,
            placeholder: "e.g. Kyoto cultural escape",
          },
          {
            name: "slug",
            label: "URL slug",
            type: "text",
            required: true,
            placeholder: "kyoto-cultural-escape",
          },
          {
            name: "price",
            label: "Price per traveler",
            type: "number",
            min: 0,
            step: "0.01",
            required: true,
            placeholder: "0.00",
            prefix: "$",
          },
          {
            name: "duration",
            label: "Duration in days",
            type: "number",
            min: 1,
            required: true,
            placeholder: "1",
          },
          {
            name: "description",
            label: "Tour description",
            type: "textarea",
            required: true,
            wide: true,
            placeholder: "What makes this experience memorable?",
          },
        ],
      },
      {
        title: "What is included",
        hint: "Set clear expectations for travelers",
        fields: [
          {
            name: "inclusions",
            label: "Included",
            type: "textarea",
            required: true,
            placeholder: "Guided tour, breakfast, local transfers",
          },
          {
            name: "exclusions",
            label: "Not included",
            type: "textarea",
            required: true,
            placeholder: "Flights, travel insurance",
          },
        ],
      },
    ],
  },
  destination: {
    title: "Add a destination",
    description: "Create a place that your guests can explore.",
    endpoint: "/adddestination",
    sections: [
      {
        title: "Destination details",
        hint: "Location, imagery, and a short introduction",
        fields: [
          {
            name: "name",
            label: "Destination name",
            type: "text",
            required: true,
            placeholder: "e.g. Kyoto",
          },
          {
            name: "country",
            label: "Country",
            type: "text",
            required: true,
            placeholder: "e.g. Japan",
          },
          {
            name: "image",
            label: "Image URL",
            type: "url",
            required: true,
            wide: true,
            placeholder: "https://example.com/destination.jpg",
          },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            required: true,
            wide: true,
            placeholder: "Introduce the destination and what makes it special.",
          },
        ],
      },
    ],
  },
};

const listEndpoints = {
  booking: "/bookings",
  itinerary: "/itineraries",
  tour: "/tours",
  destination: "/destinations",
};

function FieldControl({ field, destinations, tours, error, onChange }) {
  const commonProps = {
    id: field.name,
    name: field.name,
    required: field.required,
    min: field.min,
    max: field.max,
    step: field.step,
    maxLength: field.type === "url" ? 2048 : 5000,
    placeholder: field.placeholder,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${field.name}-error` : undefined,
    onChange,
  };

  if (field.type === "textarea") {
    return <textarea {...commonProps} rows="4" />;
  }

  if (
    field.type === "select" ||
    field.type === "tour" ||
    field.type === "destination"
  ) {
    const options =
      field.options ||
      (field.type === "tour"
        ? tours.map((tour) => [
            tour.id,
            `#${tour.id} · ${tour.title} · ${tour.duration} days`,
          ])
        : destinations.map((destination) => [
            destination.id,
            `#${destination.id} · ${destination.name}, ${destination.country}`,
          ]));

    return (
      <select {...commonProps} defaultValue={field.defaultValue || ""}>
        <option value="" disabled>
          {field.type === "destination" && destinations.length === 0
            ? "No destinations available"
            : `Select ${field.label.toLowerCase()}`}
        </option>
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    );
  }

  return <input {...commonProps} type={field.type} />;
}

export default function EntityForm({ entity }) {
  const schema = formSchemas[entity];
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [recordsError, setRecordsError] = useState(false);
  const [recordsRevision, setRecordsRevision] = useState(0);
  const needsDestinations = schema.sections.some((section) =>
    section.fields.some((field) => field.type === "destination"),
  );
  const needsTours = schema.sections.some((section) =>
    section.fields.some((field) => field.type === "tour"),
  );
  const listEndpoint = listEndpoints[entity];

  useEffect(() => {
    if (needsDestinations) {
      api
        .get("/destinations")
        .then(({ data }) => setDestinations(data.data || []))
        .catch(() =>
          setFeedback({
            type: "error",
            text: "Destinations could not be loaded. Check the API connection and try again.",
          }),
        );
    }
    if (needsTours) {
      api
        .get("/tours")
        .then(({ data }) => setTours(data.data || []))
        .catch(() =>
          setFeedback({
            type: "error",
            text: "Tours could not be loaded. Check the API connection and try again.",
          }),
        );
    }
  }, [needsDestinations, needsTours]);

  useEffect(() => {
    let isCurrent = true;

    api
      .get(listEndpoint)
      .then(({ data }) => {
        if (isCurrent) {
          setRecords(data.data || []);
          setRecordsError(false);
        }
      })
      .catch(() => {
        if (isCurrent) setRecordsError(true);
      })
      .finally(() => {
        if (isCurrent) setRecordsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [listEndpoint, recordsRevision]);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    setIsSaving(true);
    setFeedback(null);
    setFieldErrors({});

    const payload = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    );

    try {
      const { data } = await api.post(schema.endpoint, payload);
      form.reset();
      setFeedback({
        type: "success",
        text: data.message || `${schema.title} saved successfully.`,
      });
      setRecordsRevision((revision) => revision + 1);
    } catch (error) {
      const response = error.response?.data;
      setFieldErrors(response?.errors || {});
      setFeedback({
        type: "error",
        text:
          response?.message ||
          "Could not save this record. Check your connection and try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <section
        className="entity-form-panel"
        aria-labelledby="entity-form-title"
      >
        <header className="entity-form-heading">
          <div>
            <p className="entity-eyebrow">
              YATRAPULSE <span>/</span> CONTENT MANAGEMENT
            </p>
            <h2 id="entity-form-title">{schema.title}</h2>
            <p>{schema.description}</p>
          </div>
          <span className="form-step">
            01 <span>/</span> 01
          </span>
        </header>

        <form
          id="entity-form"
          className="entity-form"
          onSubmit={handleSubmit}
          noValidate
        >
          {schema.sections.map((section, sectionIndex) => (
            <fieldset className="entity-form-section" key={section.title}>
              <legend>
                <span className="section-index">
                  {String(sectionIndex + 1).padStart(2, "0")}
                </span>
                <span>
                  <strong>{section.title}</strong>
                  <small>{section.hint}</small>
                </span>
              </legend>
              <div className="entity-fields">
                {section.fields.map((field) => (
                  <label
                    className={`entity-field${field.wide ? " field-wide" : ""}`}
                    htmlFor={field.name}
                    key={field.name}
                  >
                    <span>
                      {field.label}
                      {field.required && <i aria-hidden="true"> *</i>}
                    </span>
                    {field.prefix ? (
                      <span className="input-with-prefix">
                        <b aria-hidden="true">{field.prefix}</b>
                        <FieldControl
                          field={field}
                          destinations={destinations}
                          tours={tours}
                          error={fieldErrors[field.name]?.[0]}
                          onChange={() => setFeedback(null)}
                        />
                      </span>
                    ) : (
                      <FieldControl
                        field={field}
                        destinations={destinations}
                        tours={tours}
                        error={fieldErrors[field.name]?.[0]}
                        onChange={() => setFeedback(null)}
                      />
                    )}
                    {fieldErrors[field.name]?.[0] && (
                      <small className="field-error" id={`${field.name}-error`}>
                        {fieldErrors[field.name][0]}
                      </small>
                    )}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          {feedback && (
            <p
              className={`form-feedback ${feedback.type}`}
              role={feedback.type === "error" ? "alert" : "status"}
            >
              {feedback.text}
            </p>
          )}

          <footer className="entity-form-footer">
            <button
              className="form-reset"
              type="reset"
              onClick={() => {
                setFieldErrors({});
                setFeedback(null);
              }}
            >
              Reset fields
            </button>
            <div className="form-actions">
              <button
                className="form-secondary"
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save & add another"}
              </button>
              <button
                className="form-primary"
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : `Save ${entity}`}
              </button>
            </div>
          </footer>
        </form>
      </section>

      <section className="records-panel" aria-labelledby="records-title">
        <header className="records-heading">
          <div>
            <p className="entity-eyebrow">DATA COLLECTION</p>
            <h2 id="records-title">
              Saved {entity === "itinerary" ? "itineraries" : `${entity}s`}
            </h2>
          </div>
          <span className="record-count">
            {recordsLoading ? "..." : records.length}
          </span>
        </header>
        {recordsLoading ? (
          <p className="records-empty">Loading records...</p>
        ) : recordsError ? (
          <p className="records-empty records-error">
            Records could not be loaded. Check the API connection and refresh.
          </p>
        ) : records.length ? (
          entity === "booking" ? (
            <BookingTable records={records} />
          ) : (
            <div className="record-grid">
              {records.map((record) => (
                <RecordCard entity={entity} record={record} key={record.id} />
              ))}
            </div>
          )
        ) : (
          <p className="records-empty">
            No saved {entity === "itinerary" ? "itineraries" : `${entity}s`}{" "}
            yet.
          </p>
        )}
      </section>
    </>
  );
}


//bookings table
function BookingTable({ records }) {
  return (
    <div className="records-table-wrapper">
      <table className="records-table">
        <thead>
          <tr>
            <th scope="col">Booking</th>
            <th scope="col">Guest</th>
            <th scope="col">Phone</th>
            <th scope="col">Tour</th>
            <th scope="col">Travel date</th>
            <th scope="col">Travelers</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            return (
              <tr key={record.id}>
                <td>#{record.id}</td>
                <td>{record.name || "—"}</td>
                <td>{record.phone || "—"}</td>
                <td>
                  {record.tour?.title || `Tour #${record.tour_id ?? "—"}`}
                </td>
                <td>{record.travel_date || "—"}</td>
                <td>{record.tourist ?? "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RecordCard({ entity, record }) {
  if (entity === "destination") {
    return (
      <article className="record-card destination-record">
        <div className="record-image">
          {record.image && <img src={record.image} alt="" loading="lazy" />}
        </div>
        <div className="record-card-content">
          <span className="record-id">DESTINATION #{record.id}</span>
          <h3>{record.name}</h3>
          <p className="record-location">{record.country}</p>
          <p className="record-description">{record.description}</p>
        </div>
      </article>
    );
  }

  if (entity === "tour") {
    return (
      <article className="record-card">
        <div className="record-card-content">
          <span className="record-id">TOUR #{record.id}</span>
          <h3>{record.title}</h3>
          <p className="record-location">
            {record.destination?.name ||
              `Destination #${record.destination_id}`}
          </p>
          <p className="record-description">{record.description}</p>
          <div className="record-facts">
            <span>${Number(record.price).toFixed(2)}</span>
            <span>{record.duration} days</span>
          </div>
        </div>
      </article>
    );
  }

  if (entity === "itinerary") {
    return (
      <article className="record-card">
        <div className="record-card-content">
          <span className="record-id">ITINERARY #{record.id}</span>
          <h3>
            Day {record.day_number}: {record.title}
          </h3>
          <p className="record-location">
            {record.tour?.title || `Tour #${record.tour_id}`}
          </p>
          <p className="record-description">{record.description}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="record-card">
      <div className="record-card-content">
        <div className="record-card-topline">
          <span className="record-id">BOOKING #{record.id}</span>
          <span className={`record-status status-${record.status}`}>
            {record.status}
          </span>
        </div>
        <h3>{record.tour?.title || `Tour #${record.tour_id}`}</h3>
        <p className="record-location">
          {record.travel_date}
        </p>
        <div className="record-facts">
          <span>{record.total_travelers} travelers</span>
          <span>${Number(record.total_price).toFixed(2)}</span>
        </div>
      </div>
    </article>
  );
}
