import styled from "styled-components";
import * as colors from "../../config/colors.js";

const borderColor = "#323245";
const darkBg = "#1a1a24";
const panelBg = "#222230";
const textLight = "#f5f5f5";
const textMuted = "#9aa0ac";

export const ActionsContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  button {
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    height: 38px;
    padding: 0 25px;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    button { width: 100%; }
  }
`;

export const AddAddressButton = styled.button`
  background: transparent;
  border: 2px dashed ${borderColor};
  color: ${textMuted};
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  &:hover {
    border-color: ${colors.primaryColor || '#007bff'};
    color: ${colors.primaryColor || '#007bff'};
    background: rgba(0, 123, 255, 0.05);
  }
`;

export const AddressCard = styled.div`
  background: ${darkBg};
  border: 1px solid ${borderColor};
  border-radius: 8px;
  padding: 15px;
  position: relative;
  &:hover { border-color: #4a4a5e; }
`;

export const AddressCardTitle = styled.h4`
  margin: 0 0 10px;
  color: ${textLight};
  font-size: 15px;
`;

export const AddressesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 15px;
  width: 100%;
`;

export const AddressSectionWrapper = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

export const SectionTitle = styled.h3`
  font-size: 1rem;
  color: ${textLight};
  margin: 20px 0 15px;
  display: flex;
  align-items: center;
  border-left: 4px solid ${colors.primaryColor || '#007bff'};
  padding-left: 10px;
`;

export const CenteredSectionTitle = styled(SectionTitle)`
  justify-content: center;
  border-left: none;
  padding-left: 0;
  margin-top: 25px;
`;

export const CenteredWrapper = styled.div`
  background: ${panelBg};
  border: 1px solid ${borderColor};
  border-radius: 8px;
  margin: 20px auto 0;
  padding: 20px 30px;
  width: 100%;
`;

export const Container = styled.div`
  max-width: 650px;
  width: 100%;
  margin: 0 auto;
  padding: 15px;
`;

export const Divider = styled.hr`
  margin: 20px 0;
  border: 0;
  border-top: 1px solid ${borderColor};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  label {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    color: ${textMuted};
    font-size: 12px;
    text-transform: uppercase;
  }
  input {
    height: 32px;
    background: ${darkBg};
    color: ${textLight};
    border: 1px solid ${borderColor};
    border-radius: 4px;
    padding: 0 8px;
    &:focus { border-color: ${colors.primaryColor}; outline: none; }
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid ${borderColor};
  padding-bottom: 10px;
  h1 { color: ${textLight}; font-size: 20px; }
`;

export const InputGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
  margin-bottom: 5px;
`;

export const ProfilePicture = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 0 20px;
  position: relative;
  img, svg {
    width: 100px !important;
    height: 100px !important;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid ${darkBg};
  }
  a {
    position: absolute;
    bottom: 20px;
    background: ${colors.primaryColor};
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border: 3px solid ${panelBg};
  }
`;

export const RemoveAddressButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-weight: bold;
`;

export const Title = styled.h1`
  color: ${textLight};
  font-size: 20px;
  margin: 0;
`;

export const ViewProfileButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;
