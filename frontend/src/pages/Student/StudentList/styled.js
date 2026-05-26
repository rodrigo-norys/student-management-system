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
  CardGrid as StudentContainer,
  CardSubtitle as StudentEmail,
  CardDetails as StudentDetails,
  EntityCard as StudentCard,
  CardTitle as StudentName,
  NewEntityLink as NewStudentLink,
} from 'components/ui';

const statusTheme = {
  active: { text: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  graduated: { text: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  inactive: { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  transferred: { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  suspended: { text: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
};

export const StatusCell = styled.td`
  span {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    background: ${(props) => statusTheme[props.$status]?.bg || colors.bgColor};
    color: ${(props) =>
      statusTheme[props.$status]?.text || colors.textSecondary};
  }
`;

export const StudentStatus = styled.div`
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  background: ${(props) => statusTheme[props.$status]?.bg || colors.bgColor};
  color: ${(props) => statusTheme[props.$status]?.text || colors.textSecondary};
  margin-bottom: 15px;
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

export const ProfilePicture = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 20px;
  overflow: hidden;
  border: 3px solid ${colors.bgColor};
  box-shadow: 0 0 0 1px ${colors.borderColor};
  margin-bottom: 15px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    color: ${colors.borderColor};
  }
`;
