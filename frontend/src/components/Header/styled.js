import styled from "styled-components";
import { Link } from 'react-router-dom';
import { primaryColor } from "../../config/colors";

export const Nav = styled.nav`
  background: ${primaryColor};
  padding: 0 clamp(10px, 3vw, 20px);
  height: 64px;
  width: 100%;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  overflow: hidden;

  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const Logo = styled.div`
  flex-shrink: 0;
  a {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: clamp(14px, 4vw, 20px);
    font-weight: bold;
    text-decoration: none;
    gap: 8px;
    white-space: nowrap;
  }
`;

export const Menu = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(5px, 2vw, 15px);
  flex-wrap: nowrap;
  min-width: 0;

  > a {
    display: flex;
    align-items: center;
    color: #fff;
    transition: opacity 0.2s;
    &:hover { opacity: 0.8; }
  }
`;

export const LinkRegister = styled(Link)`
  background: #fff;
  color: ${primaryColor} !important;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px);
  border-radius: 4px;
  font-weight: 700;
  font-size: clamp(12px, 1.5vw, 14px);
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    filter: brightness(90%);
  }

  @media (max-width: 500px) {
    span { display: none; }
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

  min-width: 0;

  span {
    font-size: clamp(12px, 1.5vw, 14px);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 15vw;
  }

  @media (max-width: 400px) {
    span { display: none; }
  }
`;
