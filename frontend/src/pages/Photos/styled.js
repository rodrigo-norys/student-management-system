import styled from "styled-components";
import * as colors from "../../config/colors.js";

export const Container = styled.div`
  background: #fff;
  max-width: 400px;
  margin: 40px auto;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h1`
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 30px;
`;

export const Form = styled.form`
  label {
    width: 180px;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border: 5px solid #fff;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    margin: 0 auto;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease-in-out;

    &:hover {
      transform: scale(1.02);
      border-color: ${colors.primaryColor};
    }
  }

  input {
    display: none;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  &:hover .overlay {
    opacity: 1;
  }
`;

export const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;

  span {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 600;
  }
`;

export const Overlay = styled.div.attrs({
  className: 'overlay'
})`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  opacity: 0;
  transition: opacity 0.3s ease;
  color: #fff;

  span {
    margin-top: 5px;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
  }
`;
