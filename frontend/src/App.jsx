import React, { useEffect, useState } from "react";

import {
  Routes,
  Route,
  Link,
} from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import QuoteTracking from "./pages/QuoteTracking";
import OrderTracking from "./pages/OrderTracking";



// =====================================================
// APP
// =====================================================

function App() {

  // ===================================================
  // CART
  // ===================================================

  const [cart, setCart] = useState(() => {

    try {

      const savedCart =
        localStorage.getItem("zone360-cart");

      return savedCart
        ? JSON.parse(savedCart)
        : [];

    } catch {

      return [];

    }

  });


  // ===================================================
  // SAVE CART
  // ===================================================

  useEffect(() => {

    localStorage.setItem(
      "zone360-cart",
      JSON.stringify(cart)
    );

  }, [cart]);


  // ===================================================
  // ADD TO CART
  // ===================================================

  const addToCart = (
    product,
    quantity = 1
  ) => {

    setCart((currentCart) => {

      const existingProduct =
        currentCart.find(
          (item) => item.id === product.id
        );


      // Product already exists
      if (existingProduct) {

        return currentCart.map((item) => {

          if (item.id === product.id) {

            return {
              ...item,

              quantity:
                item.quantity + quantity,
            };

          }

          return item;

        });

      }


      // New product
      return [
        ...currentCart,

        {
          ...product,
          quantity,
        },

      ];

    });

  };


  // ===================================================
  // UPDATE QUANTITY
  // ===================================================

  const updateQuantity = (
    productId,
    quantity
  ) => {

    if (quantity <= 0) {

      removeFromCart(productId);

      return;

    }


    setCart((currentCart) => {

      return currentCart.map((item) => {

        if (item.id === productId) {

          return {
            ...item,
            quantity,
          };

        }

        return item;

      });

    });

  };


  // ===================================================
  // REMOVE FROM CART
  // ===================================================

  const removeFromCart = (
    productId
  ) => {

    setCart((currentCart) => {

      return currentCart.filter(
        (item) => item.id !== productId
      );

    });

  };


  // ===================================================
  // CLEAR CART
  // ===================================================

  const clearCart = () => {

    setCart([]);

  };


  // ===================================================
  // TOTAL NUMBER OF CART ITEMS
  // ===================================================

  const cartItemCount =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );


  // ===================================================
  // WISHLIST
  // ===================================================

  const [wishlist, setWishlist] = useState(() => {

    try {

      const savedWishlist =
        localStorage.getItem(
          "zone360-wishlist"
        );

      return savedWishlist
        ? JSON.parse(savedWishlist)
        : [];

    } catch {

      return [];

    }

  });


  // ===================================================
  // SAVE WISHLIST
  // ===================================================

  useEffect(() => {

    localStorage.setItem(
      "zone360-wishlist",
      JSON.stringify(wishlist)
    );

  }, [wishlist]);


  // ===================================================
  // ADD / REMOVE WISHLIST
  // ===================================================

  const toggleWishlist = (product) => {

    setWishlist((currentWishlist) => {

      const exists =
        currentWishlist.some(
          (item) =>
            item.id === product.id
        );


      // Remove from wishlist
      if (exists) {

        return currentWishlist.filter(
          (item) =>
            item.id !== product.id
        );

      }


      // Add to wishlist
      return [
        ...currentWishlist,
        product,
      ];

    });

  };


  // ===================================================
  // CHECK WISHLIST
  // ===================================================

  const isInWishlist = (
    productId
  ) => {

    return wishlist.some(
      (item) =>
        item.id === productId
    );

  };


  // ===================================================
  // TOTAL WISHLIST ITEMS
  // ===================================================

  const wishlistItemCount =
    wishlist.length;


  // ===================================================
  // ROUTES
  // =====================================================

  return (

    <div className="app">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar
        cartItemCount={cartItemCount}
        wishlistItemCount={
          wishlistItemCount
        }
      />


      {/* =================================================
          MAIN
      ================================================= */}

      <main>

        <Routes>

          {/* =============================================
              HOME
          ============================================= */}

          <Route
            path="/"
            element={<Home />}
          />


          {/* =============================================
              PRODUCTS
          ============================================= */}

          <Route
            path="/products"
            element={
              <Products
                toggleWishlist={
                  toggleWishlist
                }
                isInWishlist={
                  isInWishlist
                }
              />
            }
          />


          {/* =============================================
              PRODUCT DETAILS
          ============================================= */}

          <Route
            path="/products/:productId"
            element={
              <ProductDetails
                addToCart={addToCart}
              />
            }
          />


          {/* =============================================
              CART
          ============================================= */}

          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                updateQuantity={
                  updateQuantity
                }
                removeFromCart={
                  removeFromCart
                }
                clearCart={
                  clearCart
                }
              />
            }
          />


          {/* =============================================
              WISHLIST
          ============================================= */}

          <Route
            path="/wishlist"
            element={
              <WishlistPage
                wishlist={wishlist}
                toggleWishlist={
                  toggleWishlist
                }
                addToCart={
                  addToCart
                }
              />
            }
          />


          {/* =============================================
              CHECKOUT
          ============================================= */}

          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cart={cart}
                clearCart={clearCart}
              />
            }
          />


          {/* =============================================
              ABOUT
          ============================================= */}

          <Route
            path="/about"
            element={<AboutPage />}
          />


          {/* =============================================
              CONTACT
          ============================================= */}

          <Route
            path="/contact"
            element={<ContactPage />}
          />


          {/* =============================================
              ZONE360 APP
          ============================================= */}

          <Route
            path="/app"
            element={<Zone360AppPage />}
          />


          {/* =============================================
              LOGIN
          ============================================= */}

          <Route
            path="/login"
            element={<LoginPage />}
          />


          {/* =============================================
              REGISTER
          ============================================= */}

          <Route
            path="/register"
            element={<RegisterPage />}
          />


          {/* =============================================
              GET A QUOTE
          ============================================= */}

          <Route
            path="/quote"
            element={<QuotePage />}
          />


          {/* =============================================
              QUOTE TRACKING
          ============================================= */}

          <Route
            path="/quote-tracking"
            element={<QuoteTracking />}
          />


          {/* =============================================
              ORDER TRACKING
          ============================================= */}

          <Route
            path="/order-tracking"
            element={<OrderTracking />}
          />


          {/* =============================================
              404
          ============================================= */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </main>


      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />

    </div>

  );

}


