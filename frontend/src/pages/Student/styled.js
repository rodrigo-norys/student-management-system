import styled from "styled-components";
import * as colors from "../../config/colors.js";

export const Container = styled.div`
  max-width: 1200px;
  width: 95%;
  margin: 30px auto;
`;

export const CenteredWrapper = styled.div`
  /* A "caixa branca" voltou a ser aqui! */
  background: #fff;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
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
  max-width: 500px;
  margin: 20px auto 0;

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

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;

  h1, h2, ${Title} {
    margin: 0;
    padding: 0;
    line-height: 1;
  }
`;

export const ViewProfileButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;

  svg {
    display: block;
  }

  &:hover {
    text-decoration: underline;
  }
`;

export const AddressesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  width: 100%;
`;

export const AddressCard = styled.div`
  flex: 1;
  min-width: 320px;
  max-width: 500px;
  background: #fdfdfd;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  position: relative;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
`;

export const AddAddressButton = styled.button`
  background: transparent;
  border: 2px dashed #ccc;
  color: #666;
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
  padding: 15px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  &:hover {
    border-color: ${colors.primaryColor};
    color: ${colors.primaryColor};
    background: #f0f8ff;
  }
`;

export const AddressSectionWrapper = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

export const CenteredSectionTitle = styled(SectionTitle)`
  color: #f0f8ff;
  justify-content: center;
  border-left: none;
  padding-left: 0;
`;

export const AddressCardTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 15px;
  color: #555;
`;

export const RemoveAddressButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: transform 0.2s, color 0.2s;

  &:hover {
    color: #c0392b;
    transform: scale(1.2);
  }
`;
