import { useState } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaCreditCard, FaPaypal, FaMoneyBill } from 'react-icons/fa';
import Button from '../common/Button';

const PaymentFormContainer = styled.div`
  margin: 2rem 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const PaymentMethodsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const PaymentMethodCard = styled.div`
  flex: 1;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primary : theme.colors.border};
  background-color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const PaymentMethodHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  
  svg {
    font-size: 1.5rem;
  }
`;

const CardDetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

const SummaryContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 1rem;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    font-weight: bold;
  }
`;

const PaymentForm = ({ booking, onPaymentSubmit, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  
  const paymentSchema = Yup.object().shape({
    cardNumber: Yup.string()
      .when('paymentMethod', {
        is: 'credit_card',
        then: Yup.string()
          .required('Card number is required')
          .matches(/^[0-9]{16}$/, 'Card number must be 16 digits'),
      }),
    cardName: Yup.string()
      .when('paymentMethod', {
        is: 'credit_card',
        then: Yup.string().required('Name on card is required'),
      }),
    expiryDate: Yup.string()
      .when('paymentMethod', {
        is: 'credit_card',
        then: Yup.string()
          .required('Expiry date is required')
          .matches(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, 'Expiry date must be in MM/YY format'),
      }),
    cvv: Yup.string()
      .when('paymentMethod', {
        is: 'credit_card',
        then: Yup.string()
          .required('CVV is required')
          .matches(/^[0-9]{3,4}$/, 'CVV must be 3 or 4 digits'),
      }),
    email: Yup.string()
      .when('paymentMethod', {
        is: 'paypal',
        then: Yup.string().email('Invalid email').required('Email is required'),
      }),
  });
  
  const handleSubmit = (values) => {
    const paymentDetails = {
      ...values,
      paymentMethod,
    };
    
    onPaymentSubmit(paymentDetails);
  };
  
  return (
    <PaymentFormContainer>
      <h2>Payment</h2>
      
      <SummaryContainer>
        <h3>Booking Summary</h3>
        
        <SummaryRow>
          <span>Movie:</span>
          <span>{booking?.showtime?.movie?.title}</span>
        </SummaryRow>
        
        <SummaryRow>
          <span>Date & Time:</span>
          <span>
            {booking?.showtime?.start_time && new Date(booking.showtime.start_time).toLocaleString()}
          </span>
        </SummaryRow>
        
        <SummaryRow>
          <span>Seats:</span>
          <span>
            {booking?.seat_bookings?.map(sb => `${sb.seat.row}${sb.seat.number}`).join(', ')}
          </span>
        </SummaryRow>
        
        <SummaryRow>
          <span>Total Price:</span>
          <span>${booking?.total_price?.toFixed(2)}</span>
        </SummaryRow>
      </SummaryContainer>
      
      <Formik
        initialValues={{
          cardNumber: '',
          cardName: '',
          expiryDate: '',
          cvv: '',
          email: '',
          paymentMethod,
        }}
        validationSchema={paymentSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <h3>Select Payment Method</h3>
            
            <PaymentMethodsContainer>
              <PaymentMethodCard
                isSelected={paymentMethod === 'credit_card'}
                onClick={() => {
                  setPaymentMethod('credit_card');
                  setFieldValue('paymentMethod', 'credit_card');
                }}
              >
                <PaymentMethodHeader>
                  <FaCreditCard />
                  <span>Credit/Debit Card</span>
                </PaymentMethodHeader>
                <p>Pay securely with your card</p>
              </PaymentMethodCard>
              
              <PaymentMethodCard
                isSelected={paymentMethod === 'paypal'}
                onClick={() => {
                  setPaymentMethod('paypal');
                  setFieldValue('paymentMethod', 'paypal');
                }}
              >
                <PaymentMethodHeader>
                  <FaPaypal />
                  <span>PayPal</span>
                </PaymentMethodHeader>
                <p>Pay with your PayPal account</p>
              </PaymentMethodCard>
              
              <PaymentMethodCard
                isSelected={paymentMethod === 'cash'}
                onClick={() => {
                  setPaymentMethod('cash');
                  setFieldValue('paymentMethod', 'cash');
                }}
              >
                <PaymentMethodHeader>
                  <FaMoneyBill />
                  <span>Pay at Counter</span>
                </PaymentMethodHeader>
                <p>Pay when you arrive at the cinema</p>
              </PaymentMethodCard>
            </PaymentMethodsContainer>
            
            {paymentMethod === 'credit_card' && (
              <>
                <FormGroup>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" />
                  <ErrorMessage name="cardNumber" component={ErrorText} />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input type="text" id="cardName" name="cardName" placeholder="John Doe" />
                  <ErrorMessage name="cardName" component={ErrorText} />
                </FormGroup>
                
                <CardDetailsContainer>
                  <FormGroup>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" />
                    <ErrorMessage name="expiryDate" component={ErrorText} />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input type="text" id="cvv" name="cvv" placeholder="123" />
                    <ErrorMessage name="cvv" component={ErrorText} />
                  </FormGroup>
                </CardDetailsContainer>
              </>
            )}
            
            {paymentMethod === 'paypal' && (
              <FormGroup>
                <Label htmlFor="email">PayPal Email</Label>
                <Input type="email" id="email" name="email" placeholder="your@email.com" />
                <ErrorMessage name="email" component={ErrorText} />
              </FormGroup>
            )}
            
            {paymentMethod === 'cash' && (
              <p>
                Your booking will be reserved for 30 minutes. Please arrive at least 15 minutes before the showtime to make your payment at the counter.
              </p>
            )}
            
            <ButtonContainer>
              <Button type="button" variant="secondary" onClick={onCancel}>
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Complete Payment
              </Button>
            </ButtonContainer>
          </Form>
        )}
      </Formik>
    </PaymentFormContainer>
  );
};

export default PaymentForm;