// =====================================================
// ABOUT PAGE
// =====================================================

function AboutPage() {

  return (

    <section className="inner-page">

      <div className="container">

        <div className="page-heading">

          <span>
            ABOUT ZONE360
          </span>

          <h1>
            Smart Technology For A Secure Tomorrow
          </h1>

          <p>
            Zone360 provides practical technology
            solutions for tracking, security,
            monitoring and automation.
          </p>

        </div>


        <div className="about-grid">

          <div className="about-content">

            <span className="section-label">
              WHO WE ARE
            </span>

            <h2>
              Technology That Works For You
            </h2>

            <p>
              Zone360 focuses on smart technology
              solutions that solve real-world problems.
            </p>

            <p>
              Our solutions include vehicle tracking,
              employee tracking, CCTV security and
              water automation.
            </p>


            <div className="about-points">

              <div>

                <strong>
                  01
                </strong>

                <span>
                  Smart Technology
                </span>

              </div>


              <div>

                <strong>
                  02
                </strong>

                <span>
                  Reliable Solutions
                </span>

              </div>


              <div>

                <strong>
                  03
                </strong>

                <span>
                  Professional Support
                </span>

              </div>


              <div>

                <strong>
                  04
                </strong>

                <span>
                  Customer Focused
                </span>

              </div>

            </div>

          </div>


          <div className="about-visual">

            <div className="about-visual-card">

              <div className="about-icon">
                Z360
              </div>

              <h3>
                Zone360
              </h3>

              <p>
                Smart tracking, security and
                automation solutions.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}


// =====================================================
// CONTACT PAGE
// =====================================================

// =====================================================
// CONTACT PAGE
// =====================================================

function ContactPage() {

  return (

    <section className="inner-page contact-page">

      <div className="container">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="page-heading">

          <span>
            CONTACT US
          </span>

          <h1>
            Let's Talk About Your Requirement
          </h1>

          <p>
            Have a question or need more information?
            Contact the Zone360 team.
          </p>

        </div>


        {/* =================================================
            CONTACT LAYOUT
        ================================================= */}

        <div className="contact-page-grid">

          {/* =================================================
              CONTACT INFORMATION
          ================================================= */}

          <div className="contact-information">

            <div className="contact-info-intro">

              <span className="section-label">
                GET IN TOUCH
              </span>

              <h2>
                We're Here To Help
              </h2>

              <p>
                Contact us for product information,
                service enquiries, installation support
                or any other requirement.
              </p>

            </div>


            {/* PHONE */}

            <div className="contact-info-card">

              <div className="contact-info-icon">
                ☎
              </div>

              <div>

                <span>
                  PHONE
                </span>

                <h3>
                  +91 80478 27022
                </h3>

                <p>
                  Call us for product and
                  service enquiries.
                </p>

              </div>

            </div>


            {/* EMAIL */}

            <div className="contact-info-card">

              <div className="contact-info-icon">
                ✉
              </div>

              <div>

                <span>
                  EMAIL
                </span>

                <h3>
                  zone360.cbe@gmail.com
                </h3>

                <p>
                  Send us your requirements
                  by email.
                </p>

              </div>

            </div>


            {/* ADDRESS */}

            <div className="contact-info-card">

              <div className="contact-info-icon">
                📍
              </div>

              <div>

                <span>
                  ADDRESS
                </span>

                <h3>
                  Coimbatore, Tamil Nadu
                </h3>

                <p>
                  No. 17/3, Near Shantha Marriage Hall,
                  Rice Mill Road, Kuniamuthur,
                  Coimbatore - 641008.
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              CONTACT FORM
          ================================================= */}

          <ContactForm />

        </div>

      </div>

    </section>

  );

}


