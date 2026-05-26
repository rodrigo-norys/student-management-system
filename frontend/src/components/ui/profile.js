import styled from 'styled-components';
import * as colors from 'config/colors';

export const ProfilePicture = styled.div`
  display: flex;
  height: 160px;
  justify-content: center;
  margin: 0 auto 20px;
  position: relative;
  width: 160px;

  img,
  svg {
    background: ${colors.bgColor};
    border: 4px solid ${colors.surfaceColor};
    border-radius: 50%;
    box-shadow: 0 0 0 2px ${colors.borderColor};
    height: 100% !important;
    object-fit: cover;
    width: 100% !important;
  }
`;

export const TabNav = styled.nav`
  border-bottom: 1px solid ${colors.borderColor};
  display: flex;
  gap: 10px;
  margin-bottom: 25px;

  button {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: ${colors.textSecondary};
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: -1px;
    padding: 12px 20px;
    transition: all 0.2s;

    &:hover {
      color: ${colors.textPrimary};
    }

    &.active {
      border-bottom-color: ${colors.accentColor};
      color: ${colors.accentColor};
    }
  }
`;

export const InfoGroup = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin-bottom: 20px;
`;

export const Label = styled.span`
  color: ${colors.textSecondary};
  display: flex;
  font-size: 11px;
  font-weight: 700;
  gap: 8px;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  text-transform: uppercase;

  svg {
    color: ${colors.accentColor};
  }
`;

export const Value = styled.div`
  background: ${colors.inputBg};
  border: 1px solid ${colors.borderColor};
  border-radius: 6px;
  color: ${colors.textPrimary};
  font-size: 14px;
  font-weight: 500;
  padding: 10px 14px;
`;

export const AddressGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  margin-top: 10px;
`;
