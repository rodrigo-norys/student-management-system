import styled from 'styled-components';
import * as colors from '../../config/colors';

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;

  .avatar-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #eee;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .empty-avatar {
      width: 100%;
      height: 100%;
      background-color: #ccc;
    }
  }

  .info {
    flex: 1;

    h1 {
      margin: 0;
      font-size: 24px;
      color: ${colors.primaryDarkColor};
    }

    p {
      margin: 5px 0 0;
      color: #666;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .actions {
    .edit-button {
      background-color: ${colors.primaryColor};
      color: #fff;
      padding: 10px 15px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: bold;
      transition: all 300ms;

      &:hover {
        filter: brightness(85%);
      }
    }
  }
`;

export const TabNav = styled.nav`
  display: flex;
  gap: 15px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;

  button {
    background: none;
    border: none;
    padding: 10px 15px;
    font-size: 16px;
    font-weight: bold;
    color: #666;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 300ms;
    margin-bottom: -2px;

    &:hover {
      color: ${colors.primaryColor};
    }

    &.active {
      color: ${colors.primaryColor};
      border-bottom: 3px solid ${colors.primaryColor};
    }
  }
`;

export const TabContent = styled.div`
  padding: 10px 0;

  h3 {
    margin-bottom: 15px;
    color: ${colors.primaryDarkColor};
  }

  h2 {
    margin-bottom: 15px;
    color: ${colors.primaryDarkColor};
  }

  p {
    color: #444;
  }
`;

export const InfoGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;

  div {
    flex: 1;
    min-width: 250px;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const Label = styled.span`
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  font-weight: bold;

  svg {
    margin-right: 5px;
    color: #999;
  }
`;

export const Value = styled.span`
  display: block;
  font-size: 16px;
  color: #333;
`;

export const AddressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

export const AddressCard = styled.div`
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  .card-header {
    background: #eee;
    padding: 10px 15px;
    border-bottom: 1px solid #ddd;

    h3 {
      margin: 0;
      font-size: 16px;
      color: #333;
    }
  }

  .card-body {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
`;

export const MedicalHeader = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  color: #333;
`;

export const BloodField = styled.div`
  flex: 0.3;
  min-width: 150px;
`;

export const NotesField = styled.div`
  flex: 0.7;
  min-width: 250px;

  .long-text {
    line-height: 1.6;
    word-break: break-word;
    margin-top: 8px;
  }

  .no-data {
    color: #999;
    font-style: italic;
  }
`;
