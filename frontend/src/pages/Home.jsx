import React from "react";
import { Link } from "react-router-dom";

import {
  products,
  formatPrice,
} from "../app/products";


function Home() {

  return (
    <>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">

        <div className="container hero-grid">

          <div className="hero-content">

            <span className="hero-label">
              SMART TECHNOLOGY
            </span>

            <h1>
              Secure Today.
              <br />
              <strong>Smart Tomorrow.</strong>
            </h1>

            <p>
              Smart tracking, security and automation
              solutions designed for modern homes,
              businesses and fleets.
            </p>


            <div className="hero-buttons">

              <Link
                to="/products"
                className="primary-button"
              >
                Explore Products
              </Link>

              <Link
                to="/quote"
                className="secondary-button"
              >
                Get a Quote
              </Link>

            </div>

          </div>


          <div className="hero-image">

            <img
              src="/src/assets/hero-products.png"
              alt="Zone360 Smart Technology"
            />

          </div>

        </div>

      </section>


      {/* =================================================
          TRUST
      ================================================= */}

      <section className="trust-strip">

        <div className="container trust-grid">

          <div className="trust-item">

            <div className="trust-icon">
              ✓
            </div>

            <div>

              <strong>
                Reliable Solutions
              </strong>

              <span>
                Built for everyday use
              </span>

            </div>

          </div>


          <div className="trust-item">

            <div className="trust-icon">
              ⚙
            </div>

            <div>

              <strong>
                Easy Installation
              </strong>

              <span>
                Simple setup and support
              </span>

            </div>

          </div>


          <div className="trust-item">

            <div className="trust-icon">
              24
            </div>

            <div>

              <strong>
                24/7 Support
              </strong>

              <span>
                Help when you need it
              </span>

            </div>

          </div>


          <div className="trust-item">

            <div className="trust-icon">
              🔒
            </div>

            <div>

              <strong>
                Secure & Trusted
              </strong>

              <span>
                Technology you can rely on
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          PRODUCTS
      ================================================= */}

      <section className="section products-section">

        <div className="container">

          <div className="section-heading">

            <span className="section-label">
              OUR PRODUCTS
            </span>

            <h2>
              Smart Solutions For Every Need
            </h2>

            <p>
              Explore our range of tracking,
              security and automation solutions.
            </p>

          </div>


          <div className="product-grid">

            {products.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
              />

            ))}

          </div>


          <div className="center-button">

            <Link
              to="/products"
              className="secondary-button"
            >
              View All Products
            </Link>

          </div>

        </div>

      </section>


      {/* =================================================
          BENEFITS
      ================================================= */}

      <section className="benefits-section">

        <div className="container">

          <div className="section-heading light">

            <span className="section-label">
              WHY ZONE360
            </span>

            <h2>
              Technology That Works For You
            </h2>

            <p>
              Practical technology designed around
              real-world requirements.
            </p>

          </div>


          <div className="benefit-grid">

            <Benefit
              number="01"
              title="Smart Technology"
              text="Modern solutions designed to make tracking, monitoring and automation easier."
            />

            <Benefit
              number="02"
              title="Easy To Use"
              text="Simple solutions that can be used without unnecessary complexity."
            />

            <Benefit
              number="03"
              title="Reliable Support"
              text="Get assistance during installation, setup and product usage."
            />

            <Benefit
              number="04"
              title="Built For Business"
              text="Solutions suitable for businesses, fleets, offices and commercial environments."
            />

          </div>

        </div>

      </section>


      {/* =================================================
          ZONE360 APP
      ================================================= */}

      <section className="app-section">

        <div className="container">

          <div className="app-section-inner">

            <div className="app-section-content">

              <span className="section-label">
                ZONE360 APP
              </span>

              <h2>
                Stay Connected With
                Your Devices
              </h2>

              <p>
                Monitor and manage your tracking
                solutions with an easy-to-use application.
              </p>


              <div className="app-feature-list">

                <div>
                  <span>✓</span>
                  Real-time monitoring
                </div>

                <div>
                  <span>✓</span>
                  Easy access
                </div>

                <div>
                  <span>✓</span>
                  Smart tracking
                </div>

                <div>
                  <span>✓</span>
                  Simple interface
                </div>

              </div>


              <Link
                to="/app"
                className="primary-button"
              >
                Explore Zone360 App
              </Link>

            </div>


            {/* NO PHONE MOCKUP */}

            <div className="app-section-visual">

              <div className="app-dashboard-card">

                <div className="dashboard-top">

                  <div className="dashboard-dot"></div>

                  <span>
                    ZONE360
                  </span>

                </div>


                <div className="dashboard-main">

                  <div className="dashboard-circle">
                    Z
                  </div>

                  <h3>
                    Smart Monitoring
                  </h3>

                  <p>
                    Your technology.
                    Your control.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          ABOUT
      ================================================= */}

      <section className="section about-section">

        <div className="container about-grid">

          <div className="about-visual">

            <div className="about-company-card">

              <div className="about-company-logo">
                Z360
              </div>

              <h3>
                Zone360
              </h3>

              <p>
                Smart Technology
                <br />
                Secure Tomorrow
              </p>

            </div>

          </div>


          <div className="about-content">

            <span className="section-label">
              ABOUT US
            </span>

            <h2>
              Making Technology
              Simple & Useful
            </h2>

            <p>
              Zone360 provides smart technology
              solutions focused on tracking,
              security and automation.
            </p>

            <p>
              We aim to provide reliable solutions
              that help individuals and businesses
              improve visibility, security and efficiency.
            </p>


            <div className="about-stats">

              <div>
                <strong>4+</strong>
                <span>Solutions</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Support</span>
              </div>

              <div>
                <strong>Smart</strong>
                <span>Technology</span>
              </div>

            </div>


            <Link
              to="/about"
              className="secondary-button"
            >
              Learn More
            </Link>

          </div>

        </div>

      </section>


      {/* =================================================
          CUSTOMER FEEDBACK
      ================================================= */}

      <section className="section testimonials-section">

        <div className="container">

          <div className="section-heading">

            <span className="section-label">
              CUSTOMER FEEDBACK
            </span>

            <h2>
              What Our Customers Say
            </h2>

            <p>
              Customer feedback section ready
              for your verified testimonials.
            </p>

          </div>


          <div className="testimonial-grid">

            <Testimonial
              text="Reliable tracking solution and professional support."
              type="Vehicle Tracking"
            />

            <Testimonial
              text="The solution is simple to use and useful for our business."
              type="Business Solution"
            />

            <Testimonial
              text="Good support during installation and setup."
              type="Security Solution"
            />

          </div>

        </div>

      </section>


      {/* =================================================
          CONTACT CTA
      ================================================= */}

      <section className="contact-cta">

        <div className="container contact-cta-inner">

          <div>

            <span className="section-label">
              LET'S CONNECT
            </span>

            <h2>
              Have A Requirement?
            </h2>

            <p>
              Talk to Zone360 about the right
              technology solution for your requirement.
            </p>

          </div>


          <Link
            to="/contact"
            className="cta-white-button"
          >
            Contact Us
          </Link>

        </div>

      </section>

    </>

  );

}


