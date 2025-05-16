import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 150%; /* 2:3 aspect ratio for movie posters */
  position: relative;
  overflow: hidden;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  ${CardContainer}:hover & img {
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const CardTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardSubtitle = styled.p`
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CardText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Card = ({ 
  image, 
  title, 
  subtitle, 
  text, 
  footer,
  onClick
}) => {
  return (
    <CardContainer onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {image && (
        <CardImage>
          <img src={image} alt={title} />
        </CardImage>
      )}
      <CardContent>
        {title && <CardTitle>{title}</CardTitle>}
        {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        {text && <CardText>{text}</CardText>}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </CardContainer>
  );
};

export default Card;
