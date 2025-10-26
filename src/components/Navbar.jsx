import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          LoanApp
        </Link>
        <div className="nav-links">
          {currentUser ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/apply">Apply for Loan</Link>
              <Link to="/repayment">Repayment</Link>
              <Link to="/compare">Compare Loans</Link>
              <button onClick={logout} className="btn btn-outline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 