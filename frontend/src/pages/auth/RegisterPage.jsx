import { Link, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaUserAlt } from 'react-icons/fa';
import { useAuthController } from '../../controllers/AuthController';
import Button from '../../components/common/Button';

const RegisterContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const InputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Input = styled(Field)`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: rgba(0, 0, 0, 0.2);
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

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterPage = () => {
  const { register, loading, error, isAuthenticated } = useAuthController();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone_number: '',
  };
  
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be at most 20 characters')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    full_name: Yup.string()
      .required('Full name is required'),
    phone_number: Yup.string()
      .matches(/^[0-9+\-\s()]*$/, 'Invalid phone number')
      .nullable(),
  });
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = values;
      await register(userData);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <RegisterContainer>
      <h2 className="text-center mb-4">Create an Account</h2>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <InputWrapper>
                <FaUser />
                <Input type="text" id="username" name="username" placeholder="Choose a username" />
              </InputWrapper>
              <ErrorMessage name="username" component={ErrorText} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <InputWrapper>
                <FaEnvelope />
                <Input type="email" id="email" name="email" placeholder="Enter your email" />
              </InputWrapper>
              <ErrorMessage name="email" component={ErrorText} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="full_name">Full Name</Label>
              <InputWrapper>
                <FaUserAlt />
                <Input type="text" id="full_name" name="full_name" placeholder="Enter your full name" />
              </InputWrapper>
              <ErrorMessage name="full_name" component={ErrorText} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="phone_number">Phone Number (Optional)</Label>
              <InputWrapper>
                <FaPhone />
                <Input type="text" id="phone_number" name="phone_number" placeholder="Enter your phone number" />
              </InputWrapper>
              <ErrorMessage name="phone_number" component={ErrorText} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <InputWrapper>
                <FaLock />
                <Input type="password" id="password" name="password" placeholder="Create a password" />
              </InputWrapper>
              <ErrorMessage name="password" component={ErrorText} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <InputWrapper>
                <FaLock />
                <Input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" />
              </InputWrapper>
              <ErrorMessage name="confirmPassword" component={ErrorText} />
            </FormGroup>
            
            {error && (
              <ErrorText>{error.message || 'An error occurred during registration'}</ErrorText>
            )}
            
            <Button type="submit" fullWidth disabled={isSubmitting || loading}>
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Form>
        )}
      </Formik>
      
      <LoginLink>
        Already have an account? <Link to="/login">Login</Link>
      </LoginLink>
    </RegisterContainer>
  );
};

export default RegisterPage;
