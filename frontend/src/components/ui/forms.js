import styled from 'styled-components';
import * as colors from 'config/colors';

// Layout vertical do formulário.
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// Grid responsivo de inputs/selects.
export const InputGroup = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin-bottom: 16px;

  label {
    color: ${colors.textSecondary};
    display: flex;
    flex-direction: column;
    font-size: 13px;
    font-weight: 600;
    gap: 8px;
  }

  input,
  select {
    background: ${colors.inputBg} !important;
    border: 1px solid ${colors.borderColor};
    border-radius: 8px;
    color: ${colors.textPrimary} !important;
    font-family: inherit;
    font-size: 14px;
    height: 42px;
    padding: 10px 14px;
    transition: all 0.2s ease;

    &:focus {
      border-color: ${colors.accentColor};
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
      outline: none;
    }
  }
`;

// Título de seção em maiúsculas com régua divisória à direita.
export const SectionTitle = styled.h3`
  align-items: center;
  color: ${colors.accentColor};
  display: flex;
  font-size: 11px;
  font-weight: 800;
  gap: 12px;
  letter-spacing: 0.1em;
  margin-bottom: 24px;
  text-transform: uppercase;

  &::after {
    background: ${colors.borderColor};
    content: '';
    flex: 1;
    height: 1px;
  }
`;

// Moldura do avatar com botão flutuante de upload.
export const FormProfilePicture = styled.div`
  display: flex;
  height: 160px;
  justify-content: center;
  margin: 0 auto 24px;
  position: relative;
  width: 160px;

  img,
  svg {
    background: ${colors.bgColor};
    border: 4px solid ${colors.surfaceColor};
    border-radius: 50%;
    box-shadow: 0 0 0 2px ${colors.borderColor};
    height: 100% !important;
    object-fit: cover;
    width: 100% !important;
  }

  svg {
    color: ${colors.borderColor};
    padding: 10px;
  }

  a {
    align-items: center;
    background: ${colors.accentColor};
    border: 4px solid ${colors.surfaceColor};
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

// Checkbox customizado.
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
    background-color: ${colors.inputBg};
    border: 1px solid ${colors.borderColor};
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
    border-color: ${colors.accentColor};
  }

  input:checked ~ .checkmark {
    background-color: ${colors.accentColor};
    border-color: ${colors.accentColor};

    &::after {
      display: block;
    }
  }

  input:focus-visible ~ .checkmark {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }

  label {
    color: ${colors.textSecondary};
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

// Grid responsivo de cards de endereço.
export const AddressesWrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
`;

export const AddressCard = styled.div`
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid ${colors.borderColor};
  border-radius: 12px;
  padding: 24px;
  position: relative;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.accentColor}60;
    transform: translateY(-2px);
  }
`;

export const AddressCardHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  h4 {
    color: ${colors.textSecondary};
    font-size: 12px;
    font-weight: 700;
    margin: 0;
    text-transform: uppercase;
  }
`;

export const AddAddressButton = styled.button`
  align-items: center;
  background: transparent;
  border: 2px dashed ${colors.borderColor};
  border-radius: 12px;
  color: ${colors.textSecondary};
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
    background: ${colors.accentColor}05;
    border-color: ${colors.accentColor};
    color: ${colors.accentColor};
  }
`;

export const RemoveAddressButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.1);
  border-radius: 6px;
  color: ${colors.dangerColor};
  cursor: pointer;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  transition: all 0.2s;

  &:hover {
    background: ${colors.dangerColor};
    color: white;
  }
`;
