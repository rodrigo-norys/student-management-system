import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as colors from '../../config/colors';

export const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 25px;
  width: 100%;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  a, svg { color: #555; transition: all 0.2s; }
  .edit-btn:hover { color: #f1c40f; }
  .delete-btn:hover { color: #e74c3c; }
  .profile-btn:hover { color: #3498db; }
`;

export const Container = styled.div`
  width: 100%;
  margin: 0;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }

  @media (max-width: 480px) {
    padding: 0 15px;
  }
`;

export const ControlsArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  span:first-child { color: #555; }
  span:last-child { color: #aaa; }
`;

export const HeaderToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 20px;
  margin-bottom: 25px;
  gap: 20px;

  h1 {
    font-size: 32px;
    color: #fff;
    font-weight: bold;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;

    h1 {
      font-size: 24px;
    }
  }
`;

export const NewStudentLink = styled(Link)`
  background: ${colors.primaryColor};
  color: #fff;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);

  transition: all 0.15s ease-in-out;

  &:hover {
    filter: brightness(1.1);
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    filter: brightness(0.95);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(1px) scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

export const NoResultsMessage = styled.p`
  color: #666;
  text-align: center;
  padding: 60px 20px;
`;

export const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #1b1b28;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #2a2a3d;
  }

  &:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const PaginationArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding-bottom: 20px;

  span {
    font-size: 14px;
    font-weight: bold;
    color: #444;
  }
`;

export const PictureOverlay = styled.div``;

export const ProfileLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export const ProfilePicture = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
`;

export const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px 15px;
  flex: 1;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    max-width: 100%;
  }

  input {
    border: none;
    outline: none;
    width: 100%;
    background: transparent;
    font-size: 14px;
    color: #fff;
    &::placeholder { color: #666; }
  }
`;

export const SmallProfilePic = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  overflow: hidden;
  background: #1b1b28;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const StudentCard = styled.div`
  background: #242433;
  border-radius: 12px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  }
`;

export const StudentContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const StudentDetails = styled.div`
  width: 100%;
  margin: 20px 0;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StudentEmail = styled.span`
  color: #666;
  text-align: center;
  word-break: break-all;
`;

export const StudentName = styled.h3`
  color: #fff;
  margin-top: 15px;
  text-align: center;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 700px;

  th {
    background-color: rgba(0, 0, 0, 0.1);
    color: #888;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  td {
    padding: 18px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    color: #ccc;
    font-size: 14px;
  }

  tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
`;

export const TableActions = styled.div`
  display: flex;
  gap: 12px;

  a, svg {
    color: #555;
    transition: all 0.2s;
    cursor: pointer;
  }

  .edit-btn:hover {
    color: #f1c40f;
    transform: translateY(-2px);

    svg {
      color: #f1c40f;
    }
  }

  .delete-btn:hover {
    color: #e74c3c;
    transform: translateY(-2px);

    svg {
      color: #e74c3c;
    }
  }

  .profile-btn:hover {
    color: #3498db;
    transform: translateY(-2px);

    svg {
      color: #3498db;
    }
  }
`;

export const TableContainer = styled.div`
  width: 100%;
  background: #242433;
  border-radius: 12px;
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  -webkit-overflow-scrolling: touch;
`;

export const TableNameCol = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 150px;

  strong {
    color: #fff;
    font-size: 14px;
  }

  span {
    color: #666;
    font-size: 12px;
  }
`;

export const ToggleButton = styled.button`
  background: transparent;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  color: ${(props) => (props.$active ? '#fff' : '#555')};
  background: ${(props) => (props.$active ? colors.primaryColor : 'transparent')};
  flex: 1;

  &:hover {
    background: ${(props) => (props.$active ? colors.primaryColor : 'rgba(255,255,255,0.05)')};
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    justify-content: center;
  }
`;