// =====================================================
// CONTACT FORM
// =====================================================

function ContactForm() {

  const [submitted, setSubmitted] =
    useState(false);


  const [formData, setFormData] =
    useState({
      fullName: "",
      phone: "",
      email: "",
      subject: "",
      requirement: "",
      message: "",
    });


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
  // SUBMIT
  // ===================================================

  const handleSubmit = (event) => {

    event.preventDefault();


    // Frontend only for now
    console.log(
      "Zone360 Contact Form:",
      formData
    );


    setSubmitted(true);

  };


  // ===================================================
  // SUCCESS
  // ===================================================

  if (submitted) {

    return (

      <div className="contact-success">

        <div className="contact-success-icon">
          ✓
        </div>


        <span className="section-label">
          CONTACT US
        </span>


        <h2>
          Message Sent Successfully
        </h2>


        <p>
          Thank you for contacting Zone360.
          Our team will review your message
          and get back to you shortly.
        </p>


        <button
          type="button"
          className="primary-button"
          onClick={() => {

            setSubmitted(false);

            setFormData({
              fullName: "",
              phone: "",
              email: "",
              subject: "",
              requirement: "",
              message: "",
            });

          }}
        >
          Send Another Message
        </button>

      </div>

    );

  }


  return (

    <form
      className="contact-form"
      onSubmit={handleSubmit}
    >

      {/* =================================================
          FORM HEADER
      ================================================= */}

      <div className="contact-form-header">

        <span className="section-label">
          SEND AN ENQUIRY
        </span>

        <h2>
          How Can We Help?
        </h2>

        <p>
          Fill in the form below and our team
          will contact you.
        </p>

      </div>


      {/* =================================================
          NAME + PHONE
      ================================================= */}

      <div className="form-row">

        {/* NAME */}

        <div className="form-group">

          <label htmlFor="contact-fullName">
            Full Name
          </label>

          <input
            id="contact-fullName"
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

          <label htmlFor="contact-phone">
            Phone Number
          </label>

          <input
            id="contact-phone"
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

      </div>


      {/* =================================================
          EMAIL
      ================================================= */}

      <div className="form-group">

        <label htmlFor="contact-email">
          Email Address
        </label>

        <input
          id="contact-email"
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


      {/* =================================================
          SUBJECT
      ================================================= */}

      <div className="form-group">

        <label htmlFor="contact-subject">
          Subject
        </label>

        <input
          id="contact-subject"
          type="text"
          name="subject"
          value={
            formData.subject
          }
          onChange={handleChange}
          placeholder="What can we help you with?"
          required
        />

      </div>


      {/* =================================================
          REQUIREMENT
      ================================================= */}

      <div className="form-group">

        <label htmlFor="contact-requirement">
          Requirement
        </label>

        <select
          id="contact-requirement"
          name="requirement"
          value={
            formData.requirement
          }
          onChange={handleChange}
          required
        >

          <option value="">
            Select a requirement
          </option>

          <option value="GPS Tracking">
            GPS Tracking
          </option>

          <option value="Employee Tracking">
            Employee Tracking
          </option>

          <option value="CCTV Security">
            CCTV Security
          </option>

          <option value="Water Tank Controller">
            Water Tank Controller
          </option>

          <option value="General Enquiry">
            General Enquiry
          </option>

          <option value="Other">
            Other
          </option>

        </select>

      </div>


      {/* =================================================
          MESSAGE
      ================================================= */}

      <div className="form-group">

        <label htmlFor="contact-message">
          Message
        </label>

        <textarea
          id="contact-message"
          name="message"
          rows="6"
          value={
            formData.message
          }
          onChange={handleChange}
          placeholder="Tell us about your requirement..."
          required
        />

      </div>


      {/* =================================================
          SUBMIT
      ================================================= */}

      <button
        type="submit"
        className="primary-button contact-submit-button"
      >
        Send Message
      </button>

    </form>

  );

}
// =====================================================
// ZONE360 APP PAGE
// =====================================================

