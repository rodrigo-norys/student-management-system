import styled from 'styled-components';
import * as colors from 'config/colors';

export {
  FormGrid,
  Section,
  HeaderContent,
  ProfilePicture,
  TabNav,
  InfoGroup,
  Label,
  Value,
  AddressGrid,
  PageContainer,
  PrimaryButton,
} from 'components/ui';

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ProfileAddressCard = styled.div`
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid ${colors.borderColor};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.accentColor}60;
  }
`;

export const ProfileAddressCardHeader = styled.div`
  border-bottom: 1px solid ${colors.borderColor};
  margin-bottom: 15px;
  padding-bottom: 10px;

  h3 {
    color: ${colors.textSecondary};
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }
`;

export const MedicalNotesWrapper = styled.div`
  background: ${colors.inputBg};
  border: 1px solid ${colors.borderColor};
  border-radius: 8px;
  color: ${colors.textPrimary};
  font-size: 14px;
  line-height: 1.6;
  min-height: 100px;
  padding: 15px;

  .no-data {
    color: ${colors.textSecondary};
    font-style: italic;
  }
`;

export const IdentityHeader = styled.div`
  text-align: center;

  h2 {
    font-size: 18px;
    margin-bottom: 5px;
  }

  span {
    color: ${colors.textSecondary};
    font-size: 13px;
  }
`;

export const StackedFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const EmptyStateText = styled.p`
  color: ${colors.textSecondary};
  font-style: italic;
`;
