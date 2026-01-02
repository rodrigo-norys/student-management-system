import styled from "styled-components";

export const StudentContainer = styled.div`
  margin-top: 15px;

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 0;
  }

  div + div {
    border-top: 1px solid #eee;
  }
`;

export const ProfilePicture = styled.div`
  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
`;

export const HeaderToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;

  h1 {
    margin: 0;
  }
`;
