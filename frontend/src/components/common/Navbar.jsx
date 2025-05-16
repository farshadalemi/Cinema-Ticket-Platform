import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaSignOutAlt, FaTicketAlt, FaFilm, FaUserShield } from 'react-icons/fa';
import AuthService from '../../services/AuthService';

const NavbarContainer = styled.nav`
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background-color: ${({ theme }) => theme.colors.secondary};
    padding: 1rem;
    z-index: 10;
  }
`;

const NavLink = styled(Link)`
  margin-left: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin: 0.5rem 0;
  }
`;

const NavButton = styled.button`
  margin-left: 1.5rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.6em 1.2em;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: none;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin: 0.5rem 0;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(AuthService.isAuthenticated());
      setIsAdmin(AuthService.isAdmin());
    };
    
    checkAuth();
    
    // Check auth status when window gains focus
    window.addEventListener('focus', checkAuth);
    
    return () => {
      window.removeEventListener('focus', checkAuth);
    };
  }, []);
  
  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/login');
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <NavbarContainer>
      <NavbarContent>
        <Logo to="/">
          <FaTicketAlt /> Cinema Tickets
        </Logo>
        
        <MobileMenuButton onClick={toggleMenu}>
          ☰
        </MobileMenuButton>
        
        <NavLinks isOpen={isMenuOpen}>
          <NavLink to="/">
            <FaFilm /> Movies
          </NavLink>
          
          {isAuthenticated ? (
            <>
              <NavLink to="/profile">
                <FaUser /> Profile
              </NavLink>
              
              {isAdmin && (
                <NavLink to="/admin">
                  <FaUserShield /> Admin
                </NavLink>
              )}
              
              <NavButton onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </NavButton>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </NavLinks>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar;
