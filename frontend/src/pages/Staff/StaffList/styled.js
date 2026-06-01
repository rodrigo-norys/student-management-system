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
  CardProfilePicture as ProfilePicture,
  CardGrid as StaffContainer,
  CardSubtitle as StaffEmail,
  CardDetails as StaffDetails,
  EntityCard as StaffCard,
  CardTitle as StaffName,
  NewEntityLink as NewStaffLink,
} from 'components/ui';

const statusTheme = {
  active: { text: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  inactive: { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  suspended: { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  on_leave: { text: '#3498db', bg: 'rgba(52, 152, 219, 0.1)' },
};

export const StaffStatus = styled.div`
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  background: ${(props) => statusTheme[props.$status]?.bg || colors.bgColor};
  color: ${(props) => statusTheme[props.$status]?.text || colors.textSecondary};
  margin-bottom: 15px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

export const StatusCell = styled.td`
  color: ${(props) => statusTheme[props.$status]?.text || colors.textSecondary};
  font-weight: 800;
  font-size: 11px;
  text-transform: uppercase;
`;
