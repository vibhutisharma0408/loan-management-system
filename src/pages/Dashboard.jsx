import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
  'under-review': 'blue',
};

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!currentUser) return;
      
      try {
        setError('');
        const q = query(
          collection(db, 'loanApplications'),
          where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const apps = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            personalInfo: data?.personalInfo || {},
            financialInfo: data?.financialInfo || {},
            loanDetails: data?.loanDetails || {},
            documents: data?.documents || {},
            status: data?.status || 'pending',
            createdAt: data?.createdAt || new Date(),
            userId: data?.userId
          };
        });
        setApplications(apps);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    if (date.toDate) {
      return date.toDate().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome Back!</h1>
        <p className="dashboard-subtitle">Track your loan applications and status</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="no-applications">
          <p>You haven't submitted any loan applications yet.</p>
        </div>
      ) : (
        <div className="applications-grid">
          {applications.map((app) => (
            <div key={app.id} className="application-card">
              <div className="application-header">
                <h3>{app?.loanDetails?.loanType || 'Loan Application'}</h3>
                <span className={`status-badge status-${app?.status || 'pending'}`}>
                  {app?.status || 'Pending'}
                </span>
              </div>
              <div className="application-details">
                <p><strong>Amount:</strong> {formatCurrency(app?.loanDetails?.loanAmount)}</p>
                <p><strong>Term:</strong> {app?.loanDetails?.loanTerm || 'N/A'} months</p>
                <p><strong>Submitted:</strong> {formatDate(app?.createdAt)}</p>
                <p><strong>Name:</strong> {`${app?.personalInfo?.firstName || ''} ${app?.personalInfo?.lastName || ''}`}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 