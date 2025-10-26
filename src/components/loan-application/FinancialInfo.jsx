import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Grid,
  GridItem,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';

const FinancialInfo = ({ data, updateData, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    employmentStatus: '',
    employerName: '',
    monthlyIncome: '',
    otherIncome: '',
    monthlyExpenses: '',
    rentMortgage: '',
    otherLoans: '',
    creditScore: '',
    ...data
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'monthlyIncome':
      case 'otherIncome':
      case 'monthlyExpenses':
      case 'rentMortgage':
      case 'otherLoans':
        if (!value) error = 'This field is required';
        else if (isNaN(value) || value < 0) error = 'Must be a positive number';
        break;
      case 'creditScore':
        if (!value) error = 'Credit score is required';
        else if (isNaN(value) || value < 300 || value > 850) 
          error = 'Credit score must be between 300 and 850';
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
    <VStack spacing={4} align="stretch">
      <FormControl isInvalid={errors.employmentStatus}>
        <FormLabel>Employment Status</FormLabel>
        <Select
          name="employmentStatus"
          value={formData.employmentStatus}
          onChange={handleChange}
          placeholder="Select employment status"
        >
          <option value="employed">Employed</option>
          <option value="self-employed">Self-Employed</option>
          <option value="business-owner">Business Owner</option>
          <option value="retired">Retired</option>
          <option value="unemployed">Unemployed</option>
        </Select>
        <FormErrorMessage>{errors.employmentStatus}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.employerName}>
        <FormLabel>Employer Name</FormLabel>
        <Input
          name="employerName"
          value={formData.employerName}
          onChange={handleChange}
          placeholder="Enter your employer's name"
        />
        <FormErrorMessage>{errors.employerName}</FormErrorMessage>
      </FormControl>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={errors.monthlyIncome}>
            <FormLabel>Monthly Income</FormLabel>
            <NumberInput
              min={0}
              value={formData.monthlyIncome}
              onChange={(value) => handleNumberChange('monthlyIncome', value)}
            >
              <NumberInputField placeholder="Enter monthly income" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.monthlyIncome}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={errors.otherIncome}>
            <FormLabel>Other Monthly Income</FormLabel>
            <NumberInput
              min={0}
              value={formData.otherIncome}
              onChange={(value) => handleNumberChange('otherIncome', value)}
            >
              <NumberInputField placeholder="Enter other income" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.otherIncome}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={errors.monthlyExpenses}>
            <FormLabel>Monthly Expenses</FormLabel>
            <NumberInput
              min={0}
              value={formData.monthlyExpenses}
              onChange={(value) => handleNumberChange('monthlyExpenses', value)}
            >
              <NumberInputField placeholder="Enter monthly expenses" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.monthlyExpenses}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={errors.rentMortgage}>
            <FormLabel>Rent/Mortgage Payment</FormLabel>
            <NumberInput
              min={0}
              value={formData.rentMortgage}
              onChange={(value) => handleNumberChange('rentMortgage', value)}
            >
              <NumberInputField placeholder="Enter rent/mortgage payment" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.rentMortgage}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>

      <FormControl isInvalid={errors.otherLoans}>
        <FormLabel>Other Monthly Loan Payments</FormLabel>
        <NumberInput
          min={0}
          value={formData.otherLoans}
          onChange={(value) => handleNumberChange('otherLoans', value)}
        >
          <NumberInputField placeholder="Enter other loan payments" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{errors.otherLoans}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.creditScore}>
        <FormLabel>Credit Score</FormLabel>
        <NumberInput
          min={300}
          max={850}
          value={formData.creditScore}
          onChange={(value) => handleNumberChange('creditScore', value)}
        >
          <NumberInputField placeholder="Enter your credit score" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{errors.creditScore}</FormErrorMessage>
      </FormControl>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={handleNext} colorScheme="blue">
          Next
        </Button>
      </Grid>
    </VStack>
  );
};

export default FinancialInfo; 