import styled from 'styled-components';
import * as colors from 'config/colors';
import { StatusBadge } from 'components/ui';

import { ASSIGNMENT_STATUS } from './constants';

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
  PrimaryButton,
  DeleteButton,
  ValidatedSelect,
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

export const InfoCard = styled.div`
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid ${colors.borderColor};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.accentColor}60;
  }
`;

export const InfoCardHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid ${colors.borderColor};
  display: flex;
  justify-content: space-between;
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

export const AssignmentForm = styled.form`
  align-items: flex-end;
  border-bottom: 1px solid ${colors.borderColor};
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 20px;

  label {
    flex: 1;
  }
`;

export const EmptyMessage = styled.p`
  color: ${colors.textSecondary};
  font-style: italic;
`;

const statusTheme = {
  [ASSIGNMENT_STATUS.ACTIVE]: {
    text: colors.successColor,
    bg: 'rgba(16, 185, 129, 0.1)',
  },
  [ASSIGNMENT_STATUS.INACTIVE]: {
    text: colors.dangerColor,
    bg: 'rgba(239, 68, 68, 0.1)',
  },
};

export const StatusCell = styled(StatusBadge).attrs((props) => ({
  $variant: 'cell',
  $color: statusTheme[props.$status]?.text || colors.textSecondary,
  $bg: statusTheme[props.$status]?.bg || colors.bgColor,
}))``;