function Zone360AppPage() {

  return (

    <section className="inner-page">

      <div className="container">

        <div className="app-page">

          <div className="app-page-content">

            <span className="section-label">
              ZONE360 APP
            </span>

            <h1>
              Manage Your Tracking
              <br />
              From Anywhere
            </h1>

            <p>
              Access your tracking information
              and monitor your connected devices
              through the Zone360 application.
            </p>


            <div className="app-features">

              <div>

                <strong>
                  ✓
                </strong>

                Real-time monitoring

              </div>


              <div>

                <strong>
                  ✓
                </strong>

                Easy access

              </div>


              <div>

                <strong>
                  ✓
                </strong>

                Simple interface

              </div>


              <div>

                <strong>
                  ✓
                </strong>

                Smart tracking

              </div>

            </div>

          </div>


          <div className="app-page-card">

            <div className="app-symbol">
              Z360
            </div>

            <h2>
              Zone360
            </h2>

            <p>
              Smart tracking and monitoring application.
            </p>

            <button
              className="primary-button"
              type="button"
            >
              Coming Soon
            </button>

          </div>

        </div>

      </div>

    </section>

  );

}


// =====================================================
// LOGIN PAGE
// =====================================================

function LoginPage() {

  const [message, setMessage] =
    useState("");


  const handleLogin = (event) => {

    event.preventDefault();

    setMessage(
      "Login UI is ready. Backend authentication can be connected later."
    );

  };


  return (

    <section className="auth-page">

      <div className="auth-card">

        {/* LOGO */}

        <div className="auth-logo">

          <img
            src="/src/assets/logo.png"
            alt="Zone360 Logo"
          />

        </div>


        {/* HEADING */}

        <h1>
          Welcome Back
        </h1>

        <p className="auth-subtitle">
          Login to your Zone360 account.
        </p>


        {/* MESSAGE */}

        {message && (

          <div className="info-message">
            {message}
          </div>

        )}


        {/* LOGIN FORM */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <div className="password-label-row">

              <label>
                Password
              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  setMessage(
                    "Password recovery will be connected later."
                  )
                }
              >
                Forgot Password?
              </button>

            </div>


            <input
              type="password"
              placeholder="Enter your password"
              required
            />

          </div>


          {/* REMEMBER ME */}

          <label className="remember-me">

            <input
              type="checkbox"
            />

            <span>
              Remember me
            </span>

          </label>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="primary-button full-width"
          >
            Login
          </button>

        </form>


        {/* REGISTER LINK */}

        <div className="auth-switch">

          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            Create an account
          </Link>

        </div>

      </div>

    </section>

  );

}


