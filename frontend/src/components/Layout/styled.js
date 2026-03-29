import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as colors from '../../config/colors';

export const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #f4f6f9;
  overflow: hidden;
`;

export const Sidebar = styled.aside`
  width: 260px;
  background-color: #1b1b28;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
`;

export const SidebarHeader = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #1b1b28;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  h2 {
    color: #ffffff;
    font-size: 20px;
    margin: 0;
    font-weight: 700;
    letter-spacing: 1px;
  }
`;

export const NavMenu = styled.nav`
  flex: 1;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow-y: auto;
`;

export const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 25px;
  color: #a2a3b7;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;

  svg {
    font-size: 18px;
  }

  &:hover, &.active {
    background-color: rgba(255, 255, 255, 0.05);
    color: #ffffff;
    border-left: 4px solid ${colors.primaryColor};
  }
`;

export const MainArea = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
`;

export const Topbar = styled.header`
  height: 70px;
  background-color: #1b1b28;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 10;
`;

export const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    strong {
      color: #ffffff;
      font-size: 14px;
    }

    span {
      color: #a2a3b7;
      font-size: 12px;
    }
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background-color: ${colors.primaryColor};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-weight: bold;
  }
`;

export const ContentWrapper = styled.div`
  flex: 1;
  padding: 30px;
  overflow-y: auto;
`;

export const DashboardCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.03);

  h3 {
    color: #3f4254;
    margin-bottom: 10px;
  }

  p {
    color: #7e8299;
    line-height: 1.6;
  }
`;

export const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-right: 30px;
  padding-right: 30px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ActionLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.3s;

  &:hover {
    background-color: ${colors.primaryColor};
    color: #ffffff;
  }
`;

export const SidebarFooter = styled.div`
  padding: 15px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: auto;
`;

export const SidebarLogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  padding: 12px 25px;
  background: transparent;
  border: none;
  color: #f64e60; /* Vermelho de alerta */
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;

  svg {
    font-size: 18px;
  }

  &:hover {
    background-color: rgba(246, 78, 96, 0.05);
    border-left: 4px solid #f64e60;
  }
`;
