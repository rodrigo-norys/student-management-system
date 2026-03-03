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
  margin-bottom: 30px;

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

export const StudentContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
`;

export const StudentCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const ProfilePicture = styled.div`
  margin-bottom: 15px;
  position: relative;

  a {
    display: block;
    position: relative;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #f5f5f5;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  > svg {
     width: 100%;
     height: 100%;
     background: #f5f5f5;
     padding: 15px;
     color: ${colors.primaryColor};
  }

  &:hover .overlay-container {
    opacity: 1;
  }
`;

export const PictureOverlay = styled.div.attrs({
  className: 'overlay-container'
})`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  text-align: center;
`;

export const StudentEmail = styled.span`
  font-size: 14px;
  color: #888;
  margin-bottom: 15px;
  text-align: center;
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
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #eee;
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.primaryColor};
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }

  .delete-btn {
    color: ${colors.errorColor || '#c30e0e'};
  }
`;
