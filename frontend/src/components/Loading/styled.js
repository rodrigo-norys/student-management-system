import styled, { keyframes } from 'styled-components';
import * as colors from '../../config/colors.js';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 99;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);

  div {
    width: 60px;
    height: 60px;
    border-radius: 50%;

    border: 5px solid rgba(255, 255, 255, 0.1);
    border-top: 5px solid ${colors.primaryColor};
    animation: ${rotate} 1s linear infinite;
  }
`;
