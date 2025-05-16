import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/common/Button';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 60vh;
  padding: 2rem;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
`;

const ErrorMessage = styled.h2`
  margin-bottom: 2rem;
`;

const ErrorDescription = styled.p`
  max-width: 600px;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <ErrorIcon>
        <FaExclamationTriangle />
      </ErrorIcon>
      <ErrorCode>404</ErrorCode>
      <ErrorMessage>Page Not Found</ErrorMessage>
      <ErrorDescription>
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </ErrorDescription>
      <Button as={Link} to="/">
        Back to Home
      </Button>
    </NotFoundContainer>
  );
};

export default NotFoundPage;
