import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: ${({ fullPage }) => fullPage ? 'calc(100vh - 200px)' : 'auto'};
`;

const Spinner = styled.div`
  width: ${({ size }) => size || '40px'};
  height: ${({ size }) => size || '40px'};
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
`;

const Loading = ({ text = 'Loading...', size, fullPage = false }) => {
  return (
    <LoadingContainer fullPage={fullPage}>
      <Spinner size={size} />
      {text && <LoadingText>{text}</LoadingText>}
    </LoadingContainer>
  );
};

export default Loading;
