import styled from "styled-components";
import * as colors from "../../config/colors.js";

export const Container = styled.div`
  background: #fff;
  max-width: 450px;
  margin: 40px auto;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 25px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 10px;

  label {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    font-weight: 700;
    color: #444;
    font-size: 14px;
  }

  input {
    width: 100%;
    margin-top: 8px;
    height: 45px;
    padding: 0 15px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 16px;
    transition: all 0.2s;

    &:focus {
      border-color: ${colors.primaryColor};
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
  }

  button {
    margin-top: 20px;
    height: 45px;
    width: 100%;
    font-size: 16px;
    font-weight: bold;
  }
`;
