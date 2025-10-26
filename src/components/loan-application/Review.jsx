import {
  VStack,
  Box,
  Text,
  Button,
  Divider,
  Grid,
  GridItem,
  Heading,
  useToast,
} from '@chakra-ui/react';

const Review = ({ data, onSubmit, loading }) => {
  const toast = useToast();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderSection = (title, data) => (
    <Box>
      <Heading size="md" mb={4}>{title}</Heading>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        {Object.entries(data).map(([key, value]) => (
          <GridItem key={key}>
            <Text fontWeight="bold" textTransform="capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}:
            </Text>
            <Text>
              {typeof value === 'object' && value !== null
                ? value.name || value.url
                : value}
            </Text>
          </GridItem>
        ))}
      </Grid>
      <Divider my={4} />
    </Box>
  );

  const handleSubmit = async () => {
    try {
      await onSubmit();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg" mb={4}>Review Your Application</Heading>
      
      {renderSection('Personal Information', data.personalInfo)}
      {renderSection('Financial Information', data.financialInfo)}
      {renderSection('Loan Details', data.loanDetails)}
      {renderSection('Documents', data.documents)}

      <Box>
        <Heading size="md" mb={4}>Summary</Heading>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem>
            <Text fontWeight="bold">Total Monthly Income:</Text>
            <Text>
              {formatCurrency(
                Number(data.financialInfo.monthlyIncome || 0) +
                Number(data.financialInfo.otherIncome || 0)
              )}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold">Total Monthly Expenses:</Text>
            <Text>
              {formatCurrency(
                Number(data.financialInfo.monthlyExpenses || 0) +
                Number(data.financialInfo.rentMortgage || 0) +
                Number(data.financialInfo.otherLoans || 0)
              )}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold">Loan Amount:</Text>
            <Text>{formatCurrency(data.loanDetails.loanAmount)}</Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold">Loan Term:</Text>
            <Text>{data.loanDetails.loanTerm} months</Text>
          </GridItem>
        </Grid>
      </Box>

      <Button
        colorScheme="blue"
        size="lg"
        onClick={handleSubmit}
        isLoading={loading}
        loadingText="Submitting..."
      >
        Submit Application
      </Button>
    </VStack>
  );
};

export default Review; 