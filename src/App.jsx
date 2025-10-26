import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LoanApplication from './pages/LoanApplication';
import RepaymentCalendar from './pages/RepaymentCalendar';
import LoanComparison from './pages/LoanComparison';

function App() {
  return (
    <ChakraProvider>
      <CSSReset />
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/apply"
                element={
                  <PrivateRoute>
                    <LoanApplication />
                  </PrivateRoute>
                }
              />
              <Route
                path="/repayment"
                element={
                  <PrivateRoute>
                    <RepaymentCalendar />
                  </PrivateRoute>
                }
              />
              <Route
                path="/compare"
                element={
                  <PrivateRoute>
                    <LoanComparison />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
