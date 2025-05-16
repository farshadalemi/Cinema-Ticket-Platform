import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaFilm, FaUsers, FaTicketAlt, FaCalendarAlt, FaChartBar, FaHeadset } from 'react-icons/fa';
import { useAuthController } from '../../controllers/AuthController';
import Loading from '../../components/common/Loading';

const DashboardContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 200px);
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 2rem 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 80px;
  }
`;

const SidebarHeader = styled.div`
  padding: 0 1.5rem 1.5rem 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  h2 {
    margin: 0;
    font-size: 1.2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 0.5rem 1.5rem 0.5rem;
    text-align: center;
    
    h2 {
      display: none;
    }
  }
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
  
  a {
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: none;
    transition: all 0.2s ease;
    
    &:hover, &.active {
      background-color: rgba(229, 9, 20, 0.1);
      color: ${({ theme }) => theme.colors.primary};
    }
    
    svg {
      margin-right: 1rem;
      font-size: 1.2rem;
    }
    
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      padding: 0.75rem;
      justify-content: center;
      
      svg {
        margin-right: 0;
        font-size: 1.5rem;
      }
      
      span {
        display: none;
      }
    }
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    margin: 0 0 0.5rem 0;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  h3 {
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    
    svg {
      margin-right: 0.5rem;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
  
  .value {
    font-size: 2rem;
    font-weight: bold;
  }
  
  .change {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.9rem;
    
    &.positive {
      color: #2ecc71;
    }
    
    &.negative {
      color: #e74c3c;
    }
  }
`;

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useAuthController();
  
  useEffect(() => {
    // Redirect if not admin
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [loading, isAdmin]);
  
  if (loading) {
    return <Loading text="Loading admin dashboard..." />;
  }
  
  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarHeader>
          <h2>Admin Dashboard</h2>
        </SidebarHeader>
        
        <NavMenu>
          <NavItem>
            <Link to="/admin" className="active">
              <FaChartBar />
              <span>Dashboard</span>
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/admin/movies">
              <FaFilm />
              <span>Movies</span>
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/admin/showtimes">
              <FaCalendarAlt />
              <span>Showtimes</span>
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/admin/bookings">
              <FaTicketAlt />
              <span>Bookings</span>
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/admin/users">
              <FaUsers />
              <span>Users</span>
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/admin/support">
              <FaHeadset />
              <span>Support</span>
            </Link>
          </NavItem>
        </NavMenu>
      </Sidebar>
      
      <Content>
        <Routes>
          <Route path="/" element={
            <>
              <DashboardHeader>
                <h1>Dashboard</h1>
                <p>Welcome back, {user?.full_name || user?.username}</p>
              </DashboardHeader>
              
              <StatsGrid>
                <StatCard>
                  <h3><FaTicketAlt /> Total Bookings</h3>
                  <div className="value">128</div>
                  <span className="change positive">+12% from last week</span>
                </StatCard>
                
                <StatCard>
                  <h3><FaUsers /> Active Users</h3>
                  <div className="value">256</div>
                  <span className="change positive">+8% from last week</span>
                </StatCard>
                
                <StatCard>
                  <h3><FaFilm /> Active Movies</h3>
                  <div className="value">12</div>
                  <span className="change">No change</span>
                </StatCard>
                
                <StatCard>
                  <h3><FaHeadset /> Support Tickets</h3>
                  <div className="value">5</div>
                  <span className="change negative">-2 from last week</span>
                </StatCard>
              </StatsGrid>
              
              <p>This is a placeholder for the admin dashboard. In a real application, this would display charts, reports, and other administrative tools.</p>
            </>
          } />
          <Route path="/movies" element={<h2>Movies Management</h2>} />
          <Route path="/showtimes" element={<h2>Showtimes Management</h2>} />
          <Route path="/bookings" element={<h2>Bookings Management</h2>} />
          <Route path="/users" element={<h2>Users Management</h2>} />
          <Route path="/support" element={<h2>Support Management</h2>} />
        </Routes>
      </Content>
    </DashboardContainer>
  );
};

export default AdminDashboardPage;
