import { Link } from "react-router-dom";

function Home() {
  return (
    <div>

      {/* Hero Section */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-label">
            AI-POWERED BUSINESS PLATFORM
          </p>

          <h1>
            Manage your business.
            <br />
            <span>Grow with confidence.</span>
          </h1>

          <p className="hero-description">
            Zone 360 brings leads, customers, sales,
            automation and business insights together
            in one powerful platform.
          </p>

          <div className="hero-buttons">

            <Link
              to="/signup"
              className="primary-button"
            >
              Get Started
            </Link>

            <Link
              to="/pricing"
              className="secondary-button"
            >
              View Pricing
            </Link>

          </div>

        </div>

      </section>


      {/* Introduction */}

      <section className="intro-section">

        <p className="section-label">
          ONE PLATFORM
        </p>

        <h2>
          Everything your business needs
        </h2>

        <p className="section-description">
          Zone 360 helps businesses manage their
          day-to-day operations through a connected
          digital platform.
        </p>

      </section>


      {/* Features Preview */}

      <section className="features-preview">

        <div className="feature-card">

          <div className="feature-icon">
            01
          </div>

          <h3>
            Lead Management
          </h3>

          <p>
            Capture, organize and manage your
            business leads from one place.
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            02
          </div>

          <h3>
            Customer Management
          </h3>

          <p>
            Keep your customer information and
            business relationships organized.
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            03
          </div>

          <h3>
            Analytics
          </h3>

          <p>
            Turn your business data into useful
            insights and better decisions.
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            04
          </div>

          <h3>
            Automation
          </h3>

          <p>
            Reduce repetitive tasks and improve
            your team's productivity.
          </p>

        </div>

      </section>


      {/* How It Works */}

      <section className="how-section">

        <div className="how-content">

          <p className="section-label">
            HOW IT WORKS
          </p>

          <h2>
            From leads to growth
          </h2>

          <p>
            Zone 360 connects the important parts
            of your business into one workflow.
          </p>

        </div>


        <div className="workflow">

          <div className="workflow-step">
            <strong>01</strong>
            <span>Capture</span>
          </div>

          <div className="workflow-arrow">
            →
          </div>

          <div className="workflow-step">
            <strong>02</strong>
            <span>Manage</span>
          </div>

          <div className="workflow-arrow">
            →
          </div>

          <div className="workflow-step">
            <strong>03</strong>
            <span>Automate</span>
          </div>

          <div className="workflow-arrow">
            →
          </div>

          <div className="workflow-step">
            <strong>04</strong>
            <span>Grow</span>
          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="cta-section">

        <h2>
          Ready to build a smarter business?
        </h2>

        <p>
          Start exploring Zone 360 today.
        </p>

        <Link
          to="/signup"
          className="primary-button"
        >
          Get Started
        </Link>

      </section>

    </div>
  );
}

export default Home;