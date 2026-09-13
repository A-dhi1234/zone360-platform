import React from "react";
import { Link } from "react-router-dom";

import { products } from "../app/products";


function Footer() {

  // =====================================================
  // BACK TO TOP
  // =====================================================

  const handleBackToTop = () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  return (

    <footer className="site-footer">

      {/* =================================================
          BACK TO TOP
      ================================================= */}

      <button
        type="button"
        className="footer-top-button"
        onClick={handleBackToTop}
      >

        <span>
          ↑
        </span>

        Back to Top

      </button>


      {/* =================================================
          MAIN FOOTER
      ================================================= */}

      <div className="footer-main">

        <div className="container footer-grid">


          {/* =================================================
              COLUMN 1 — ZONE360
          ================================================= */}

          <div className="footer-column footer-brand">

            <Link
              to="/"
              className="footer-logo-link"
            >

              <img
                src="/assets/logo.png"
                alt="Zone360"
                className="footer-logo"
              />

            </Link>


            <p className="footer-description">

              Smart technology solutions for
              tracking, security and automation.

            </p>


            <div className="footer-socials">

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                f
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                ◎
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                in
              </a>

            </div>

          </div>


          {/* =================================================
              COLUMN 2 — COMPANY
          ================================================= */}

          <div className="footer-column">

            <h3>
              Company
            </h3>


            <Link to="/">
              Home
            </Link>

            <Link to="/products">
              Products
            </Link>

            <Link to="/app">
              Zone360 App
            </Link>

            <Link to="/about">
              About Us
            </Link>

            <Link to="/contact">
              Contact Us
            </Link>

          </div>


          {/* =================================================
              COLUMN 3 — PRODUCTS
          ================================================= */}

          <div className="footer-column">

            <h3>
              Our Products
            </h3>


            {products.map(
              (product) => (

                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                >
                  {product.name}
                </Link>

              )
            )}

          </div>


          {/* =================================================
              COLUMN 4 — SUPPORT
          ================================================= */}

          <div className="footer-column footer-contact">

            <h3>
              Let Us Help You
            </h3>


            <Link to="/quote">
              Get a Quote
            </Link>

            <Link to="/contact">
              Contact Support
            </Link>

            <Link to="/login">
              Customer Login
            </Link>


            <div className="footer-contact-details">

              <p>

                <strong>
                  Phone
                </strong>

                <br />

                +91 80478 27022

              </p>


              <p>

                <strong>
                  Email
                </strong>

                <br />

                zone360.cbe@gmail.com

              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          FOOTER INFORMATION BAR
      ================================================= */}

      <div className="footer-info">

        <div className="container footer-info-inner">

          <div className="footer-info-brand">

            <span className="footer-mini-logo">
              Z360
            </span>

            <span>
              Zone360
            </span>

          </div>


          <div className="footer-location">

            Coimbatore, Tamil Nadu, India

          </div>

        </div>

      </div>


      {/* =================================================
          COPYRIGHT
      ================================================= */}

      <div className="footer-bottom">

        <div className="container footer-bottom-inner">

          <p>
            © 2026 Zone360. All Rights Reserved.
          </p>


          <div className="footer-bottom-links">

            <Link to="/contact">
              Contact
            </Link>

            <span>
              |
            </span>

            <Link to="/quote">
              Get a Quote
            </Link>

          </div>

        </div>

      </div>

    </footer>

  );

}


export default Footer;
