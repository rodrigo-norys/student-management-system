import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as colors from 'config/colors';

const bgColor = '#0f172a';
const surfaceColor = '#1e293b';
const borderColor = '#334155';
const textPrimary = '#f8fafc';
const textSecondary = '#94a3b8';
const accentColor = colors.primaryColor || '#3b82f6';

const statusTheme = {
  active: { text: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  graduated: { text: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  inactive: { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  transferred: { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  suspended: { text: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' }
};

export const Container = styled.div`
  width: 100%;
  margin: 0;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

export const HeaderToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${borderColor};
  padding-bottom: 20px;
  margin-bottom: 25px;

  h1 {
    font-size: 28px;
    color: ${textPrimary};
    font-weight: 800;
  }
`;

export const NewStudentLink = styled(Link)`
  background: ${accentColor};
  color: #fff;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }
`;

export const ControlsArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 15px;
`;

export const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background: ${bgColor};
  border-radius: 8px;
  padding: 0 15px;
  flex: 1;
  max-width: 500px;
  border: 1px solid ${borderColor};
  height: 44px;

  input {
    border: none;
    outline: none;
    width: 100%;
    background: transparent;
    font-size: 14px;
    color: ${textPrimary};
    margin-left: 10px;

    &::placeholder { color: ${textSecondary}; }
  }

  svg { color: ${textSecondary}; }
`;

export const ViewToggle = styled.div`
  display: flex;
  background: ${bgColor};
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${borderColor};
  height: 44px;
`;

export const ToggleButton = styled.button`
  background: ${props => (props.$active ? accentColor : 'transparent')};
  border: none;
  padding: 0 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${props => (props.$active ? '#fff' : textSecondary)};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    color: ${props => (props.$active ? '#fff' : textPrimary)};
  }
`;

export const TableContainer = styled.div`
  width: 100%;
  background: ${surfaceColor};
  border-radius: 12px;
  overflow-x: auto;
  border: 1px solid ${borderColor};
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background-color: rgba(15, 23, 42, 0.4);
    color: ${textSecondary};
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 16px 20px;
    border-bottom: 1px solid ${borderColor};
    text-align: center;
  }

  td {
    padding: 16px 20px;
    border-bottom: 1px solid ${borderColor};
    color: ${textPrimary};
    font-size: 14px;
    text-align: center;
    vertical-align: middle;
  }

  tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
`;

export const StatusCell = styled.td`
  span {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    background: ${props => statusTheme[props.$status]?.bg || bgColor};
    color: ${props => statusTheme[props.$status]?.text || textSecondary};
  }
`;

export const TableNameCol = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;

  strong {
    color: ${textPrimary};
    font-size: 14px;
  }

  span {
    color: ${textSecondary};
    font-size: 12px;
  }
`;

export const SmallProfilePic = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  background: ${bgColor};
  border: 1px solid ${borderColor};
  margin: 0 auto;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    color: ${borderColor};
  }
`;

export const StudentContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

export const StudentCard = styled.div`
  background: ${surfaceColor};
  border-radius: 12px;
  padding: 24px;
  border: 1px solid ${borderColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${accentColor}80;
    transform: translateY(-4px);
  }
`;

export const StudentStatus = styled.div`
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  background: ${props => statusTheme[props.$status]?.bg || bgColor};
  color: ${props => statusTheme[props.$status]?.text || textSecondary};
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
  border: 3px solid ${bgColor};
  box-shadow: 0 0 0 1px ${borderColor};
  margin-bottom: 15px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    color: ${borderColor};
  }
`;

export const StudentName = styled.h3`
  color: ${textPrimary};
  font-size: 18px;
  margin-bottom: 4px;
`;

export const StudentEmail = styled.span`
  color: ${textSecondary};
  font-size: 13px;
  margin-bottom: 20px;
`;

export const StudentDetails = styled.div`
  width: 100%;
  border-top: 1px solid ${borderColor};
  padding-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;

  span:first-child { color: ${textSecondary}; font-weight: 600; }
  span:last-child { color: ${textPrimary}; font-weight: 700; }
`;

export const EditButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${textSecondary};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #f1c40f;
    transform: scale(1.1);
  }
`;

export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  color: ${props => props.$isConfirming ? '#ef4444' : textSecondary};
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    color: #ef4444;
    transform: scale(1.1);
  }
`;

export const ProfileButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${textSecondary};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${accentColor};
    transform: scale(1.1);
  }
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid ${borderColor};
`;

export const TableActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

export const PaginationArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
  padding-bottom: 20px;

  span {
    font-size: 13px;
    font-weight: 700;
    color: ${textSecondary};
  }
`;

export const PageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${surfaceColor};
  color: ${textPrimary};
  border: 1px solid ${borderColor};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${borderColor};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const NoResultsMessage = styled.p`
  color: ${textSecondary};
  text-align: center;
  padding: 60px 0;
  font-weight: 600;
`;