// =====================================================
// REGISTER PAGE
// =====================================================

function RegisterPage() {

  const [message, setMessage] =
    useState("");


  const handleRegister = (event) => {

    event.preventDefault();


    const form =
      event.currentTarget;


    const password =
      form.password.value;


    const confirmPassword =
      form.confirmPassword.value;


    // PASSWORD CHECK

    if (password !== confirmPassword) {

      setMessage(
        "Passwords do not match."
      );

      return;

    }


    // FRONTEND ONLY MESSAGE

    setMessage(
      "Registration UI is ready. Backend registration can be connected later."
    );

  };


  return (

    <section className="auth-page">

      <div className="auth-card register-card">

        {/* LOGO */}

        <div className="auth-logo">

          <img
            src="/src/assets/logo.png"
            alt="Zone360 Logo"
          />

        </div>


        {/* HEADING */}

        <h1>
          Create Account
        </h1>

        <p className="auth-subtitle">
          Create your Zone360 customer account.
        </p>


        {/* MESSAGE */}

        {message && (

          <div className="info-message">
            {message}
          </div>

        )}


        {/* REGISTER FORM */}

        <form onSubmit={handleRegister}>

          {/* FULL NAME */}

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              required
            />

          </div>


          {/* EMAIL */}

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
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
              placeholder="Enter your phone number"
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              minLength="6"
              required
            />

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="form-group">

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              minLength="6"
              required
            />

          </div>


          {/* TERMS */}

          <label className="terms-checkbox">

            <input
              type="checkbox"
              required
            />

            <span>
              I agree to the terms and conditions.
            </span>

          </label>


          {/* REGISTER BUTTON */}

          <button
            type="submit"
            className="primary-button full-width"
          >
            Create Account
          </button>

        </form>


        {/* LOGIN LINK */}

        <div className="auth-switch">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </section>

  );

}


// =====================================================
// QUOTE PAGE
// =====================================================

// =====================================================
// GET A QUOTE PAGE
// =====================================================

