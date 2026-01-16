import styled from "styled-components";
import * as colors from "../../config/colors.js";

export const Title = styled.h1`
  text-align: center;
`;

export const Form = styled.form`
label {
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eee;
  border: 5px dashed ${colors.primaryColor};
  margin: 30px auto;
  border-radius: 50%;
}
  input {
    display: none;
  }
`;
