import styled from 'styled-components';
import * as colors from 'config/colors.js';

const bgColor = '#0f172a';
const surfaceColor = '#1e293b';
const inputBg = '#0f172a';
const borderColor = '#334155';
const textPrimary = '#f8fafc';
const textSecondary = '#94a3b8';
const accentColor = colors.primaryColor || '#3b82f6';
const dangerColor = '#ef4444';

export const AddAddressButton = styled.button`
  align-items: center;
  background: transparent;
  border: 2px dashed ${borderColor};
  border-radius: 12px;
  color: ${textSecondary};
  cursor: pointer;
  display: flex;
  font-weight: 600;
  gap: 10px;
  justify-content: center;
  margin-top: 16px;
  padding: 16px;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background: ${accentColor}05;
    border-color: ${accentColor};
    color: ${accentColor};
  }
`;

export const AddressCard = styled.div`
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid ${borderColor};
  border-radius: 12px;
  padding: 24px;
  position: relative;
  transition: all 0.2s;

  &:hover {
    border-color: ${accentColor}60;
    transform: translateY(-2px);
  }
`;

export const AddressCardHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  h4 {
    color: ${textSecondary};
    font-size: 12px;
    font-weight: 700;
    margin: 0;
    text-transform: uppercase;
  }
`;

export const AddressesWrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
`;

export const Container = styled.div`
  color: ${textPrimary};
  margin: 40px auto;
  max-width: 1200px;
  padding: 0 20px;
  width: 100%;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const FormGrid = styled.div`
  align-items: start;
  display: grid;
  gap: 24px;
  grid-template-columns: 320px 1fr;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const InputGroup = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin-bottom: 16px;

  label {
    color: ${textSecondary};
    display: flex;
    flex-direction: column;
    font-size: 13px;
    font-weight: 600;
    gap: 8px;
  }

  input,
  select {
    background: ${inputBg} !important;
    border: 1px solid ${borderColor};
    border-radius: 8px;
    color: ${textPrimary} !important;
    font-family: inherit;
    font-size: 14px;
    height: 42px;
    padding: 10px 14px;
    transition: all 0.2s ease;

    &:focus {
      border-color: ${accentColor};
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
      outline: none;
    }
  }
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const MedicalNotesWrapper = styled.div`
  margin-top: 10px;

  label {
    color: ${textSecondary};
    display: block;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  textarea {
    background-color: ${inputBg} !important;
    border: 1px solid ${borderColor} !important;
    border-radius: 8px;
    color: ${textPrimary} !important;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.6;
    min-height: 150px;
    padding: 12px 14px;
    resize: vertical;
    transition: all 0.2s ease;
    width: 100%;

    &:focus {
      border-color: ${accentColor};
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
      outline: none;
    }
  }
`;

export const PersistenceToggle = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: 12px;
  position: relative;
  user-select: none;

  input {
    cursor: pointer;
    height: 0;
    opacity: 0;
    position: absolute;
    width: 0;
  }

  .checkmark {
    background-color: ${inputBg};
    border: 1px solid ${borderColor};
    border-radius: 6px;
    height: 20px;
    position: relative;
    transition: all 0.2s ease-in-out;
    width: 20px;

    &::after {
      border: solid white;
      border-width: 0 2px 2px 0;
      content: '';
      display: none;
      height: 10px;
      left: 6px;
      position: absolute;
      top: 2px;
      transform: rotate(45deg);
      width: 5px;
    }
  }

  &:hover input ~ .checkmark {
    border-color: ${accentColor};
  }

  input:checked ~ .checkmark {
    background-color: ${accentColor};
    border-color: ${accentColor};

    &::after {
      display: block;
    }
  }

  input:focus-visible ~ .checkmark {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }

  label {
    color: ${textSecondary};
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }

  @media (max-width: 600px) {
    justify-content: center;
    margin-bottom: 15px;
    width: 100%;
  }
`;

export const ProfilePicture = styled.div`
  display: flex;
  height: 160px;
  justify-content: center;
  margin: 0 auto 24px;
  position: relative;
  width: 160px;

  img,
  svg {
    background: ${bgColor};
    border: 4px solid ${surfaceColor};
    border-radius: 50%;
    box-shadow: 0 0 0 2px ${borderColor};
    height: 100% !important;
    object-fit: cover;
    width: 100% !important;
  }

  svg {
    color: ${borderColor};
    padding: 10px;
  }

  a {
    align-items: center;
    background: ${accentColor};
    border: 4px solid ${surfaceColor};
    border-radius: 50%;
    bottom: 5px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
    color: #fff;
    display: flex;
    height: 40px;
    justify-content: center;
    position: absolute;
    right: 5px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    width: 40px;

    &:hover {
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
      transform: scale(1.1) rotate(-10deg);
    }
  }
`;

export const RemoveAddressButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.1);
  border-radius: 6px;
  color: ${dangerColor};
  cursor: pointer;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  transition: all 0.2s;

  &:hover {
    background: ${dangerColor};
    color: white;
  }
`;

export const Section = styled.div`
  background: ${surfaceColor};
  border: 1px solid ${borderColor};
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

export const SectionTitle = styled.h3`
  align-items: center;
  color: ${accentColor};
  display: flex;
  font-size: 11px;
  font-weight: 800;
  gap: 12px;
  letter-spacing: 0.1em;
  margin-bottom: 24px;
  text-transform: uppercase;

  &::after {
    background: ${borderColor};
    content: '';
    flex: 1;
    height: 1px;
  }
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ViewProfileButton = styled.button`
  align-items: center;
  background: ${surfaceColor};
  border: 1px solid ${borderColor};
  border-radius: 10px;
  color: ${textPrimary};
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  gap: 10px;
  padding: 10px 20px;
  transition: all 0.2s;

  &:hover {
    background: ${borderColor};
    transform: translateY(-1px);
  }
`;

export const PrimaryButton = styled.button`
  align-items: center;
  background: ${accentColor};
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);
  color: #fff;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 700;
  gap: 8px;
  padding: 10px 20px;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }
`;

export const HeaderContent = styled.div`
  align-items: center;
  border-bottom: 1px solid ${borderColor};
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 20px;
`;

export const ActionsContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  margin-top: 20px;
`;
