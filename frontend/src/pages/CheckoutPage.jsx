import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProduct } from "../api";
import { createPayment } from "../api/paymentApi";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID;


/* =========================================================
   LOAD RAZORPAY SCRIPT
========================================================= */

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => resolve(true);

    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};


/* =========================================================
   TOKEN
========================================================= */

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("access_token")
  );
};


/* =========================================================
   PRICE FORMAT
========================================================= */

const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
};


/* =========================================================
   CHECKOUT PAGE
========================================================= */

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);

  const [products, setProducts] = useState({});

  const [loading, setLoading] = useState(true);

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [error, setError] = useState("");


  const [customerDetails, setCustomerDetails] =
    useState({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });


  /* =======================================================
     LOAD CART
  ======================================================= */

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);

        const token = getToken();

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/cart/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        console.log(
          "Checkout cart response:",
          data
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("access_token");

          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              "Unable to load cart."
          );
        }

        setCart(data);

        /* ---------------------------------------------
           LOAD PRODUCT DETAILS
        --------------------------------------------- */

        if (
          data?.items &&
          data.items.length > 0
        ) {
          const productMap = {};

          await Promise.all(
            data.items.map(async (item) => {
              try {
                const product =
                  await getProduct(
                    item.product_id
                  );

                if (product) {
                  productMap[
                    item.product_id
                  ] = product;
                }
              } catch (productError) {
                console.error(
                  "Unable to load product:",
                  item.product_id,
                  productError
                );
              }
            })
          );

          setProducts(productMap);
        }
      } catch (err) {
        console.error(
          "Checkout load error:",
          err
        );

        setError(
          err.message ||
            "Unable to load checkout."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [navigate]);


  /* =======================================================
     CUSTOMER DETAILS
  ======================================================= */

  const handleCustomerChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setCustomerDetails((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  /* =======================================================
     TOTAL
  ======================================================= */

  const getTotal = () => {
    if (
      !cart ||
      !cart.items
    ) {
      return 0;
    }

    return cart.items.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );
  };


  /* =======================================================
     VERIFY PAYMENT WITH BACKEND
  ======================================================= */

  const verifyPayment = async (
    razorpayResponse,
    paymentData
  ) => {
    const token = getToken();

    if (!token) {
      throw new Error(
        "Your login session has expired. Please login again."
      );
    }

    const response = await fetch(
      `${API_URL}/payments/verify`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          razorpay_payment_id:
            razorpayResponse.razorpay_payment_id,

          razorpay_order_id:
            razorpayResponse.razorpay_order_id ||
            paymentData.razorpay_order_id,

          razorpay_signature:
            razorpayResponse.razorpay_signature,
        }),
      }
    );

    const data = await response.json();

    console.log(
      "Payment verification response:",
      data
    );

    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem(
        "access_token"
      );

      navigate("/login");

      throw new Error(
        "Your login session has expired. Please login again."
      );
    }

    if (!response.ok) {
      throw new Error(
        data?.detail ||
          "Payment verification failed."
      );
    }

    return data;
  };


  /* =======================================================
     OPEN RAZORPAY CHECKOUT
  ======================================================= */

  const openRazorpay = (
    paymentData,
    orderData
  ) => {

    /* ---------------------------------------------
       CHECK FRONTEND RAZORPAY KEY
    --------------------------------------------- */

    if (!RAZORPAY_KEY_ID) {
      throw new Error(
        "Razorpay Key ID is missing. Please check frontend/.env"
      );
    }


    /* ---------------------------------------------
       CHECK RAZORPAY SCRIPT
    --------------------------------------------- */

    if (!window.Razorpay) {
      throw new Error(
        "Razorpay Checkout is not loaded."
      );
    }


    /* ---------------------------------------------
       AMOUNT
    --------------------------------------------- */

    const razorpayAmount =
      Number(
        paymentData.razorpay_amount
      );


    if (
      !razorpayAmount ||
      razorpayAmount <= 0
    ) {
      throw new Error(
        "Invalid Razorpay payment amount."
      );
    }


    /* ---------------------------------------------
       RAZORPAY OPTIONS
    --------------------------------------------- */

    const options = {
      key: RAZORPAY_KEY_ID,

      amount: razorpayAmount,

      currency:
        paymentData.razorpay_currency ||
        "INR",

      name:
        "Zone360",

      description:
        `Zone360 Order #${orderData.order_id}`,

      order_id:
        paymentData.razorpay_order_id,

      prefill: {
        name:
          customerDetails.name,

        contact:
          customerDetails.phone,
      },

      notes: {
        zone360_order_id:
          String(orderData.order_id),
      },

      theme: {
        color: "#1769d1",
      },


      /* ===========================================
         PAYMENT SUCCESS
      =========================================== */

      handler:
        async (response) => {

          try {

            console.log(
              "================================="
            );

            console.log(
              "RAZORPAY PAYMENT SUCCESS"
            );

            console.log(
              "Payment ID:",
              response?.razorpay_payment_id
            );

            console.log(
              "Razorpay Order ID:",
              response?.razorpay_order_id
            );

            console.log(
              "Signature received:",
              Boolean(
                response?.razorpay_signature
              )
            );

            console.log(
              "================================="
            );


            /* -------------------------------------
               VERIFY PAYMENT
            ------------------------------------- */

            const verificationResult =
              await verifyPayment(
                response,
                paymentData
              );


            console.log(
              "Payment verification successful:",
              verificationResult
            );


            /* -------------------------------------
               SUCCESS
            ------------------------------------- */

            alert(
              "Payment successful and verified!\n\n" +
                "Payment ID: " +
                response.razorpay_payment_id
            );


            navigate("/orders");

          } catch (verificationError) {

            console.error(
              "PAYMENT VERIFICATION ERROR:",
              verificationError
            );

            setError(
              verificationError.message ||
                "Payment verification failed."
            );

            alert(
              "Payment was completed, but verification failed.\n\n" +
                (
                  verificationError.message ||
                  "Please contact support."
                )
            );
          }
        },


      /* ===========================================
         MODAL CLOSED
      =========================================== */

      modal: {
        ondismiss: () => {
          console.log(
            "Razorpay checkout closed."
          );
        },
      },
    };


    /* =============================================
       DEBUG
    ============================================= */

    console.log(
      "================================="
    );

    console.log(
      "OPENING RAZORPAY CHECKOUT"
    );

    console.log(
      "Razorpay Key:",
      RAZORPAY_KEY_ID
    );

    console.log(
      "Razorpay Order ID:",
      paymentData.razorpay_order_id
    );

    console.log(
      "Razorpay Amount:",
      paymentData.razorpay_amount
    );

    console.log(
      "Razorpay Currency:",
      paymentData.razorpay_currency
    );

    console.log(
      "================================="
    );


    /* =============================================
       CREATE RAZORPAY INSTANCE
    ============================================= */

    const razorpay =
      new window.Razorpay(options);


    /* =============================================
       PAYMENT FAILED
    ============================================= */

    razorpay.on(
      "payment.failed",
      (response) => {

        console.error(
          "RAZORPAY PAYMENT FAILED:",
          response
        );

        const description =
          response?.error?.description ||
          "Payment failed. Please try again.";

        const reason =
          response?.error?.reason;

        const message =
          reason
            ? `${description} (${reason})`
            : description;

        setError(message);

        alert(message);
      }
    );


    /* =============================================
       OPEN RAZORPAY
    ============================================= */

    razorpay.open();
  };


  /* =======================================================
     START RAZORPAY PAYMENT
  ======================================================= */

  const startRazorpayPayment =
    async () => {

      try {

        setPaymentLoading(true);

        setError("");


        /* ---------------------------------------------
           TOKEN
        --------------------------------------------- */

        const token = getToken();

        if (!token) {

          navigate("/login");

          return;
        }


        /* ---------------------------------------------
           RAZORPAY KEY
        --------------------------------------------- */

        if (!RAZORPAY_KEY_ID) {

          throw new Error(
            "Razorpay Key ID is missing. Check frontend/.env"
          );
        }


        /* ---------------------------------------------
           CART
        --------------------------------------------- */

        if (
          !cart ||
          !cart.items ||
          cart.items.length === 0
        ) {

          throw new Error(
            "Your cart is empty."
          );
        }


        /* ---------------------------------------------
           CUSTOMER DETAILS
        --------------------------------------------- */

        if (
          !customerDetails.name.trim()
        ) {

          throw new Error(
            "Please enter your full name."
          );
        }


        if (
          !customerDetails.phone.trim()
        ) {

          throw new Error(
            "Please enter your phone number."
          );
        }


        if (
          !customerDetails.address.trim()
        ) {

          throw new Error(
            "Please enter your address."
          );
        }


        if (
          !customerDetails.city.trim()
        ) {

          throw new Error(
            "Please enter your city."
          );
        }


        if (
          !customerDetails.state.trim()
        ) {

          throw new Error(
            "Please enter your state."
          );
        }


        if (
          !customerDetails.pincode.trim()
        ) {

          throw new Error(
            "Please enter your pincode."
          );
        }


        /* ---------------------------------------------
           PINCODE VALIDATION
        --------------------------------------------- */

        if (
          !/^\d{6}$/.test(
            customerDetails.pincode.trim()
          )
        ) {

          throw new Error(
            "Please enter a valid 6-digit pincode."
          );
        }


        /* =============================================
           1. CREATE ZONE360 ORDER
        ============================================= */

        console.log(
          "================================="
        );

        console.log(
          "CREATING ZONE360 ORDER"
        );

        console.log(
          "================================="
        );


        const orderResponse =
          await fetch(
            `${API_URL}/orders/`,
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );


        const orderData =
          await orderResponse.json();


        console.log(
          "Zone360 Order Response:",
          orderData
        );


        /* ---------------------------------------------
           TOKEN EXPIRED
        --------------------------------------------- */

        if (
          orderResponse.status === 401
        ) {

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "access_token"
          );

          navigate("/login");

          return;
        }


        /* ---------------------------------------------
           ORDER ERROR
        --------------------------------------------- */

        if (
          !orderResponse.ok
        ) {

          throw new Error(
            orderData?.detail ||
              "Unable to create order."
          );
        }


        /* =============================================
           2. CREATE RAZORPAY ORDER
        ============================================= */

        console.log(
          "================================="
        );

        console.log(
          "CREATING RAZORPAY ORDER"
        );

        console.log(
          "Zone360 Order ID:",
          orderData.order_id
        );

        console.log(
          "Amount:",
          orderData.total_amount
        );

        console.log(
          "================================="
        );


        const paymentData =
          await createPayment(
            orderData.order_id,
            "razorpay"
          );


        console.log(
          "Razorpay Payment Response:",
          paymentData
        );


        /* ---------------------------------------------
           CHECK RAZORPAY ORDER ID
        --------------------------------------------- */

        if (
          !paymentData?.razorpay_order_id
        ) {

          throw new Error(
            "Razorpay Order ID was not returned by backend."
          );
        }


        /* =============================================
           3. LOAD RAZORPAY
        ============================================= */

        const razorpayLoaded =
          await loadRazorpayScript();


        if (
          !razorpayLoaded
        ) {

          throw new Error(
            "Unable to load Razorpay Checkout."
          );
        }


        /* =============================================
           4. OPEN RAZORPAY
        ============================================= */

        openRazorpay(
          paymentData,
          orderData
        );

      } catch (err) {

        console.error(
          "Payment start error:",
          err
        );

        setError(
          err.message ||
            "Unable to start payment."
        );

        alert(
          err.message ||
            "Unable to start payment."
        );

      } finally {

        setPaymentLoading(false);
      }
    };


  /* =======================================================
     LOADING SCREEN
  ======================================================= */

  if (loading) {

    return (
      <section className="inner-page">

        <div className="container">

          <div className="page-heading">

            <span>
              SECURE CHECKOUT
            </span>

            <h1>
              Checkout
            </h1>

            <p>
              Loading your order...
            </p>

          </div>

        </div>

      </section>
    );
  }


  /* =======================================================
     MAIN CHECKOUT
  ======================================================= */

  return (

    <section
      className="inner-page checkout-page"
    >

      <div className="container">

        {/* ============================================
            PAGE HEADER
        ============================================ */}

        <div className="page-heading">

          <span>
            SECURE CHECKOUT
          </span>

          <h1>
            Checkout
          </h1>

          <p>
            Complete your details and
            proceed with secure payment.
          </p>

        </div>


        {/* ============================================
            ERROR
        ============================================ */}

        {error && (

          <div
            className="error-message"
            style={{
              marginBottom: "24px",
              padding: "16px",
              borderRadius: "8px",
              background: "#fee2e2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
            }}
          >
            {error}
          </div>

        )}


        {/* ============================================
            CHECKOUT GRID
        ============================================ */}

        <div
          className="checkout-grid"
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 2fr) minmax(280px, 1fr)",
            gap: "30px",
          }}
        >

          {/* ==========================================
              LEFT SIDE
          ========================================== */}

          <div>

            {/* ========================================
                CUSTOMER DETAILS
            ======================================== */}

            <div
              className="checkout-card"
            >

              <h2>
                Customer Details
              </h2>


              {/* NAME */}

              <div
                className="form-group"
              >

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    customerDetails.name
                  }
                  onChange={
                    handleCustomerChange
                  }
                  placeholder="Full Name"
                  autoComplete="name"
                />

              </div>


              {/* PHONE */}

              <div
                className="form-group"
              >

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={
                    customerDetails.phone
                  }
                  onChange={
                    handleCustomerChange
                  }
                  placeholder="Phone Number"
                  autoComplete="tel"
                />

              </div>


              {/* ADDRESS */}

              <div
                className="form-group"
              >

                <label>
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={
                    customerDetails.address
                  }
                  onChange={
                    handleCustomerChange
                  }
                  placeholder="Address"
                  autoComplete="street-address"
                />

              </div>


              {/* CITY */}

              <div
                className="form-group"
              >

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={
                    customerDetails.city
                  }
                  onChange={
                    handleCustomerChange
                  }
                  placeholder="City"
                  autoComplete="address-level2"
                />

              </div>


              {/* STATE */}

              <div
                className="form-group"
              >

                <label>
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={
                    customerDetails.state
                  }
                  onChange={
                    handleCustomerChange
                  }
                  placeholder="State"
                  autoComplete="address-level1"
                />

              </div>


              {/* PINCODE */}

              <div
                className="form-group"
              >

                <label>
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={
                    customerDetails.pincode
                  }
                  onChange={
                    handleCustomerChange
                  }
                  placeholder="Pincode"
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="postal-code"
                />

              </div>

            </div>


            {/* ========================================
                PAYMENT
            ======================================== */}

            <div
              className="checkout-card"
              style={{
                marginTop: "24px",
              }}
            >

              <h2>
                Payment
              </h2>


              <div
                style={{
                  padding: "16px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  border:
                    "1px solid #e2e8f0",
                }}
              >

                🔒 Secured by{" "}

                <strong>
                  Razorpay
                </strong>

              </div>


              <button
                type="button"
                className="primary-button"
                onClick={
                  startRazorpayPayment
                }
                disabled={
                  paymentLoading ||
                  !cart ||
                  !cart.items ||
                  cart.items.length === 0
                }
                style={{
                  width: "100%",
                }}
              >

                {paymentLoading
                  ? "Processing..."
                  : `Pay ${formatPrice(
                      getTotal()
                    )} →`}

              </button>

            </div>

          </div>


          {/* ==========================================
              RIGHT SIDE
          ========================================== */}

          <div>

            <div
              className="checkout-card"
            >

              <h2>
                Order Summary
              </h2>


              {cart &&
                cart.items &&
                cart.items.map(
                  (item) => {

                    const product =
                      products[
                        item.product_id
                      ];

                    return (

                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          gap: "20px",
                          padding:
                            "14px 0",
                          borderBottom:
                            "1px solid #e5e7eb",
                        }}
                      >

                        <div>

                          <strong>

                            {product
                              ? product.name
                              : `Product #${item.product_id}`}

                          </strong>


                          <div
                            style={{
                              marginTop: "4px",
                              color: "#64748b",
                            }}
                          >

                            {formatPrice(
                              item.price
                            )}

                            {" × "}

                            {item.quantity}

                          </div>

                        </div>


                        <strong>

                          {formatPrice(
                            Number(
                              item.price || 0
                            ) *
                              Number(
                                item.quantity || 0
                              )
                          )}

                        </strong>

                      </div>
                    );
                  }
                )}


              {/* ======================================
                  TOTAL
              ====================================== */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  paddingTop: "20px",
                  marginTop: "10px",
                }}
              >

                <strong
                  style={{
                    fontSize: "20px",
                  }}
                >
                  Total
                </strong>


                <strong
                  style={{
                    fontSize: "22px",
                  }}
                >
                  {formatPrice(
                    getTotal()
                  )}
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};


export default CheckoutPage;