import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as colors from '../../config/colors';

export const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #1b1b28;
  overflow: hidden;
  position: relative;
`;

export const Sidebar = styled.aside`
  width: 260px;
  background-color: #1b1b28;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 100;

  @media (max-width: 768px) {
    position: fixed;
    left: ${(props) => props.$isOpen
    ? '0'
    : '-260px'};
    height: 100vh;
  }
`;

export const SidebarHeader = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  width: 100%;
`;

export const Topbar = styled.header`
  height: 70px;
  background-color: #1b1b28;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 10;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

export const MenuToggleButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }
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

    @media (max-width: 480px) {
      display: none;
    }
  }

  .avatar {
    width: 35px;
    height: 35px;
    border-radius: 8px;
    background-color: ${colors.primaryColor};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-weight: bold;
    font-size: 14px;
  }
`;

export const ContentWrapper = styled.div`
  flex: 1;
  padding: 30px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

export const DashboardCard = styled.div`
  background-color: ${(props) => props.theme.container || '#ffffff'};
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.03);
  border: 1px solid ${(props) => props.theme.border || 'transparent'};

  h3 {
    color: ${(props) => props.theme.text || '#3f4254'};
    margin-bottom: 10px;
    font-size: 18px;
  }

  p {
    color: ${(props) => props.theme.secondaryText || '#7e8299'};
    line-height: 1.6;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    padding: 20px;

    h3 {
      font-size: 16px;
    }
  }
`;

export const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-right: 20px;
  padding-right: 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const ActionLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 12px;
  transition: all 0.3s;

  &:hover {
    background-color: ${colors.primaryColor};
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
  color: #f64e60;
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

export const Overlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${(props) => props.$isOpen
    ? 'block'
    : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 90;
  }
`;
