import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Grid,
  GridItem,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';

const PersonalInfo = ({ data, updateData, onNext }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    ...data
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email format';
        break;
      case 'phone':
        if (!value) error = 'Phone number is required';
        else if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) 
          error = 'Phone number must be 10 digits';
        break;
      case 'dateOfBirth':
        if (!value) error = 'Date of birth is required';
        else {
          const age = new Date().getFullYear() - new Date(value).getFullYear();
          if (age < 18) error = 'Must be at least 18 years old';
        }
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
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={errors.firstName}>
            <FormLabel>First Name</FormLabel>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
            <FormErrorMessage>{errors.firstName}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={errors.lastName}>
            <FormLabel>Last Name</FormLabel>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
            <FormErrorMessage>{errors.lastName}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>

      <FormControl isInvalid={errors.email}>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        <FormErrorMessage>{errors.email}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.phone}>
        <FormLabel>Phone Number</FormLabel>
        <Input
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
        />
        <FormErrorMessage>{errors.phone}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.dateOfBirth}>
        <FormLabel>Date of Birth</FormLabel>
        <Input
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
        <FormErrorMessage>{errors.dateOfBirth}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.address}>
        <FormLabel>Address</FormLabel>
        <Input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your street address"
        />
        <FormErrorMessage>{errors.address}</FormErrorMessage>
      </FormControl>

      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={errors.city}>
            <FormLabel>City</FormLabel>
            <Input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
            <FormErrorMessage>{errors.city}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={errors.state}>
            <FormLabel>State</FormLabel>
            <Input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />
            <FormErrorMessage>{errors.state}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={errors.zipCode}>
            <FormLabel>ZIP Code</FormLabel>
            <Input
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="ZIP Code"
            />
            <FormErrorMessage>{errors.zipCode}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>

      <Button colorScheme="blue" onClick={handleNext}>
        Next
      </Button>
    </VStack>
  );
};

export default PersonalInfo; 