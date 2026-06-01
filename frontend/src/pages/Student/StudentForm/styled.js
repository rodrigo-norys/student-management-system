import styled from 'styled-components';
import * as colors from 'config/colors.js';

export {
  Form,
  FormGrid,
  Section,
  HeaderContent,
  ActionsContainer,
  InputGroup,
  SectionTitle,
  AddAddressButton,
  RemoveAddressButton,
  AddressesWrapper,
  AddressCard,
  AddressCardHeader,
  PersistenceToggle,
  FormProfilePicture as ProfilePicture,
  PrimaryButton,
  PageContainer,
  ValidatedInput,
  ValidatedSelect,
  ValidatedTextarea,
} from 'components/ui';

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const MedicalNotesWrapper = styled.div`
  margin-top: 10px;

  label {
    color: ${colors.textSecondary};
    display: block;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  textarea {
    background-color: ${colors.inputBg} !important;
    border: 1px solid ${colors.borderColor} !important;
    border-radius: 8px;
    color: ${colors.textPrimary} !important;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.6;
    min-height: 150px;
    padding: 12px 14px;
    resize: vertical;
    transition: all 0.2s ease;
    width: 100%;

    &:focus {
      border-color: ${colors.accentColor};
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
      outline: none;
    }
  }
`;
