import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
} from '@chakra-ui/react';

const loanTypes = [
  {
    id: 'personal',
    name: 'Personal Loan',
    minAmount: 1000,
    maxAmount: 50000,
    minTerm: 12,
    maxTerm: 60,
    baseRate: 0.0599,
  },
  {
    id: 'business',
    name: 'Business Loan',
    minAmount: 10000,
    maxAmount: 100000,
    minTerm: 12,
    maxTerm: 84,
    baseRate: 0.0699,
  },
  {
    id: 'mortgage',
    name: 'Mortgage',
    minAmount: 50000,
    maxAmount: 500000,
    minTerm: 180,
    maxTerm: 360,
    baseRate: 0.0499,
  },
  {
    id: 'auto',
    name: 'Auto Loan',
    minAmount: 5000,
    maxAmount: 75000,
    minTerm: 24,
    maxTerm: 84,
    baseRate: 0.0399,
  },
];

const LoanComparison = () => {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [loanTerm, setLoanTerm] = useState(36);
  const [creditScore, setCreditScore] = useState(700);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const calculateInterestRate = (baseRate, creditScore) => {
    if (creditScore >= 800) return baseRate - 0.02;
    if (creditScore >= 700) return baseRate - 0.01;
    if (creditScore >= 600) return baseRate;
    return baseRate + 0.02;
  };

  const calculateMonthlyPayment = (amount, rate, term) => {
    const monthlyRate = rate / 12;
    return (
      (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
      (Math.pow(1 + monthlyRate, term) - 1)
    );
  };

  const calculateTotalPayment = (monthlyPayment, term) => {
    return monthlyPayment * term;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (rate) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rate);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Loan Comparison</Heading>
          <Text color="gray.600">Compare different loan options and find the best fit for you</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box
            p={6}
            bg={bgColor}
            borderWidth={1}
            borderColor={borderColor}
            borderRadius="lg"
          >
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Loan Amount</FormLabel>
                <NumberInput
                  min={1000}
                  max={500000}
                  value={loanAmount}
                  onChange={(value) => setLoanAmount(Number(value))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Loan Term (months)</FormLabel>
                <NumberInput
                  min={12}
                  max={360}
                  value={loanTerm}
                  onChange={(value) => setLoanTerm(Number(value))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Credit Score</FormLabel>
                <NumberInput
                  min={300}
                  max={850}
                  value={creditScore}
                  onChange={(value) => setCreditScore(Number(value))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </VStack>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {loanTypes.map((loanType) => {
              const interestRate = calculateInterestRate(loanType.baseRate, creditScore);
              const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm);
              const totalPayment = calculateTotalPayment(monthlyPayment, loanTerm);

              return (
                <Card key={loanType.id} bg={bgColor} borderWidth={1} borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">{loanType.name}</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={2}>
                      <HStack justify="space-between">
                        <Text>Interest Rate:</Text>
                        <Text fontWeight="bold">{formatPercentage(interestRate)}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Monthly Payment:</Text>
                        <Text fontWeight="bold">{formatCurrency(monthlyPayment)}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Total Payment:</Text>
                        <Text fontWeight="bold">{formatCurrency(totalPayment)}</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                  <CardFooter>
                    <Button
                      colorScheme="blue"
                      width="100%"
                      isDisabled={
                        loanAmount < loanType.minAmount ||
                        loanAmount > loanType.maxAmount ||
                        loanTerm < loanType.minTerm ||
                        loanTerm > loanType.maxTerm
                      }
                    >
                      Apply Now
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </SimpleGrid>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default LoanComparison; 