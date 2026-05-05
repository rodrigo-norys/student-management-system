import styled from 'styled-components';
import * as colors from 'config/colors';

const bgColor = '#0f172a';
const surfaceColor = '#1e293b';
const displayBg = '#0f172a';
const borderColor = '#334155';
const textPrimary = '#f8fafc';
const textSecondary = '#94a3b8';
const accentColor = colors.primaryColor || '#3b82f6';

export const AddressCard = styled.div`
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid ${borderColor};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;

  &:hover {
    border-color: ${accentColor}60;
  }
`;

export const AddressCardHeader = styled.div`
  border-bottom: 1px solid ${borderColor};
  margin-bottom: 15px;
  padding-bottom: 10px;

  h3 {
    color: ${textSecondary};
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }
`;

export const AddressGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  margin-top: 10px;
`;

export const Container = styled.div`
  color: ${textPrimary};
  margin: 40px auto;
  max-width: 1200px;
  padding: 0 20px;
  width: 100%;
`;

export const FormGrid = styled.div`
  align-items: start;
  display: grid;
  gap: 24px;
  grid-template-columns: 320px 1fr;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoGroup = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin-bottom: 20px;
`;

export const Label = styled.span`
  color: ${textSecondary};
  display: flex;
  font-size: 11px;
  font-weight: 700;
  gap: 8px;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  text-transform: uppercase;

  svg {
    color: ${accentColor};
  }
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const MedicalNotesWrapper = styled.div`
  background: ${displayBg};
  border: 1px solid ${borderColor};
  border-radius: 8px;
  color: ${textPrimary};
  font-size: 14px;
  line-height: 1.6;
  min-height: 100px;
  padding: 15px;

  .no-data {
    color: ${textSecondary};
    font-style: italic;
  }
`;

export const ProfilePicture = styled.div`
  display: flex;
  height: 160px;
  justify-content: center;
  margin: 0 auto 20px;
  position: relative;
  width: 160px;

  img,
  svg {
    background: ${bgColor};
    border: 4px solid ${surfaceColor};
    border-radius: 50%;
    box-shadow: 0 0 0 2px ${borderColor};
    height: 100% !important;
    object-fit: cover;
    width: 100% !important;
  }
`;

export const Section = styled.div`
  background: ${surfaceColor};
  border: 1px solid ${borderColor};
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const TabNav = styled.nav`
  border-bottom: 1px solid ${borderColor};
  display: flex;
  gap: 10px;
  margin-bottom: 25px;

  button {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: ${textSecondary};
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: -1px;
    padding: 12px 20px;
    transition: all 0.2s;

    &:hover {
      color: ${textPrimary};
    }

    &.active {
      border-bottom-color: ${accentColor};
      color: ${accentColor};
    }
  }
`;

export const Value = styled.div`
  background: ${displayBg};
  border: 1px solid ${borderColor};
  border-radius: 6px;
  color: ${textPrimary};
  font-size: 14px;
  font-weight: 500;
  padding: 10px 14px;
`;

export const HeaderContent = styled.div`
  align-items: center;
  border-bottom: 1px solid ${borderColor};
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 20px;
`;

export const PrimaryButton = styled.button`
  align-items: center;
  background: ${accentColor};
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);
  color: #fff;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 700;
  gap: 8px;
  padding: 10px 20px;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ActionsContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  margin-top: 20px;
`;
