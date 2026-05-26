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
  PageButton,
  Table as StyledTable,
  CardGrid as GridContainer,
  CardSubtitle as UserSubTitle,
  CardDetails as UserDetails,
  EntityCard as UserCard,
} from 'components/ui';

const statusTheme = {
  active: { text: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  inactive: { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

// ==========================================
// 1. CONTROLES DA PÁGINA (TOOLBAR)
// ==========================================
export const Tabs = styled.div`
  display: flex;
  background: ${colors.bgColor};
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${colors.borderColor};
  height: 44px;
`;

export const TabButton = styled.button`
  background: ${(props) =>
    props.$active ? colors.accentColor : 'transparent'};
  border: none;
  padding: 0 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
  color: ${(props) => (props.$active ? '#fff' : colors.textSecondary)};
  transition: all 0.2s;
  &:hover:not(:disabled) {
    color: ${(props) => (props.$active ? '#fff' : colors.textPrimary)};
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  background: #0f172a;
  border-radius: 10px;
  border: 1px solid #334155;
  height: 44px;
  padding: 4px;
`;

export const ToggleButton = styled.button`
  background: ${(props) => (props.$active ? '#007bff' : 'transparent')};
  border: none;
  padding: 0 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  color: ${(props) => (props.$active ? '#ffffff' : '#64748b')};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    color: ${(props) => (props.$active ? '#ffffff' : '#94a3b8')};
  }
`;

// ==========================================
// 2. ESTRUTURAS DE LISTA E CARDS (GRID MODE)
// ==========================================
export const UserStatus = styled.div`
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
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.bgColor};
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  svg {
    color: ${colors.borderColor};
  }
`;

export const UserMainTitle = styled.h3`
  color: ${colors.textPrimary};
  font-size: 16px;
  margin-bottom: 4px;
  text-align: center;
  word-break: break-all;
`;

export const EditActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${colors.textSecondary};
  transition: all 0.2s ease-in-out;
  &:hover {
    color: #f1c40f;
    transform: scale(1.1);
  }
`;

// ==========================================
// 3. ELEMENTOS DE LINHA / CÉLULA
// ==========================================
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

export const TableNameCol = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  strong {
    color: ${colors.textPrimary};
    font-size: 14px;
  }
  span {
    color: ${colors.textSecondary};
    font-size: 12px;
  }
`;

export const SmallProfilePic = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  background: ${colors.bgColor};
  border: 1px solid ${colors.borderColor};
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  svg {
    color: ${colors.borderColor};
  }
`;

export const AccessLevelCell = styled.td`
  font-weight: 700;
  text-transform: uppercase;
`;

export const RoleCell = styled.td`
  text-transform: uppercase;
  font-weight: 800;
  font-size: 12px;
  color: #94a3b8;
`;

// ==========================================
// 4. BOTÕES DE AÇÃO
// ==========================================
export const EditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.textSecondary};
  transition: all 0.2s ease-in-out;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  &:hover {
    color: #f1c40f;
    transform: scale(1.1);
  }
`;

export const GrantButton = styled.button`
  background: ${colors.accentColor};
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.2);
  transition: all 0.2s ease;
  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
`;

// ==========================================
// 5. FORMULÁRIOS E INPUTS GENÉRICOS
// ==========================================
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  label {
    font-size: 13px;
    font-weight: 700;
    color: ${colors.textPrimary};
  }
  select {
    background: ${colors.bgColor};
    color: ${colors.textPrimary};
    border: 1px solid ${colors.borderColor};
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    cursor: pointer;
    &:focus {
      border-color: ${colors.accentColor};
    }
  }
`;

export const Input = styled.input`
  background: #0f172a;
  color: #f8fafc;
  border: ${(props) =>
    props.$hasError ? '1px solid #ef4444' : '1px solid #334155'};
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
  &:focus {
    border-color: ${(props) => (props.$hasError ? '#ef4444' : '#3b82f6')};
  }
`;

export const Select = styled.select`
  background: #0f172a;
  color: #f8fafc;
  border: ${(props) =>
    props.$hasError ? '1px solid #ef4444' : '1px solid #334155'};
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  transition: border-color 0.2s ease;
  &:focus {
    border-color: ${(props) => (props.$hasError ? '#ef4444' : '#3b82f6')};
  }
`;

export const ToggleSwitch = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 12px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: relative;
    width: 44px;
    height: 24px;
    background-color: ${colors.bgColor};
    border: 1px solid ${colors.borderColor};
    border-radius: 24px;
    transition: 0.3s;
    &:before {
      position: absolute;
      content: '';
      height: 16px;
      width: 16px;
      left: 3px;
      bottom: 3px;
      background-color: ${colors.textSecondary};
      border-radius: 50%;
      transition: 0.3s;
    }
  }
  input:checked + .slider {
    background-color: rgba(16, 185, 129, 0.2);
    border-color: #10b981;
  }
  input:checked + .slider:before {
    transform: translateX(20px);
    background-color: #10b981;
  }
  .label-text {
    font-size: 14px;
    color: ${colors.textSecondary};
    font-weight: 600;
  }
  input:checked ~ .label-text {
    color: #10b981;
  }
`;

export const PasswordInputWrapper = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

export const IconButton = styled.button`
  background: #334155;
  color: #f8fafc;
  border: none;
  border-radius: 8px;
  padding: 0 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  &:hover {
    background: #475569;
  }
  &:active {
    transform: scale(0.95);
  }
`;

export const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

// ==========================================
// 6. MODAIS
// ==========================================
export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const ModalCard = styled.div`
  background: ${colors.surfaceColor};
  border: 1px solid ${colors.borderColor};
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.5),
    0 10px 10px -5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  animation: slideUpFade 0.3s ease-out forwards;
  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid ${colors.borderColor};
  h2 {
    margin: 0;
    font-size: 18px;
    color: ${colors.textPrimary};
  }
  button {
    background: transparent;
    border: none;
    color: ${colors.textSecondary};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
    &:hover {
      color: #ef4444;
    }
  }
`;

export const ModalBody = styled.form`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const StaticInfo = styled.div`
  display: flex;
  flex-direction: column;
  background: ${colors.bgColor};
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${colors.borderColor};
  span {
    font-size: 12px;
    color: ${colors.textSecondary};
    text-transform: uppercase;
    font-weight: 700;
  }
  strong {
    font-size: 15px;
    color: ${colors.textPrimary};
    margin-top: 4px;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
`;

export const CancelButton = styled.button`
  background: transparent;
  color: ${colors.textPrimary};
  border: 1px solid ${colors.borderColor};
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${colors.bgColor};
  }
`;

export const SaveButton = styled.button`
  background: ${colors.accentColor};
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.2);
  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
`;

export const ModalAvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  padding-bottom: 10px;
  img {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid ${colors.borderColor};
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
  svg {
    width: 72px;
    height: 72px;
    color: ${colors.textSecondary};
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
  }
`;

