import styled from 'styled-components';
import * as colors from 'config/colors';
import { StatusBadge } from 'components/ui';

import { UNIT_CLASS_STATUS } from '../constants';

export {
  ListContainer as Container,
  HeaderToolbar,
  ControlsArea,
  SearchInput,
  TableContainer,
  TableActions,
  PaginationArea,
  NoResultsMessage,
  PageButton,
  Table as StyledTable,
  TableNameCol,
  EditButton,
  DeleteButton,
  NewEntityLink as NewUnitClassLink,
} from 'components/ui';

const statusTheme = {
  [UNIT_CLASS_STATUS.ACTIVE]: {
    text: colors.successColor,
    bg: 'rgba(16, 185, 129, 0.1)',
  },
  [UNIT_CLASS_STATUS.INACTIVE]: {
    text: colors.dangerColor,
    bg: 'rgba(239, 68, 68, 0.1)',
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
