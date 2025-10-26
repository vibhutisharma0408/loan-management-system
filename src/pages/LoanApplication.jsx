import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import PersonalInfo from '../components/loan-application/PersonalInfo';
import FinancialInfo from '../components/loan-application/FinancialInfo';
import LoanDetails from '../components/loan-application/LoanDetails';
import DocumentUpload from '../components/loan-application/DocumentUpload';
import Review from '../components/loan-application/Review';
import '../styles/main.css';

const LoanApplication = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem('loanAppCurrentStep');
    return savedStep ? parseInt(savedStep) : 1;
  });
  
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('loanAppFormData');
    return savedData ? JSON.parse(savedData) : {
      personalInfo: {},
      financialInfo: {},
      loanDetails: {},
      documents: {}
    };
  });

  // Save current step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('loanAppCurrentStep', currentStep.toString());
  }, [currentStep]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('loanAppFormData', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (step, data) => {
    setFormData(prev => ({
      ...prev,
      [step]: data
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const applicationData = {
        userId: currentUser.uid,
        status: 'pending',
        createdAt: new Date(),
        ...formData.personalInfo,
        ...formData.financialInfo,
        ...formData.loanDetails,
        documents: formData.documents
      };

      const docRef = await addDoc(collection(db, 'loanApplications'), applicationData);
      
      // Clear the stored data after successful submission
      localStorage.removeItem('loanAppFormData');
      localStorage.removeItem('loanAppCurrentStep');
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfo
            data={formData.personalInfo}
            updateData={(data) => updateFormData('personalInfo', data)}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <FinancialInfo
            data={formData.financialInfo}
            updateData={(data) => updateFormData('financialInfo', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <LoanDetails
            data={formData.loanDetails}
            updateData={(data) => updateFormData('loanDetails', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <DocumentUpload
            data={formData.documents}
            updateData={(data) => updateFormData('documents', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <Review
            data={formData}
            onSubmit={handleSubmit}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="loan-application-container">
      <div className="progress-bar">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`progress-step ${currentStep >= step ? 'active' : ''}`}
          >
            <div className="step-number">{step}</div>
            <div className="step-label">
              {step === 1 && 'Personal Info'}
              {step === 2 && 'Financial Info'}
              {step === 3 && 'Loan Details'}
              {step === 4 && 'Documents'}
              {step === 5 && 'Review'}
            </div>
          </div>
        ))}
      </div>
      <div className="form-container">
        {renderStep()}
      </div>
    </div>
  );
};

export default LoanApplication; 