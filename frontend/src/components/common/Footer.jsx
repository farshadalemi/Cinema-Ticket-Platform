import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 2rem 0;
  margin-top: 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  a {
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: none;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  a {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 1.5rem;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>Cinema Tickets</h3>
          <p>Your premier destination for movie tickets and entertainment.</p>
          <SocialLinks>
            <a href="#" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="YouTube">
              <FaYoutube />
            </a>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/movies">Movies</a></li>
            <li><a href="/profile">My Account</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </FooterSection>
        
        <FooterSection>
          <h3>Contact Us</h3>
          <ul>
            <li>Email: support@cinematickets.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Movie Lane, Hollywood, CA 90210</li>
          </ul>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        &copy; {currentYear} Cinema Tickets. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
