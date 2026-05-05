import styled from "styled-components";
import * as colors from "config/colors.js";

export const Container = styled.div`
  width: 100%;
  max-width: 550px;
  margin: 40px auto;
  background: #242433;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const Title = styled.h1`
  text-align: center;
  color: #fff;
  font-size: 28px;
  margin-bottom: 30px;
  font-weight: bold;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;

  label {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    font-weight: 600;
    color: #ccc;
    font-size: 14px;
  }

  input, select {
    width: 100%;
    margin-top: 8px;
    height: 48px;
    padding: 0 15px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    font-size: 15px;
    transition: all 0.2s;

    &:focus {
      border-color: ${colors.primaryColor};
      background: rgba(0, 0, 0, 0.2);
      outline: none;
    }

    &::placeholder {
      color: #666;
    }

    &:read-only {
      color: #888;
      cursor: not-allowed;
    }
  }

  option {
    background: #242433;
    color: #fff;
  }

  button[type="submit"] {
    margin-top: 10px;
    height: 50px;
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    background: ${colors.primaryColor};
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      filter: brightness(1.1);
      transform: translateY(-2px);
    }

    &:disabled {
      background: #555;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

export const SearchArea = styled.div`
  position: relative;
  margin-bottom: 25px;
`;

export const SearchResultList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #1b1b28;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-top: 5px;
  max-height: 250px;
  overflow-y: auto;
  z-index: 10;
  list-style: none;
  padding: 0;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

export const SearchItem = styled.li`
  padding: 15px;
  color: #ccc;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const PersonInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 15px;
    color: #fff;
  }

  span {
    font-size: 12px;
    color: #888;
  }
`;

export const Badge = styled.span`
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.$type === 'staff'
    ? '#8e44ad'
    : props.$type === 'guardian'
      ? '#2980b9'
      : '#27ae60'};
  color: #fff;
`;

export const SelectedPersonCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    background: transparent;
    color: #e74c3c;
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      background: rgba(231, 76, 60, 0.1);
    }
  }
`;

export const StatusIndicator = styled.div`
  margin-bottom: 25px;
  padding: 12px 15px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${props => props.$isEdit
    ? 'rgba(52, 152, 219, 0.1)'
    : 'rgba(46, 204, 113, 0.1)'};
  color: ${props => props.$isEdit
    ? '#3498db'
    : '#2ecc71'};
  border: 1px solid ${props => props.$isEdit
    ? 'rgba(52, 152, 219, 0.2)'
    : 'rgba(46, 204, 113, 0.2)'};
`;
