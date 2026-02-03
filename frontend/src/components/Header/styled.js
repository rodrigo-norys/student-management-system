import styled from "styled-components";
import { Link } from 'react-router-dom';
import { primaryColor } from "../../config/colors";

export const Nav = styled.nav`
  background: ${primaryColor};
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const Logo = styled.div`
  a {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    text-decoration: none;
    gap: 8px;
  }
`;

export const Menu = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const LinkLogin = styled(Link)`
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  padding: 5px 10px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export const LinkRegister = styled(Link)`
  background: #fff;
  color: ${primaryColor};
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  gap: 8px;
  background: rgba(0,0,0,0.1);
  padding: 5px 10px;
  border-radius: 4px;

  span {
    font-size: 14px;
    font-weight: 500;
  }
`;
