import styled from 'styled-components';

export const SetupWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #1b1b28;
`;

export const Form = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

export const InputContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;

  input {
    width: 100%;
    margin-bottom: 20px;
    height: 40px;
    padding: 0 40px 0 10px;
    border-radius: 4px;
    border: 1px solid #ddd;

    &::-ms-reveal,
    &::-ms-clear {
      display: none;
    }
  }

  svg {
    position: absolute;
    right: 12px;
    top: 11px;
    cursor: pointer;
    color: #666;
    transition: color 0.2s;

    &:hover {
      color: #333;
    }
  }
`;

export const Title = styled.h1`
  color: #333;
`;

export const PasswordRules = styled.ul`
  font-size: 13px;
  color: #666;
  margin-bottom: 20px;
  padding-left: 20px;

  li {
    margin-bottom: 5px;
  }
`;
