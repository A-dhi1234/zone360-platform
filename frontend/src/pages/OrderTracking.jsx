import React, { useState } from "react";
import { Link } from "react-router-dom";


// =====================================================
// ORDER TRACKING
// =====================================================

function OrderTracking() {

  const [orderId, setOrderId] = useState("");

  const [order, setOrder] = useState(null);

  const [error, setError] = useState("");


  // ===================================================
  // DEMO ORDER DATA
  // ===================================================

  const demoOrders = {

    "ZO-10001": {
      id: "ZO-10001",
      product: "GPS Tracking Devices",
      quantity: 5,
      status: "Processing",
    },

    "ZO-10002": {
      id: "ZO-10002",
      product: "CCTV Security Systems",
      quantity: 10,
      status: "Installation Scheduled",
    },

  };


  // ===================================================
  // TRACK ORDER
  // ===================================================

  const handleTrackOrder = (
    event
  ) => {

    event.preventDefault();

    const cleanedId =
      orderId.trim().toUpperCase();


    setError("");

    setOrder(null);


    if (!cleanedId) {

      setError(
        "Please enter your Order ID."
      );

      return;

    }


    const foundOrder =
      demoOrders[cleanedId];


    if (!foundOrder) {

      setError(
        "Order not found. Try ZO-10001 or ZO-10002."
      );

      return;

    }


    setOrder(foundOrder);

  };


  // ===================================================
  // STATUS CLASS
  // ===================================================

  const getStatusClass = (
    step,
    currentStatus
  ) => {

    const statusOrder = [
      "Order Confirmed",
      "Payment Received",
      "Processing",
      "Installation Scheduled",
      "Installation Completed",
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
            ORDER TRACKING
          </span>

          <h1>
            Track Your Order
          </h1>

          <p>
            Enter your Order ID to check
            the current status of your order.
          </p>

        </div>


        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="tracking-search-card">

          <form
            onSubmit={handleTrackOrder}
            className="tracking-search-form"
          >

            <div className="tracking-input">

              <label htmlFor="order-id">
                Order ID
              </label>

              <input
                id="order-id"
                type="text"
                value={orderId}
                onChange={(event) =>
                  setOrderId(
                    event.target.value
                  )
                }
                placeholder="Example: ZO-10001"
              />

            </div>


            <button
              type="submit"
              className="primary-button"
            >
              Track Order
            </button>

          </form>


          <p className="tracking-demo-note">
            Demo IDs: ZO-10001 or ZO-10002
          </p>


          {error && (

            <div className="tracking-error">
              {error}
            </div>

          )}

        </div>


        {/* =================================================
            ORDER RESULT
        ================================================= */}

        {order && (

          <div className="tracking-result">

            {/* =================================================
                ORDER SUMMARY
            ================================================= */}

            <div className="tracking-summary">

              <div>

                <span>
                  ORDER
                </span>

                <h2>
                  #{order.id}
                </h2>

              </div>


              <div className="tracking-product-summary">

                <span>
                  PRODUCT
                </span>

                <strong>
                  {order.product}
                </strong>

                <small>
                  Quantity: {order.quantity}
                </small>

              </div>

            </div>


            {/* =================================================
                ORDER TIMELINE
            ================================================= */}

            <div className="tracking-timeline">

              <TrackingStep
                number="01"
                title="Order Confirmed"
                description="Your order has been confirmed."
                status={getStatusClass(
                  "Order Confirmed",
                  order.status
                )}
              />


              <TrackingStep
                number="02"
                title="Payment Received"
                description="Payment has been confirmed."
                status={getStatusClass(
                  "Payment Received",
                  order.status
                )}
              />


              <TrackingStep
                number="03"
                title="Processing"
                description="Your order is being processed."
                status={getStatusClass(
                  "Processing",
                  order.status
                )}
              />


              <TrackingStep
                number="04"
                title="Installation Scheduled"
                description="Installation/service has been scheduled."
                status={getStatusClass(
                  "Installation Scheduled",
                  order.status
                )}
              />


              <TrackingStep
                number="05"
                title="Installation Completed"
                description="Your installation/service is completed."
                status={getStatusClass(
                  "Installation Completed",
                  order.status
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

          <Link to="/products">
            ← Continue Shopping
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


export default OrderTracking;