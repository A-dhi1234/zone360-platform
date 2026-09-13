import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createPayment } from "../api/paymentApi";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

function CheckoutPage() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [cart, setCart] = useState(null);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // CUSTOMER DETAILS
  // =====================================================

  const [customerDetails, setCustomerDetails] =
    useState({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token")
    );
  };

  // =====================================================
  // LOAD CART + PRODUCTS
  // =====================================================

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          navigate("/login");
          return;
        }

        // -----------------------------------------------
        // GET CART
        // -----------------------------------------------

        const cartResponse = await fetch(
          `${API_URL}/cart/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (cartResponse.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("access_token");

          navigate("/login");
          return;
        }

        const cartData =
          await cartResponse.json();

        console.log(
          "Checkout cart response:",
          cartData
        );

        if (!cartResponse.ok) {
          throw new Error(
            cartData.detail ||
              "Unable to load cart."
          );
        }

        setCart(cartData);

        // -----------------------------------------------
        // CHECK EMPTY CART
        // -----------------------------------------------

        if (
          !cartData.items ||
          cartData.items.length === 0
        ) {
          setError(
            "Your cart is empty."
          );

          return;
        }

        // -----------------------------------------------
        // GET PRODUCTS
        // -----------------------------------------------

        const productsResponse =
          await fetch(
            `${API_URL}/products/`
          );

        const productsData =
          await productsResponse.json();

        if (!productsResponse.ok) {
          throw new Error(
            "Unable to load products."
          );
        }

        setProducts(productsData);

      } catch (err) {
        console.error(
          "Checkout loading error:",
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

    loadCheckoutData();

  }, [navigate]);

  // =====================================================
  // CUSTOMER INPUT CHANGE
  // =====================================================

  const handleCustomerChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setCustomerDetails(
      (current) => ({
        ...current,
        [name]: value,
      })
    );
  };

  // =====================================================
  // FIND PRODUCT
  // =====================================================

  const getProduct = (
    productId
  ) => {
    return products.find(
      (product) =>
        product.id === productId
    );
  };

  // =====================================================
  // CALCULATE TOTAL
  // =====================================================

  const getTotal = () => {
    if (!cart) {
      return 0;
    }

    return cart.items.reduce(
      (total, item) => {
        return (
          total +
          item.price *
            item.quantity
        );
      },
      0
    );
  };

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (
    price
  ) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(price);
  };

  // =====================================================
  // LOAD RAZORPAY SCRIPT
  // =====================================================

  const loadRazorpayScript = () => {
    return new Promise(
      (resolve) => {

        // Already loaded
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script =
          document.createElement(
            "script"
          );

        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => {
          console.log(
            "Razorpay script loaded."
          );

          resolve(true);
        };

        script.onerror = () => {
          console.error(
            "Failed to load Razorpay script."
          );

          resolve(false);
        };

        document.body.appendChild(
          script
        );
      }
    );
  };

  // =====================================================
  // VERIFY PAYMENT
  // =====================================================

  const verifyPayment = async (
    razorpayResponse,
    paymentData
  ) => {

    const token = getToken();

    if (!token) {
      throw new Error(
        "Authentication token not found. Please login again."
      );
    }

    // -----------------------------------------------
    // EXTRACT RAZORPAY RESPONSE
    // -----------------------------------------------

    const razorpayPaymentId =
      razorpayResponse?.razorpay_payment_id;

    const razorpayOrderId =
      razorpayResponse?.razorpay_order_id ||
      paymentData?.razorpay_order_id;

    const razorpaySignature =
      razorpayResponse?.razorpay_signature;

    console.log(
      "================================="
    );

    console.log(
      "PAYMENT VERIFICATION"
    );

    console.log(
      "Razorpay Payment ID:",
      razorpayPaymentId
    );

    console.log(
      "Razorpay Order ID:",
      razorpayOrderId
    );

    console.log(
      "Razorpay Signature:",
      razorpaySignature
    );

    console.log(
      "================================="
    );

    // -----------------------------------------------
    // VALIDATE PAYMENT ID
    // -----------------------------------------------

    if (!razorpayPaymentId) {
      throw new Error(
        "Razorpay Payment ID is missing."
      );
    }

    // -----------------------------------------------
    // VALIDATE ORDER ID
    // -----------------------------------------------

    if (!razorpayOrderId) {
      throw new Error(
        "Razorpay Order ID is missing."
      );
    }

    // -----------------------------------------------
    // VALIDATE SIGNATURE
    // -----------------------------------------------

    if (!razorpaySignature) {
      throw new Error(
        "Razorpay payment signature is missing."
      );
    }

    // -----------------------------------------------
    // SEND TO BACKEND
    // -----------------------------------------------

    console.log(
      "Sending payment verification to backend..."
    );

    const verifyResponse =
      await fetch(
        `${API_URL}/payments/verify`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            razorpay_payment_id:
              razorpayPaymentId,

            razorpay_order_id:
              razorpayOrderId,

            razorpay_signature:
              razorpaySignature,
          }),
        }
      );

    const verifyData =
      await verifyResponse.json();

    console.log(
      "Backend verification response:",
      verifyData
    );

    // -----------------------------------------------
    // BACKEND ERROR
    // -----------------------------------------------

    if (!verifyResponse.ok) {
      throw new Error(
        verifyData.detail ||
          "Payment verification failed."
      );
    }

    // -----------------------------------------------
    // SUCCESS
    // -----------------------------------------------

    return verifyData;
  };

  // =====================================================
  // OPEN RAZORPAY
  // =====================================================

  const openRazorpay = (
    paymentData,
    orderData
  ) => {

    // -----------------------------------------------
    // GET FRONTEND RAZORPAY KEY
    // -----------------------------------------------

    const razorpayKey =
      import.meta.env
        .VITE_RAZORPAY_KEY_ID;

    // -----------------------------------------------
    // CHECK KEY
    // -----------------------------------------------

    if (!razorpayKey) {

      setError(
        "Razorpay Key ID is missing. Add VITE_RAZORPAY_KEY_ID to the frontend .env file."
      );

      return;
    }

    // -----------------------------------------------
    // CHECK RAZORPAY
    // -----------------------------------------------

    if (!window.Razorpay) {

      setError(
        "Razorpay Checkout could not be loaded."
      );

      return;
    }

    // -----------------------------------------------
    // CHECK BACKEND PAYMENT DATA
    // -----------------------------------------------

    if (
      !paymentData?.razorpay_order_id
    ) {
      setError(
        "Razorpay Order ID is missing from backend response."
      );

      return;
    }

    if (
      !paymentData?.razorpay_amount
    ) {
      setError(
        "Razorpay amount is missing from backend response."
      );

      return;
    }

    // =================================================
    // RAZORPAY OPTIONS
    // =================================================

    const options = {

      // ---------------------------------------------
      // RAZORPAY TEST KEY
      // ---------------------------------------------

      key: razorpayKey,

      // ---------------------------------------------
      // AMOUNT
      //
      // Backend sends amount in paise.
      // Example:
      // ₹5,000 = 500000 paise
      // ---------------------------------------------

      amount:
        paymentData.razorpay_amount,

      // ---------------------------------------------
      // CURRENCY
      // ---------------------------------------------

      currency:
        paymentData.razorpay_currency ||
        "INR",

      // ---------------------------------------------
      // BUSINESS NAME
      // ---------------------------------------------

      name: "Zone360",

      // ---------------------------------------------
      // DESCRIPTION
      // ---------------------------------------------

      description:
        `Zone360 Order #${orderData.order_id}`,

      // =================================================
      // VERY IMPORTANT
      //
      // Razorpay expects:
      //
      // order_id
      //
      // NOT:
      //
      // order
      // =================================================

      order_id:
        paymentData.razorpay_order_id,

      // ---------------------------------------------
      // CUSTOMER INFORMATION
      // ---------------------------------------------

      prefill: {
        name:
          customerDetails.name,

        contact:
          customerDetails.phone,
      },

      // ---------------------------------------------
      // NOTES
      // ---------------------------------------------

      notes: {
        customer_name:
          customerDetails.name,

        address:
          customerDetails.address,

        city:
          customerDetails.city,

        state:
          customerDetails.state,

        pincode:
          customerDetails.pincode,

        zone360_order_id:
          String(
            orderData.order_id
          ),
      },

      // ---------------------------------------------
      // THEME
      // ---------------------------------------------

      theme: {
        color: "#1769d1",
      },

      // =================================================
      // PAYMENT SUCCESS
      // =================================================

      handler:
        async function (
          response
        ) {

          try {

            console.log(
              "================================="
            );

            console.log(
              "RAZORPAY PAYMENT SUCCESS"
            );

            console.log(
              "Complete Razorpay response:",
              response
            );

            console.log(
              "Razorpay Payment ID:",
              response?.razorpay_payment_id
            );

            console.log(
              "Razorpay Order ID:",
              response?.razorpay_order_id
            );

            console.log(
              "Razorpay Signature:",
              response?.razorpay_signature
            );

            console.log(
              "================================="
            );

            // -----------------------------------------
            // VERIFY WITH BACKEND
            // -----------------------------------------

            const verificationResult =
              await verifyPayment(
                response,
                paymentData
              );

            console.log(
              "Payment verification successful:",
              verificationResult
            );

            // -----------------------------------------
            // SUCCESS MESSAGE
            // -----------------------------------------

            alert(
              "Payment successful and verified!\n\n" +
              "Payment ID: " +
              response.razorpay_payment_id
            );

            // -----------------------------------------
            // GO TO ORDERS
            // -----------------------------------------

            navigate(
              "/orders"
            );

          } catch (error) {

            console.error(
              "PAYMENT VERIFICATION ERROR",
              error
            );

            setError(
              error.message ||
                "Payment verification failed."
            );

            alert(
              "Payment was completed, but verification failed.\n\n" +
              (
                error.message ||
                "Please contact support."
              )
            );
          }
        },

      // =================================================
      // MODAL
      // =================================================

      modal: {
        ondismiss:
          function () {

            console.log(
              "Razorpay checkout closed."
            );

          },
      },
    };

    // =================================================
    // DEBUG
    // =================================================

    console.log(
      "================================="
    );

    console.log(
      "OPENING RAZORPAY CHECKOUT"
    );

    console.log(
      "Razorpay Key:",
      razorpayKey
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
      "Razorpay Options:",
      options
    );

    console.log(
      "================================="
    );

    // =================================================
    // CREATE RAZORPAY INSTANCE
    // =================================================

    const razorpay =
      new window.Razorpay(
        options
      );

    // =================================================
    // PAYMENT FAILED
    // =================================================

    razorpay.on(
      "payment.failed",
      function (
        response
      ) {

        console.error(
          "RAZORPAY PAYMENT FAILED:",
          response
        );

        const description =
          response?.error
            ?.description ||
          "Payment failed. Please try again.";

        const reason =
          response?.error
            ?.reason;

        setError(
          reason
            ? `${description} (${reason})`
            : description
        );

        alert(
          reason
            ? `${description}\n\nReason: ${reason}`
            : description
        );
      }
    );

    // =================================================
    // OPEN PAYMENT WINDOW
    // =================================================

    razorpay.open();
  };

  // =====================================================
  // START RAZORPAY PAYMENT
  // =====================================================

  const startRazorpayPayment =
    async () => {

      try {

        setPaymentLoading(
          true
        );

        setError("");

        // ---------------------------------------------
        // TOKEN
        // ---------------------------------------------

        const token =
          getToken();

        if (!token) {

          navigate(
            "/login"
          );

          return;
        }

        // ---------------------------------------------
        // CART CHECK
        // ---------------------------------------------

        if (
          !cart ||
          !cart.items ||
          cart.items.length === 0
        ) {

          throw new Error(
            "Your cart is empty."
          );
        }

        // ---------------------------------------------
        // VALIDATE NAME
        // ---------------------------------------------

        if (
          !customerDetails.name.trim()
        ) {

          throw new Error(
            "Please enter your full name."
          );
        }

        // ---------------------------------------------
        // VALIDATE PHONE
        // ---------------------------------------------

        if (
          !customerDetails.phone.trim()
        ) {

          throw new Error(
            "Please enter your phone number."
          );
        }

        // ---------------------------------------------
        // VALIDATE ADDRESS
        // ---------------------------------------------

        if (
          !customerDetails.address.trim()
        ) {

          throw new Error(
            "Please enter your address."
          );
        }

        // ---------------------------------------------
        // VALIDATE CITY
        // ---------------------------------------------

        if (
          !customerDetails.city.trim()
        ) {

          throw new Error(
            "Please enter your city."
          );
        }

        // ---------------------------------------------
        // VALIDATE STATE
        // ---------------------------------------------

        if (
          !customerDetails.state.trim()
        ) {

          throw new Error(
            "Please enter your state."
          );
        }

        // ---------------------------------------------
        // VALIDATE PINCODE
        // ---------------------------------------------

        if (
          !customerDetails.pincode.trim()
        ) {

          throw new Error(
            "Please enter your pincode."
          );
        }

        // =================================================
        // 1. CREATE ZONE360 ORDER
        // =================================================

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

        if (
          orderResponse.status === 401
        ) {

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "access_token"
          );

          navigate(
            "/login"
          );

          return;
        }

        if (
          !orderResponse.ok
        ) {

          throw new Error(
            orderData.detail ||
              "Unable to create order."
          );
        }

        // =================================================
        // 2. CREATE RAZORPAY ORDER
        // =================================================

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

        // ---------------------------------------------
        // CHECK PAYMENT RESPONSE
        // ---------------------------------------------

        if (
          !paymentData?.razorpay_order_id
        ) {

          throw new Error(
            "Razorpay Order ID was not returned by backend."
          );
        }

        // =================================================
        // 3. LOAD RAZORPAY
        // =================================================

        const razorpayLoaded =
          await loadRazorpayScript();

        if (
          !razorpayLoaded
        ) {

          throw new Error(
            "Unable to load Razorpay Checkout."
          );
        }

        // =================================================
        // 4. OPEN RAZORPAY
        // =================================================

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

        setPaymentLoading(
          false
        );
      }
    };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {

    return (
      <section className="inner-page">

        <div className="container">

          <div className="page-heading">

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

  // =====================================================
  // MAIN CHECKOUT
  // =====================================================

  return (

    <section
      className="inner-page checkout-page"
    >

      <div className="container">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

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

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (

          <div
            className="error-message"
            style={{
              marginBottom:
                "24px",

              padding:
                "16px",

              borderRadius:
                "8px",

              background:
                "#fee2e2",

              color:
                "#b91c1c",
            }}
          >

            {error}

          </div>

        )}

        {/* =================================================
            CHECKOUT GRID
        ================================================= */}

        <div
          className="checkout-grid"
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "2fr 1fr",

            gap:
              "30px",
          }}
        >

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div>

            {/* =================================================
                CUSTOMER DETAILS
            ================================================= */}

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
                />

              </div>

            </div>

            {/* =================================================
                PAYMENT
            ================================================= */}

            <div
              className="checkout-card"
              style={{
                marginTop:
                  "24px",
              }}
            >

              <h2>
                Payment
              </h2>

              <div
                style={{
                  padding:
                    "16px",

                  background:
                    "#f8fafc",

                  borderRadius:
                    "8px",

                  marginBottom:
                    "20px",
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
                  width:
                    "100%",
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

          {/* =================================================
              RIGHT SIDE — ORDER SUMMARY
          ================================================= */}

          <div>

            <div
              className="checkout-card"
            >

              <h2>
                Order Summary
              </h2>

              {cart &&
                cart.items.map(
                  (item) => {

                    const product =
                      getProduct(
                        item.product_id
                      );

                    return (

                      <div
                        key={
                          item.id
                        }
                        style={{
                          display:
                            "flex",

                          justifyContent:
                            "space-between",

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
                              marginTop:
                                "4px",

                              color:
                                "#64748b",
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
                            item.price *
                              item.quantity
                          )}

                        </strong>

                      </div>
                    );
                  }
                )}

              {/* =================================================
                  TOTAL
              ================================================= */}

              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  paddingTop:
                    "20px",

                  marginTop:
                    "10px",
                }}
              >

                <strong
                  style={{
                    fontSize:
                      "20px",
                  }}
                >
                  Total
                </strong>

                <strong
                  style={{
                    fontSize:
                      "22px",
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
}

export default CheckoutPage;