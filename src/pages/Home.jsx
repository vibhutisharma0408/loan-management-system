import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Feature = ({ title, text }) => {
  return (
    <div className="feature-card">
      <h3 className="feature-title">{title}</h3>
      <p className="feature-text">{text}</p>
    </div>
  );
};

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to QuickLoan</h1>
        <p className="hero-subtitle">
          Your trusted partner for quick and easy loans
        </p>
        {!user && (
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
          </div>
        )}
        {user && (
          <div className="hero-buttons">
            <Link to="/loan-application" className="btn btn-primary">
              Apply for Loan
            </Link>
            <Link to="/dashboard" className="btn btn-outline">
              View Dashboard
            </Link>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="features-grid">
          <Feature
            title="Quick Approval"
            text="Get your loan approved within 24 hours with minimal documentation"
          />
          <Feature
            title="Competitive Rates"
            text="Enjoy the best interest rates in the market with flexible repayment options"
          />
          <Feature
            title="Secure Process"
            text="Your data is protected with bank-level security and encryption"
          />
          <Feature
            title="24/7 Support"
            text="Our customer support team is always ready to help you"
          />
        </div>
      </div>

      <div className="cta-section">
        <h2 className="section-title">Ready to Get Started?</h2>
        <p className="cta-text">
          Join thousands of satisfied customers who have already benefited from our services
        </p>
        <Link to={user ? "/loan-application" : "/register"} className="btn btn-primary">
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default Home; 