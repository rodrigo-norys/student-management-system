import styled from 'styled-components';
import * as colors from '../../config/colors';

const borderColor = "#323245";
const darkBg = "#1a1a24";
const panelBg = "#222230";
const textLight = "#f5f5f5";
const textMuted = "#9aa0ac";

export const AddressCard = styled.div`
  background: ${darkBg};
  border: 1px solid ${borderColor};
  border-radius: 8px;
  overflow: hidden;
  .card-header {
    background: ${panelBg};
    padding: 10px 15px;
    border-bottom: 1px solid ${borderColor};
    h3 { margin: 0; font-size: 16px; color: ${textLight}; }
  }
  .card-body { padding: 15px; display: flex; flex-direction: column; gap: 15px; }
`;

export const AddressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

export const InfoGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${borderColor};
  div { flex: 1; min-width: 250px; }
  &:last-child { border-bottom: none; }
`;

export const Label = styled.span`
  display: block;
  font-size: 13px;
  color: ${textMuted};
  margin-bottom: 5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  svg { margin-right: 5px; color: ${textMuted}; }
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${borderColor};
  margin-bottom: 20px;
  .avatar-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    background-color: ${darkBg};
    border: 2px solid ${borderColor};
    img { width: 100%; height: 100%; object-fit: cover; }
  }
  .info {
    flex: 1;
    h1 { margin: 0; font-size: 24px; color: ${textLight}; }
    p { margin: 5px 0 0; color: ${textMuted}; font-size: 14px; }
  }
  .actions {
    .edit-button {
      background-color: ${colors.primaryColor};
      color: #fff;
      padding: 10px 15px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: all 300ms;
      &:hover { filter: brightness(85%); }
    }
  }
`;

export const TabContent = styled.div`
  padding: 10px 0;
  h3, h2 { margin-bottom: 15px; color: ${textLight}; }
  p { color: ${textLight}; }
  .no-data { color: ${textMuted}; font-style: italic; }
`;

export const TabNav = styled.nav`
  display: flex;
  gap: 15px;
  border-bottom: 2px solid ${borderColor};
  margin-bottom: 20px;
  button {
    background: none;
    border: none;
    padding: 10px 15px;
    font-size: 15px;
    font-weight: 600;
    color: ${textMuted};
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 300ms;
    margin-bottom: -2px;
    &:hover { color: ${textLight}; }
    &.active {
      color: ${colors.primaryColor || '#007bff'};
      border-bottom: 3px solid ${colors.primaryColor || '#007bff'};
    }
  }
`;

export const Value = styled.span`
  display: block;
  font-size: 15px;
  color: ${textLight};
`;

export const DependentCard = styled.div`
  background: ${darkBg};
  border: 1px solid ${borderColor};
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  img, svg { width: 50px; height: 50px; border-radius: 50%; }
  .dep-info {
    h4 { margin: 0; color: ${textLight}; }
    span { font-size: 12px; color: ${textMuted}; }
  }
`;
