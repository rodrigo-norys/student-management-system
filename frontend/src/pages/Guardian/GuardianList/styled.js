import styled from 'styled-components';
import * as colors from 'config/colors';

export {
  ListContainer as Container,
  HeaderToolbar,
  ControlsArea,
  SearchInput,
  TableContainer,
  TableActions,
  ActionRow,
  DetailRow,
  PaginationArea,
  NoResultsMessage,
  ViewToggle,
  ToggleButton,
  PageButton,
  Table as StyledTable,
  TableNameCol,
  SmallProfilePic,
  EditButton,
  DeleteButton,
  ProfileButton,
  CardGrid as GuardianContainer,
  CardSubtitle as GuardianEmail,
  CardDetails as GuardianDetails,
  EntityCard as GuardianCard,
  CardTitle as GuardianName,
  NewEntityLink as NewGuardianLink,
} from 'components/ui';

export const ProfilePicture = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 20px;
  overflow: hidden;
  border: 3px solid ${colors.bgColor};
  box-shadow: 0 0 0 1px ${colors.borderColor};
  margin-bottom: 15px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  svg {
    color: ${colors.borderColor};
  }
`;
