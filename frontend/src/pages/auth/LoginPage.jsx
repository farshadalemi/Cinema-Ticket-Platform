import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaLock } from 'react-icons/fa';
import { useAuthController } from '../../controllers/AuthController';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

const LoginContainer = styled.div`
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

const ForgotPassword = styled(Link)`
  display: block;
  text-align: right;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const RegisterLink = styled.div`
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

const LoginPage = () => {
  const { login, loading, error, isAuthenticated } = useAuthController();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  const initialValues = {
    username: '',
    password: '',
  };
  
  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await login(values.username, values.password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <LoginContainer>
      <h2 className="text-center mb-4">Login to Your Account</h2>
      
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
                <Input type="text" id="username" name="username" placeholder="Enter your username" />
              </InputWrapper>
              <ErrorMessage name="username" component={ErrorText} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <InputWrapper>
                <FaLock />
                <Input type="password" id="password" name="password" placeholder="Enter your password" />
              </InputWrapper>
              <ErrorMessage name="password" component={ErrorText} />
              <ForgotPassword to="/forgot-password">Forgot password?</ForgotPassword>
            </FormGroup>
            
            {error && (
              <ErrorText>{error.message || 'An error occurred during login'}</ErrorText>
            )}
            
            <Button type="submit" fullWidth disabled={isSubmitting || loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        )}
      </Formik>
      
      <RegisterLink>
        Don't have an account? <Link to="/register">Register now</Link>
      </RegisterLink>
    </LoginContainer>
  );
};

export default LoginPage;
