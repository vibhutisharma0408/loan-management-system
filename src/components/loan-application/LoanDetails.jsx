import { useState } from 'react';

const LoanDetails = ({ data, updateData, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    loanAmount: '',
    loanPurpose: '',
    loanTerm: '',
    interestRate: '',
    ...data
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'loanAmount':
        if (!value) error = 'Loan amount is required';
        else if (isNaN(value) || value <= 0) error = 'Must be a positive number';
        break;
      case 'loanTerm':
        if (!value) error = 'Loan term is required';
        else if (isNaN(value) || value <= 0) error = 'Must be a positive number';
        break;
      case 'interestRate':
        if (!value) error = 'Interest rate is required';
        else if (isNaN(value) || value < 0 || value > 100) 
          error = 'Must be between 0 and 100';
        break;
      default:
        if (!value) error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleNumberChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleNext = () => {
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length === 0) {
      updateData(formData);
      onNext();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="loan-details">
      <div className="form-group">
        <label className="form-label">Loan Amount</label>
        <input
          type="number"
          name="loanAmount"
          value={formData.loanAmount}
          onChange={handleChange}
          className="form-input"
          placeholder="Enter loan amount"
        />
        {errors.loanAmount && <div className="form-error">{errors.loanAmount}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Loan Purpose</label>
        <select
          name="loanPurpose"
          value={formData.loanPurpose}
          onChange={handleChange}
          className="form-input"
        >
          <option value="">Select loan purpose</option>
          <option value="home">Home Purchase</option>
          <option value="car">Car Purchase</option>
          <option value="education">Education</option>
          <option value="business">Business</option>
          <option value="debt">Debt Consolidation</option>
          <option value="other">Other</option>
        </select>
        {errors.loanPurpose && <div className="form-error">{errors.loanPurpose}</div>}
      </div>

      <div className="grid grid-2">
        <div className="form-group">
          <label className="form-label">Loan Term (months)</label>
          <input
            type="number"
            name="loanTerm"
            value={formData.loanTerm}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter loan term"
          />
          {errors.loanTerm && <div className="form-error">{errors.loanTerm}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Interest Rate (%)</label>
          <input
            type="number"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter interest rate"
            step="0.01"
          />
          {errors.interestRate && <div className="form-error">{errors.interestRate}</div>}
        </div>
      </div>

      <div className="button-group">
        <button onClick={onBack} className="button button-secondary">
          Back
        </button>
        <button onClick={handleNext} className="button button-primary">
          Next
        </button>
      </div>
    </div>
  );
};

export default LoanDetails; 