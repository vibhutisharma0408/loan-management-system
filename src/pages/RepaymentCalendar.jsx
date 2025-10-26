import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Spinner,
  Button,
  useToast,
} from '@chakra-ui/react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const RepaymentCalendar = () => {
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchRepayments();
  }, [currentUser]);

  const fetchRepayments = async () => {
    try {
      const q = query(
        collection(db, 'loanApplications'),
        where('userId', '==', currentUser.uid),
        where('status', '==', 'approved')
      );
      const querySnapshot = await getDocs(q);
      const apps = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Generate repayment schedule for each approved loan
      const allRepayments = apps.flatMap(app => {
        const monthlyPayment = calculateMonthlyPayment(
          app.loanDetails.loanAmount,
          app.loanDetails.loanTerm
        );
        return generateRepaymentSchedule(
          app.id,
          app.loanDetails.loanAmount,
          monthlyPayment,
          app.loanDetails.loanTerm,
          app.createdAt.toDate()
        );
      });

      setRepayments(allRepayments);
    } catch (error) {
      console.error('Error fetching repayments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch repayment schedule',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyPayment = (loanAmount, term) => {
    const annualInterestRate = 0.05; // 5% annual interest rate
    const monthlyRate = annualInterestRate / 12;
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
      (Math.pow(1 + monthlyRate, term) - 1);
    return monthlyPayment;
  };

  const generateRepaymentSchedule = (loanId, loanAmount, monthlyPayment, term, startDate) => {
    const schedule = [];
    let remainingBalance = loanAmount;

    for (let i = 0; i < term; i++) {
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + i + 1);

      const interest = remainingBalance * 0.05 / 12;
      const principal = monthlyPayment - interest;
      remainingBalance -= principal;

      schedule.push({
        id: `${loanId}-${i + 1}`,
        loanId,
        paymentNumber: i + 1,
        dueDate: paymentDate,
        amount: monthlyPayment,
        principal,
        interest,
        remainingBalance,
        status: 'pending'
      });
    }

    return schedule;
  };

  const handlePayment = async (repayment) => {
    try {
      // In a real application, this would integrate with a payment gateway
      const updatedRepayment = {
        ...repayment,
        status: 'paid',
        paidDate: new Date()
      };

      // Update the repayment status in Firestore
      await updateDoc(doc(db, 'repayments', repayment.id), updatedRepayment);

      setRepayments(prev =>
        prev.map(r => (r.id === repayment.id ? updatedRepayment : r))
      );

      toast({
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Repayment Schedule</Heading>
          <Text color="gray.600">View and manage your loan repayments</Text>
        </Box>

        <Box
          overflowX="auto"
          bg={bgColor}
          borderWidth={1}
          borderColor={borderColor}
          borderRadius="lg"
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Payment #</Th>
                <Th>Due Date</Th>
                <Th>Amount</Th>
                <Th>Principal</Th>
                <Th>Interest</Th>
                <Th>Remaining Balance</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {repayments.map((repayment) => (
                <Tr key={repayment.id}>
                  <Td>{repayment.paymentNumber}</Td>
                  <Td>{repayment.dueDate.toLocaleDateString()}</Td>
                  <Td>{formatCurrency(repayment.amount)}</Td>
                  <Td>{formatCurrency(repayment.principal)}</Td>
                  <Td>{formatCurrency(repayment.interest)}</Td>
                  <Td>{formatCurrency(repayment.remainingBalance)}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        repayment.status === 'paid' ? 'green' :
                        new Date() > repayment.dueDate ? 'red' : 'yellow'
                      }
                    >
                      {repayment.status}
                    </Badge>
                  </Td>
                  <Td>
                    {repayment.status === 'pending' && (
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handlePayment(repayment)}
                      >
                        Pay Now
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  );
};

export default RepaymentCalendar; 