// =====================================================
// PRODUCT CARD
// =====================================================

function ProductCard({ product }) {

  return (

    <Link
      to={`/products/${product.id}`}
      className="product-card"
    >

      <div className="product-image">

        {product.image ? (

          <img
            src={product.image}
            alt={product.name}
          />

        ) : (

          <div className="product-placeholder">

            <div>
              Z360
            </div>

            <span>
              Smart Automation
            </span>

          </div>

        )}

      </div>


      <div className="product-card-content">

        <span className="product-category">
          {product.category}
        </span>

        <h3>
          {product.name}
        </h3>

        <p>
          {product.description}
        </p>


        <div className="product-card-bottom">

          <span className="product-price">
            {formatPrice(product.price)}
          </span>

          <span className="product-arrow">
            →
          </span>

        </div>

      </div>

    </Link>

  );

}


// =====================================================
// BENEFIT
// =====================================================

function Benefit({
  number,
  title,
  text,
}) {

  return (

    <div className="benefit-card">

      <div className="benefit-number">
        {number}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>

  );

}


// =====================================================
// TESTIMONIAL
// =====================================================

function Testimonial({
  text,
  type,
}) {

  return (

    <div className="testimonial-card">

      <div className="stars">
        ★★★★★
      </div>

      <p>
        "{text}"
      </p>

      <strong>
        Zone360 Customer
      </strong>

      <span>
        {type}
      </span>

    </div>

  );

}


export default Home;