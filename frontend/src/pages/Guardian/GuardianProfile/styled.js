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

export const AddressCard = styled.div`
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid ${colors.borderColor};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.accentColor}60;
  }
`;

export const AddressCardHeader = styled.div`
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

export const DependentCard = styled.div`
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid ${colors.borderColor};
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  margin-bottom: 15px;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.accentColor}60;
  }

  img,
  svg {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${colors.borderColor};
  }

  .dep-info {
    h4 {
      color: ${colors.textPrimary};
      font-size: 16px;
      margin-bottom: 4px;
    }

    span {
      color: ${colors.textSecondary};
      font-size: 13px;
    }

    a {
      color: ${colors.accentColor};
      display: block;
      font-size: 12px;
      font-weight: 600;
      margin-top: 8px;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;
