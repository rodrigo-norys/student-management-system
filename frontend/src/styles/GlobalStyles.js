import styled, { createGlobalStyle } from 'styled-components';
import * as colors from 'config/colors';
import 'react-toastify/dist/ReactToastify.css';

export default createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    outline: none;
    padding: 0;
  }

  a {
    color: ${colors.primaryColor};
    text-decoration: none;
  }

  body {
    background: ${colors.primaryDarkColor};
    color: #f5f5f5;
    font-family: sans-serif;
  }

  button {
    background: ${colors.primaryColor};
    border: none;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    font-weight: 700;
    padding: 10px 20px;
    transition: all 300ms;
  }

  button:hover {
    filter: brightness(85%);
  }

  html, body, #root {
    height: 100%;
  }
`;

export const Container = styled.section`
  background: #0f172a;
  border: 1px solid #323245;
  border-radius: 8px;
  margin: 30px auto;
  max-width: 100%;
  min-width: 400px;
  padding: 30px;
  width: fit-content;
`;

export const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 11px;
  font-weight: 600;
  margin-top: 4px;
  text-transform: none;
  letter-spacing: normal;
`;

