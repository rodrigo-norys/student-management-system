import styled from "styled-components";
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
  gap: 20px;

  a {
    color: #fff;
    font-weight: bold;
    display: flex;
    align-items: center;
    position: relative;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
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
