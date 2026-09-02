import React, { useState } from "react";
import { Link } from "react-router-dom";


// =====================================================
// QUOTE TRACKING
// =====================================================

function QuoteTracking() {

  const [quoteId, setQuoteId] = useState("");

  const [quote, setQuote] = useState(null);

  const [error, setError] = useState("");


  // ===================================================
  // DEMO QUOTE DATA
  // ===================================================

  const demoQuotes = {
    "ZQ-10001": {
      id: "ZQ-10001",
      product: "GPS Tracking Devices",
      quantity: 5,
      customer: "Demo Customer",
      status: "Sales Team Contact",
    },

    "ZQ-10002": {
      id: "ZQ-10002",
      product: "CCTV Security Systems",
      quantity: 10,
      customer: "Demo Customer",
      status: "Quotation Prepared",
    },
  };


  // ===================================================
  // TRACK QUOTE
  // ===================================================

  const handleTrackQuote = (event) => {

    event.preventDefault();

    const cleanedId =
      quoteId.trim().toUpperCase();


    setError("");

    setQuote(null);


    if (!cleanedId) {

      setError(
        "Please enter your Quote ID."
      );

      return;

    }


    const foundQuote =
      demoQuotes[cleanedId];


    if (!foundQuote) {

      setError(
        "Quote not found. Try ZQ-10001 or ZQ-10002."
      );

      return;

    }


    setQuote(foundQuote);

  };


  // ===================================================
  // STATUS CHECK
  // ===================================================

  const getStatusClass = (
    step,
    currentStatus
  ) => {

    const statusOrder = [
      "Request Submitted",
      "Requirement Reviewed",
      "Sales Team Contact",
      "Quotation Prepared",
      "Quote Accepted",
    ];


    const currentIndex =
      statusOrder.indexOf(
        currentStatus
      );


    const stepIndex =
      statusOrder.indexOf(step);


    if (stepIndex < currentIndex) {
      return "completed";
    }


    if (stepIndex === currentIndex) {
      return "active";
    }


    return "";

  };


  return (

    <section className="inner-page tracking-page">

      <div className="container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="page-heading">

          <span>
            QUOTE TRACKING
          </span>

          <h1>
            Track Your Quote
          </h1>

          <p>
            Enter your Quote ID to check
            the current status of your request.
          </p>

        </div>


        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="tracking-search-card">

          <form
            onSubmit={handleTrackQuote}
            className="tracking-search-form"
          >

            <div className="tracking-input">

              <label htmlFor="quote-id">
                Quote ID
              </label>

              <input
                id="quote-id"
                type="text"
                value={quoteId}
                onChange={(event) =>
                  setQuoteId(
                    event.target.value
                  )
                }
                placeholder="Example: ZQ-10001"
              />

            </div>


            <button
              type="submit"
              className="primary-button"
            >
              Track Quote
            </button>

          </form>


          <p className="tracking-demo-note">
            Demo IDs: ZQ-10001 or ZQ-10002
          </p>


          {error && (

            <div className="tracking-error">
              {error}
            </div>

          )}

        </div>


        {/* =================================================
            QUOTE RESULT
        ================================================= */}

        {quote && (

          <div className="tracking-result">

            {/* =================================================
                QUOTE SUMMARY
            ================================================= */}

            <div className="tracking-summary">

              <div>

                <span>
                  QUOTE REQUEST
                </span>

                <h2>
                  {quote.id}
                </h2>

              </div>


              <div className="tracking-product-summary">

                <span>
                  PRODUCT
                </span>

                <strong>
                  {quote.product}
                </strong>

                <small>
                  Quantity: {quote.quantity}
                </small>

              </div>

            </div>


            {/* =================================================
                TIMELINE
            ================================================= */}

            <div className="tracking-timeline">

              <TrackingStep
                number="01"
                title="Request Submitted"
                description="Your quote request has been received."
                status={getStatusClass(
                  "Request Submitted",
                  quote.status
                )}
              />


              <TrackingStep
                number="02"
                title="Requirement Reviewed"
                description="Our team is reviewing your requirement."
                status={getStatusClass(
                  "Requirement Reviewed",
                  quote.status
                )}
              />


              <TrackingStep
                number="03"
                title="Sales Team Contact"
                description="Our sales team will contact you."
                status={getStatusClass(
                  "Sales Team Contact",
                  quote.status
                )}
              />


              <TrackingStep
                number="04"
                title="Quotation Prepared"
                description="Your quotation is being prepared."
                status={getStatusClass(
                  "Quotation Prepared",
                  quote.status
                )}
              />


              <TrackingStep
                number="05"
                title="Quote Accepted"
                description="Quotation accepted by the customer."
                status={getStatusClass(
                  "Quote Accepted",
                  quote.status
                )}
                last
              />

            </div>

          </div>

        )}


        {/* =================================================
            BACK
        ================================================= */}

        <div className="tracking-back">

          <Link to="/quote">
            ← Request a New Quote
          </Link>

        </div>

      </div>

    </section>

  );

}


// =====================================================
// TRACKING STEP
// =====================================================

function TrackingStep({
  number,
  title,
  description,
  status,
  last = false,
}) {

  return (

    <div
      className={
        `tracking-step ${status} ${
          last ? "last" : ""
        }`
      }
    >

      <div className="tracking-step-line" />


      <div className="tracking-step-number">

        {status === "completed"
          ? "✓"
          : number}

      </div>


      <div className="tracking-step-content">

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>

    </div>

  );

}


export default QuoteTracking;