import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as colors from '../../config/colors';

export const Container = styled.div`
  max-width: 1080px;
  margin: 30px auto;
  padding: 0 20px;
`;

export const HeaderToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
  margin-bottom: 25px;

  h1 {
    font-size: 32px;
    color: #fff;
    font-weight: bold;
  }
`;

export const NewStudentLink = styled(Link)`
  background: ${colors.primaryColor};
  color: #fff;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

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
  flex-wrap: wrap;
`;

export const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 12px 15px;
  flex: 1;
  max-width: 450px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  svg {
    margin-right: 12px;
  }

  input {
    border: none;
    outline: none;
    width: 100%;
    background: transparent;
    font-size: 15px;
    color: #333;
    &::placeholder { color: #aaa; }
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

export const ToggleButton = styled.button`
  background: transparent;
  border: none;
  padding: 12px 18px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${(props) => (props.$active ? '#fff' : '#999')};
  background: ${(props) => (props.$active ? colors.primaryColor : 'transparent')};

  &:hover {
    color: ${(props) => (props.$active ? '#fff' : colors.primaryColor)};
    background: ${(props) => (props.$active ? colors.primaryColor : '#f5f5f5')};
  }
`;

export const NoResultsMessage = styled.p`
  text-align: center;
  width: 100%;
  padding: 20px;
  color: #666;
`;

export const ProfilePicture = styled.div`
  position: relative;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover .overlay-container { opacity: 1; }
`;

export const ProfileLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.primaryColor};
  position: relative;
  transition: opacity 0.2s;
  text-decoration: none;

  &:hover { opacity: 0.7; }

  &[href^="/avatar/"] {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #f5f5f5;
  }
`;

export const PictureOverlay = styled.div.attrs({
  className: 'overlay-container'
})`
  position: absolute;
  text-align: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  span {
    color: #fff;
    font-size: 10px;
    margin-top: 4px;
    font-weight: bold;
  }
`;

export const StudentName = styled.h3`
  font-size: 18px;
  color: #333;
  margin: 10px 0 5px 0;
  font-weight: 700;
`;

export const StudentEmail = styled.span`
  font-size: 14px;
  color: #888;
  margin-bottom: 15px;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`;

export const StudentDetails = styled.div`
  width: 100%;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  border: 1px solid #eee;
  transition: all 0.2s;
`;

export const DetailRow = styled.div`
  display: flex;
  font-size: 12px;

  span:first-child {
    font-weight: bold;
    color: #777;
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 0.5px;
  }

  span:last-child {
    color: #333;
    font-weight: 600;
    font-family: 'monospace';
  }
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  transition: all 0.2s;

  .delete-btn { color: ${colors.errorColor || '#c30e0e'}; }
`;

export const StudentContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$isGrid
      ? 'repeat(auto-fill, minmax(280px, 1fr))'
      : 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))'};
  gap: 20px;
`;

export const StudentCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  width: 100%;
  max-width: ${(props) => (props.$isGrid ? 'none' : '600px')};
  margin: ${(props) => (props.$isGrid ? '0' : '0 auto')};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s, flex-direction 0.2s;
  flex-direction: ${(props) => (props.$isGrid ? 'column' : 'row')};
  gap: ${(props) => (props.$isGrid ? '0' : '25px')};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }

  ${ProfilePicture} {
    margin-bottom: ${(props) => (props.$isGrid ? '15px' : '0')};
  }

  ${ProfilePicture} img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${ProfilePicture} > svg {
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    padding: 15px;
    color: ${colors.primaryColor};
  }

  .card-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    min-width: 0;
    align-items: ${(props) => (props.$isGrid ? 'center' : 'flex-start')};
    text-align: ${(props) => (props.$isGrid ? 'center' : 'left')};
  }

  ${StudentDetails} {
    width: ${(props) => (props.$isGrid ? '100%' : 'fit-content')};
    padding: ${(props) => (props.$isGrid ? '12px' : '8px 20px')};
    margin-bottom: ${(props) => (props.$isGrid ? '20px' : '0')};
    flex-direction: ${(props) => (props.$isGrid ? 'column' : 'row')};
    justify-content: flex-start;
    gap: ${(props) => (props.$isGrid ? '8px' : '25px')};
    flex-wrap: wrap;
  }

  ${DetailRow} {
    flex-direction: ${(props) => (props.$isGrid ? 'row' : 'column')};
    align-items: ${(props) => (props.$isGrid ? 'center' : 'flex-start')};
    justify-content: ${(props) => (props.$isGrid ? 'space-between' : 'flex-start')};
    gap: ${(props) => (props.$isGrid ? '0' : '4px')};
  }

  ${ActionRow} {
    flex-shrink: 0;
    width: ${(props) => (props.$isGrid ? '100%' : 'auto')};
    flex-direction: ${(props) => (props.$isGrid ? 'row' : 'column')};
    padding-top: ${(props) => (props.$isGrid ? '15px' : '0')};
    padding-left: ${(props) => (props.$isGrid ? '0' : '25px')};
    border-top: ${(props) => (props.$isGrid ? '1px solid #f0f0f0' : 'none')};
    border-left: ${(props) => (props.$isGrid ? 'none' : '1px solid #f0f0f0')};
  }

  @media (max-width: 650px) {
    flex-direction: column;
    gap: 15px;

    ${ProfilePicture} {
      margin-bottom: 15px;
    }

    .card-content {
      align-items: center;
      text-align: center;
    }

    ${StudentDetails} {
      margin-bottom: 20px;
      flex-direction: column;
    }

    ${DetailRow} {
      flex-direction: row;
      align-items: center;
    }

    ${ActionRow} {
      width: 100%;
      flex-direction: row;
      padding-top: 15px;
      padding-left: 0;
      border-top: 1px solid #f0f0f0;
      border-left: none;
    }
  }
`;
