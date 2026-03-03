import styled from "styled-components";
import * as colors from "../../config/colors.js";

export const Container = styled.div`
  background: #fff;
  max-width: 500px;
  margin: 30px auto;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  text-align: center;
  color: #333;
  font-size: 22px;
  margin-bottom: 20px;
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
    font-size: 13px;
  }

  input, select, textarea {
    width: 100%;
    margin-top: 5px;
    padding: 0 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 15px;
    transition: all 0.2s;

    &:focus {
      border-color: ${colors.primaryColor};
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
  }

  input, select {
    height: 40px;
  }

  textarea {
    padding: 10px;
    min-height: 90px;
    resize: vertical;
  }
`;

export const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const ProfilePicture = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0 20px;
  position: relative;

  img, svg {
    width: 120px !important;
    height: 120px !important;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #f5f5f5;
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 20px;
    color: #fff;
    background: ${colors.primaryColor};
    width: 36px;
    height: 36px;
    border-radius: 50%;
    transition: all 0.2s;

    &:hover { transform: scale(1.1); }
  }
`;

export const ActionsContainer = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;

  button {
    width: 100%;
    height: 40px;
    font-size: 15px;
  }

  &:has(button:only-child) { grid-template-columns: 1fr; }
`;

export const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;

  border-left: 4px solid #3f51b5;
  padding-left: 10px;
`;

export const Divider = styled.hr`
  margin: 30px 0;
  border: 0;
  border-top: 1px solid #eee;
`;
