import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { formatPrice } from "../app/products";


// =====================================================
// CHECKOUT PAGE
// =====================================================

function CheckoutPage({
  cart,
  clearCart,
}) {

  const navigate = useNavigate();


  // ===================================================
  // FORM STATE
  // ===================================================

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });


  // ===================================================
  // PAYMENT
  // ===================================================

  const [paymentMethod, setPaymentMethod] =
    useState("cod");


  // ===================================================
  // ORDER SUCCESS
  // ===================================================

  const [orderPlaced, setOrderPlaced] =
    useState(false);


  // ===================================================
  // ORDER NUMBER
  // ===================================================

  const [orderNumber, setOrderNumber] =
    useState("");


  // ===================================================
  // HANDLE INPUT
  // ===================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

  };


  // ===================================================
  // CALCULATE TOTAL
  // ===================================================

  const subtotal =
    cart.reduce(
      (total, item) =>
        total +
        item.price *
        item.quantity,
      0
    );


  const deliveryCharge =
    subtotal > 0
      ? 0
      : 0;


  const total =
    subtotal +
    deliveryCharge;


  // ===================================================
  // PLACE ORDER
  // ===================================================

  const handlePlaceOrder = (event) => {

    event.preventDefault();


    const generatedOrderNumber =
      "Z360-" +
      Date.now()
        .toString()
        .slice(-6);


    setOrderNumber(
      generatedOrderNumber
    );


    console.log(
      "Zone360 Order:",
      {
        customer: formData,
        products: cart,
        paymentMethod,
        subtotal,
        deliveryCharge,
        total,
      }
    );


    setOrderPlaced(true);


    clearCart();

  };


  // ===================================================
  // EMPTY CART
  // ===================================================

  if (!orderPlaced && cart.length === 0) {

    return (

      <section className="inner-page">

        <div className="container">

          <div className="checkout-empty">

            <div className="checkout-empty-icon">
              🛒
            </div>

            <h1>
              Your Cart Is Empty
            </h1>

            <p>
              Add products to your cart before
              proceeding to checkout.
            </p>

            <Link
              to="/products"
              className="primary-button"
            >
              Browse Products
            </Link>

          </div>

        </div>

      </section>

    );

  }


  // ===================================================
  // ORDER SUCCESS
  // ===================================================

  if (orderPlaced) {

    return (

      <section className="inner-page">

        <div className="container">

          <div className="checkout-success">

            <div className="checkout-success-icon">
              ✓
            </div>


            <span className="section-label">
              ORDER CONFIRMED
            </span>


            <h1>
              Thank You For Your Order
            </h1>


            <p>
              Your order has been received
              successfully.
            </p>


            <div className="order-number">

              <span>
                Order Number
              </span>

              <strong>
                {orderNumber}
              </strong>

            </div>


            <p className="checkout-success-note">
              Our team will review your order
              and contact you regarding delivery
              and payment confirmation.
            </p>


            <div className="checkout-success-actions">

              <Link
                to="/products"
                className="primary-button"
              >
                Continue Shopping
              </Link>


              <Link
                to="/"
                className="secondary-button"
              >
                Back to Home
              </Link>

            </div>

          </div>

        </div>

      </section>

    );

  }


  // ===================================================
  // CHECKOUT
  // ===================================================

  return (

    <section className="inner-page checkout-page">

      <div className="container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="page-heading">

          <span>
            CHECKOUT
          </span>

          <h1>
            Complete Your Order
          </h1>

          <p>
            Enter your details and choose
            your preferred payment method.
          </p>

        </div>


        {/* =================================================
            CHECKOUT LAYOUT
        ================================================= */}

        <form
          className="checkout-layout"
          onSubmit={handlePlaceOrder}
        >

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="checkout-main">

            {/* =================================================
                CUSTOMER DETAILS
            ================================================= */}

            <div className="checkout-card">

              <div className="checkout-card-heading">

                <span>
                  01
                </span>

                <div>

                  <h2>
                    Customer Details
                  </h2>

                  <p>
                    Enter your contact information.
                  </p>

                </div>

              </div>


              <div className="checkout-form-grid">

                {/* FULL NAME */}

                <div className="form-group">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={
                      formData.fullName
                    }
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />

                </div>


                {/* PHONE */}

                <div className="form-group">

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />

                </div>


                {/* EMAIL */}

                <div className="form-group full-span">

                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                DELIVERY ADDRESS
            ================================================= */}

            <div className="checkout-card">

              <div className="checkout-card-heading">

                <span>
                  02
                </span>

                <div>

                  <h2>
                    Delivery Address
                  </h2>

                  <p>
                    Where should we deliver your order?
                  </p>

                </div>

              </div>


              <div className="checkout-form-grid">

                {/* ADDRESS */}

                <div className="form-group full-span">

                  <label>
                    Address
                  </label>

                  <textarea
                    name="address"
                    rows="4"
                    value={
                      formData.address
                    }
                    onChange={handleChange}
                    placeholder="Enter your complete address"
                    required
                  />

                </div>


                {/* CITY */}

                <div className="form-group">

                  <label>
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={
                      formData.city
                    }
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                  />

                </div>


                {/* STATE */}

                <div className="form-group">

                  <label>
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={
                      formData.state
                    }
                    onChange={handleChange}
                    placeholder="Enter state"
                    required
                  />

                </div>


                {/* PINCODE */}

                <div className="form-group">

                  <label>
                    PIN Code
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={
                      formData.pincode
                    }
                    onChange={handleChange}
                    placeholder="Enter PIN code"
                    required
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                PAYMENT
            ================================================= */}

            <div className="checkout-card">

              <div className="checkout-card-heading">

                <span>
                  03
                </span>

                <div>

                  <h2>
                    Payment Method
                  </h2>

                  <p>
                    Choose how you want to pay.
                  </p>

                </div>

              </div>


              <div className="payment-options">

                {/* COD */}

                <label
                  className={
                    paymentMethod === "cod"
                      ? "payment-option selected"
                      : "payment-option"
                  }
                >

                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={
                      paymentMethod === "cod"
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target.value
                      )
                    }
                  />


                  <div>

                    <strong>
                      Cash on Delivery
                    </strong>

                    <span>
                      Pay when your order is delivered.
                    </span>

                  </div>

                </label>


                {/* ONLINE */}

                <label
                  className={
                    paymentMethod === "online"
                      ? "payment-option selected"
                      : "payment-option"
                  }
                >

                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={
                      paymentMethod === "online"
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target.value
                      )
                    }
                  />


                  <div>

                    <strong>
                      Online Payment
                    </strong>

                    <span>
                      Payment gateway will be connected later.
                    </span>

                  </div>

                </label>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT SIDE - ORDER SUMMARY
          ================================================= */}

          <aside className="checkout-summary">

            <h2>
              Order Summary
            </h2>


            {/* PRODUCTS */}

            <div className="checkout-products">

              {cart.map((item) => (

                <div
                  className="checkout-product"
                  key={item.id}
                >

                  <div className="checkout-product-image">

                    {item.image ? (

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                    ) : (

                      <span>
                        Z360
                      </span>

                    )}

                  </div>


                  <div className="checkout-product-info">

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      Qty: {item.quantity}
                    </span>

                  </div>


                  <strong>
                    {formatPrice(
                      item.price *
                      item.quantity
                    )}
                  </strong>

                </div>

              ))}

            </div>


            {/* TOTALS */}

            <div className="checkout-summary-lines">

              <div>

                <span>
                  Subtotal
                </span>

                <strong>
                  {formatPrice(subtotal)}
                </strong>

              </div>


              <div>

                <span>
                  Delivery
                </span>

                <strong>
                  {deliveryCharge === 0
                    ? "FREE"
                    : formatPrice(
                        deliveryCharge
                      )}
                </strong>

              </div>

            </div>


            <div className="checkout-total">

              <span>
                Total
              </span>

              <strong>
                {formatPrice(total)}
              </strong>

            </div>


            {/* PLACE ORDER */}

            <button
              type="submit"
              className="primary-button checkout-place-order"
            >
              Place Order
            </button>


            <p className="checkout-secure-note">
              🔒 Your information is secure.
            </p>


            <Link
              to="/cart"
              className="back-to-cart"
            >
              ← Back to Cart
            </Link>

          </aside>

        </form>

      </div>

    </section>

  );

}


export default CheckoutPage;