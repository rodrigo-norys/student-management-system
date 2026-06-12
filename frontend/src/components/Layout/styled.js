import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as colors from 'config/colors';

const appBg = '#020617';
const sidebarBg = '#0f172a';
const topbarBg = '#0f172a';
const borderColor = '#1e293b';
const textPrimary = '#f8fafc';
const textSecondary = '#94a3b8';
const accentColor = colors.primaryColor || '#3b82f6';
const dangerColor = '#ef4444';

export const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: ${appBg};
  overflow: hidden;
  position: relative;
`;

export const Sidebar = styled.aside`
  width: 260px;
  background-color: ${sidebarBg};
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
  border-right: 1px solid ${borderColor};
  z-index: 100;

  @media (max-width: 768px) {
    position: fixed;
    left: ${(props) => (props.$isOpen ? '0' : '-260px')};
    height: 100vh;
  }
`;

export const SidebarHeader = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: ${sidebarBg};
  border-bottom: 1px solid ${borderColor};

  h2 {
    color: ${textPrimary};
    font-size: 18px;
    margin: 0;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }
`;

export const NavMenu = styled.nav`
  flex: 1;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
`;

export const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 20px;
  color: ${textSecondary};
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;

  svg {
    font-size: 18px;
    color: ${textSecondary};
    transition: color 0.2s;
  }

  &:hover {
    background-color: rgba(30, 41, 59, 0.5);
    color: ${textPrimary};

    svg {
      color: ${accentColor};
    }
  }

  &.active {
    background-color: #1e293b;
    color: ${accentColor};
    border-left: 4px solid ${accentColor};

    svg {
      color: ${accentColor};
    }
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
  background-color: ${topbarBg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  border-bottom: 1px solid ${borderColor};
  z-index: 10;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

export const MenuToggleButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: ${textPrimary};
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
      color: ${textPrimary};
      font-size: 14px;
      font-weight: 700;
    }

    span {
      color: ${textSecondary};
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    @media (max-width: 480px) {
      display: none;
    }
  }

  .avatar {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background-color: ${accentColor};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-weight: 800;
    font-size: 15px;
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
  }
`;

export const ContentWrapper = styled.div`
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  background-color: ${appBg};

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

export const DemoBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: rgba(245, 158, 11, 0.12);
  border-bottom: 1px solid rgba(245, 158, 11, 0.4);
  color: #f59e0b;
  font-size: 13px;
  font-weight: 600;

  svg {
    font-size: 14px;
  }
`;

export const SidebarFooter = styled.div`
  padding: 15px 0;
  border-top: 1px solid ${borderColor};
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
  color: ${dangerColor};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;

  svg {
    font-size: 18px;
  }

  &:hover {
    background-color: rgba(239, 68, 68, 0.1);
    border-left: 4px solid ${dangerColor};
  }
`;

export const Overlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${(props) => (props.$isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(2, 6, 23, 0.8);
    backdrop-filter: blur(4px);
    z-index: 90;
  }
`;
