import styled, { css } from 'styled-components';

const ButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ size }) => 
    size === 'small' ? '0.4em 0.8em' : 
    size === 'large' ? '0.8em 1.6em' : 
    '0.6em 1.2em'};
  font-size: ${({ size }) => 
    size === 'small' ? '0.9em' : 
    size === 'large' ? '1.1em' : 
    '1em'};
  font-weight: 500;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: #333;
          color: ${theme.colors.text};
          &:hover:not(:disabled) {
            background-color: #444;
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary};
            color: white;
          }
        `;
      case 'text':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          padding: 0.4em 0.6em;
          &:hover:not(:disabled) {
            background-color: rgba(229, 9, 20, 0.1);
          }
        `;
      default: // primary
        return css`
          background-color: ${theme.colors.primary};
          color: white;
          &:hover:not(:disabled) {
            background-color: #ff424f;
          }
        `;
    }
  }}
  
  &:disabled {
    background-color: #666;
    color: #999;
    cursor: not-allowed;
  }
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  svg {
    margin-right: ${({ iconOnly }) => iconOnly ? '0' : '0.5em'};
  }
`;

const StyledButton = styled.button`
  ${ButtonStyles}
`;

const StyledLink = styled.a`
  ${ButtonStyles}
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false,
  iconOnly = false,
  as = 'button',
  ...props 
}) => {
  const ButtonComponent = as === 'a' ? StyledLink : StyledButton;
  
  return (
    <ButtonComponent
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      iconOnly={iconOnly}
      {...props}
    >
      {children}
    </ButtonComponent>
  );
};

export default Button;
