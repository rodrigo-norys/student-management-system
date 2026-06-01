import styled from 'styled-components';
import * as colors from 'config/colors';
import { StatusBadge } from 'components/ui';
import { STUDENT_STATUS } from 'constants/student';

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
  CardGrid as StudentContainer,
  CardSubtitle as StudentEmail,
  CardDetails as StudentDetails,
  EntityCard as StudentCard,
  CardTitle as StudentName,
  NewEntityLink as NewStudentLink,
} from 'components/ui';

const statusTheme = {
  [STUDENT_STATUS.ACTIVE]: {
    text: colors.successColor,
    bg: 'rgba(16, 185, 129, 0.1)',
  },
  [STUDENT_STATUS.GRADUATED]: {
    text: colors.infoColor,
    bg: 'rgba(59, 130, 246, 0.1)',
  },
  [STUDENT_STATUS.INACTIVE]: {
    text: colors.dangerColor,
    bg: 'rgba(239, 68, 68, 0.1)',
  },
  [STUDENT_STATUS.TRANSFERRED]: {
    text: colors.warningColor,
    bg: 'rgba(245, 158, 11, 0.1)',
  },
  [STUDENT_STATUS.SUSPENDED]: {
    text: colors.mutedColor,
    bg: 'rgba(107, 114, 128, 0.1)',
  },
};

const resolveStatusColors = (props) => ({
  $color: statusTheme[props.$status]?.text || colors.textSecondary,
  $bg: statusTheme[props.$status]?.bg || colors.bgColor,
});

export const StatusCell = styled(StatusBadge).attrs((props) => ({
  $variant: 'cell',
  ...resolveStatusColors(props),
}))``;

export const StudentStatus = styled(StatusBadge).attrs((props) => ({
  $variant: 'card',
  ...resolveStatusColors(props),
}))``;