function QuotePage() {

  const [submitted, setSubmitted] =
    useState(false);


  const [formData, setFormData] =
    useState({
      fullName: "",
      phone: "",
      email: "",
      companyName: "",
      requirement: "",
      quantity: "1",
      location: "",
      message: "",
    });


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
  // SUBMIT FORM
  // ===================================================

  const handleSubmit = (event) => {

    event.preventDefault();


    // Frontend only for now
    console.log(
      "Zone360 Quote Request:",
      formData
    );


    setSubmitted(true);

  };


  // ===================================================
  // SUCCESS SCREEN
  // ===================================================

  if (submitted) {

    return (

      <section className="inner-page">

        <div className="container">

          <div className="quote-success">

            <div className="quote-success-icon">
              ✓
            </div>


            <span className="section-label">
              QUOTE REQUEST
            </span>


            <h1>
              Quote Request Submitted
            </h1>


            <p>
              Thank you for contacting Zone360.
              Our team will review your requirement
              and contact you shortly.
            </p>


            <div className="quote-success-actions">

              <Link
                to="/products"
                className="primary-button"
              >
                Back to Products
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
  // QUOTE FORM
  // ===================================================

  return (

    <section className="inner-page quote-page">

      <div className="container">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="page-heading">

          <span>
            GET A QUOTE
          </span>


          <h1>
            Tell Us What You Need
          </h1>


          <p>
            Get a tailored quote for your
            Zone360 requirement.
          </p>

        </div>


        {/* =================================================
            QUOTE FORM
        ================================================= */}

        <div className="quote-form-wrapper">

          <form
            className="quote-form"
            onSubmit={handleSubmit}
          >

            {/* =================================================
                CUSTOMER INFORMATION
            ================================================= */}

            <div className="quote-section">

              <div className="quote-section-heading">

                <span>
                  01
                </span>

                <div>

                  <h2>
                    Customer Information
                  </h2>

                  <p>
                    Tell us how we can contact you.
                  </p>

                </div>

              </div>


              <div className="quote-form-grid">

                {/* FULL NAME */}

                <div className="form-group">

                  <label htmlFor="fullName">
                    Full Name
                  </label>

                  <input
                    id="fullName"
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

                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
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

                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
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


                {/* COMPANY */}

                <div className="form-group full-span">

                  <label htmlFor="companyName">
                    Company Name
                  </label>

                  <input
                    id="companyName"
                    type="text"
                    name="companyName"
                    value={
                      formData.companyName
                    }
                    onChange={handleChange}
                    placeholder="Enter your company name"
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                REQUIREMENT
            ================================================= */}

            <div className="quote-section">

              <div className="quote-section-heading">

                <span>
                  02
                </span>

                <div>

                  <h2>
                    Your Requirement
                  </h2>

                  <p>
                    Tell us about the product or
                    service you need.
                  </p>

                </div>

              </div>


              <div className="quote-form-grid">

                {/* PRODUCT */}

                <div className="form-group">

                  <label htmlFor="requirement">
                    Product / Service
                  </label>

                  <select
                    id="requirement"
                    name="requirement"
                    value={
                      formData.requirement
                    }
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select a product
                    </option>

                    <option value="GPS Tracking Devices">
                      GPS Tracking Devices
                    </option>

                    <option value="Employee Tracking App">
                      Employee Tracking App
                    </option>

                    <option value="CCTV Security Systems">
                      CCTV Security Systems
                    </option>

                    <option value="Water Tank Controller">
                      Water Tank Controller
                    </option>

                    <option value="Multiple Products">
                      Multiple Products
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>


                {/* QUANTITY */}

                <div className="form-group">

                  <label htmlFor="quantity">
                    Quantity
                  </label>

                  <input
                    id="quantity"
                    type="number"
                    name="quantity"
                    min="1"
                    value={
                      formData.quantity
                    }
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* INSTALLATION LOCATION */}

                <div className="form-group full-span">

                  <label htmlFor="location">
                    Installation / Service Location
                  </label>

                  <input
                    id="location"
                    type="text"
                    name="location"
                    value={
                      formData.location
                    }
                    onChange={handleChange}
                    placeholder="Enter your location"
                  />

                </div>


                {/* MESSAGE */}

                <div className="form-group full-span">

                  <label htmlFor="message">
                    Requirement Details
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={
                      formData.message
                    }
                    onChange={handleChange}
                    placeholder="Tell us about your requirement..."
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                SUBMIT
            ================================================= */}

            <div className="quote-submit-area">

              <p>
                Our team will contact you after
                reviewing your requirement.
              </p>


              <button
                type="submit"
                className="primary-button quote-submit-button"
              >
                Submit Quote Request
              </button>

            </div>

          </form>

        </div>

      </div>

    </section>

  );

}


// =====================================================
// 404 PAGE
// =====================================================

function NotFound() {

  return (

    <section className="not-found">

      <div>

        <h1>
          404
        </h1>

        <h2>
          Page Not Found
        </h2>

        <p>
          The page you are looking for
          does not exist.
        </p>

      </div>

    </section>

  );

}


// =====================================================
// EXPORT
// =====================================================

export default App;