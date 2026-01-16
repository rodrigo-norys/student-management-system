import styled from "styled-components";
import * as colors from "../../config/colors.js"

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

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;

  button {
    flex: 1;
  }
`;

export const ProfilePicture = styled.div`
display: flex;
justify-content: center;
align-items: center;
padding: 0 0 20px;
position: relative;
margin-top: 30px;

img {
  width: 180px;
  height: 180px;
  border-radius: 50%;
}

a {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  position: absolute;
  bottom: 0;
  color: #fff;
  background: ${colors.primaryColor};
  width: 36px;
  height: 36px;
  border-radius: 50%;
}
`;

export const Title = styled.h1`
  text-align: center;
`;

