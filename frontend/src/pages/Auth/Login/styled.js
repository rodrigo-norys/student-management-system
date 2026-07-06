import styled from 'styled-components';

export const Form = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;

  input {
    margin-bottom: 20px;
    height: 40px;
    padding: 0 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
`;

export const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #030617;
`;

export const Title = styled.h1`
  color: #ddd;
`;

export const DemoDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0 16px;
  color: #64748b;
  font-size: 12px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #334155;
  }
`;

export const DemoButton = styled.button`
  width: 100%;
  height: 40px;
  background: transparent;
  border: 1px solid #334155;
  border-radius: 4px;
  color: #f8fafc;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: #f8fafc;
    filter: none;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
