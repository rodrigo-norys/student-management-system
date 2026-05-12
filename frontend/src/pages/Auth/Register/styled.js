import styled from 'styled-components';
import * as colors from 'config/colors';

const bgColor = '#0f172a';
const surfaceColor = '#1e293b';
const inputBg = '#0f172a';
const borderColor = '#334155';
const textPrimary = '#f8fafc';
const textSecondary = '#94a3b8';
const accentColor = colors.primaryColor || '#3b82f6';

export const Container = styled.div`
  color: ${textPrimary};
  margin: 40px auto;
  max-width: 650px;
  padding: 0 20px;
  width: 100%;
`;

export const Section = styled.div`
  background: ${surfaceColor};
  border: 1px solid ${borderColor};
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 32px;
`;

export const Title = styled.h1`
  color: ${textPrimary};
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
`;

export const SearchArea = styled.div`
  margin-bottom: 24px;
  position: relative;

  input {
    background: ${inputBg};
    border: 1px solid ${borderColor};
    border-radius: 8px;
    color: ${textPrimary};
    font-size: 14px;
    height: 48px;
    padding: 0 16px;
    transition: all 0.2s ease;
    width: 100%;

    &:focus {
      border-color: ${accentColor};
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
      outline: none;
    }

    &::placeholder {
      color: ${textSecondary};
    }
  }
`;

export const SearchResultList = styled.ul`
  background: ${surfaceColor};
  border: 1px solid ${borderColor};
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  list-style: none;
  margin-top: 8px;
  max-height: 300px;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  z-index: 50;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${borderColor};
    border-radius: 3px;
  }
`;

export const SearchItem = styled.li`
  align-items: center;
  border-bottom: 1px solid ${borderColor};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const PersonInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: ${textPrimary};
    font-size: 14px;
  }

  span {
    color: ${textSecondary};
    font-size: 12px;
  }
`;

export const Badge = styled.span`
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 4px 8px;
  text-transform: uppercase;

  ${(props) => {
    switch (props.$type) {
      case 'staff':
        return `background: rgba(139, 92, 246, 0.1); color: #a78bfa;`;
      case 'guardian':
        return `background: rgba(14, 165, 233, 0.1); color: #38bdf8;`;
      default:
        return `background: rgba(34, 197, 94, 0.1); color: #4ade80;`;
    }
  }}
`;

export const SelectedPersonCard = styled.div`
  align-items: center;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid ${borderColor};
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 20px;

  button {
    background: transparent;
    border: 1px solid ${borderColor};
    border-radius: 8px;
    color: ${textSecondary};
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 12px;
    transition: all 0.2s;

    &:hover {
      background: ${borderColor};
      color: ${textPrimary};
    }
  }
`;

export const StatusIndicator = styled.div`
  align-items: center;
  border-radius: 8px;
  display: flex;
  font-size: 12px;
  font-weight: 700;
  gap: 8px;
  justify-content: center;
  margin-bottom: 24px;
  padding: 10px;
  text-transform: uppercase;

  background: ${(props) => (props.$isEdit ? 'rgba(59, 130, 246, 0.1)' : 'rgba(34, 197, 94, 0.1)')};
  border: 1px solid ${(props) => (props.$isEdit ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)')};
  color: ${(props) => (props.$isEdit ? '#60a5fa' : '#4ade80')};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  label {
    color: ${textSecondary};
    display: flex;
    flex-direction: column;
    font-size: 13px;
    font-weight: 600;
    gap: 8px;
  }

  input,
  select {
    background: ${inputBg} !important;
    border: 1px solid ${borderColor};
    border-radius: 8px;
    color: ${textPrimary} !important;
    font-size: 14px;
    height: 44px;
    padding: 0 14px;
    transition: all 0.2s ease;

    &:focus {
      border-color: ${accentColor};
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
      outline: none;
    }
  }

  button[type='submit'] {
    background: ${accentColor};
    border: none;
    border-radius: 8px;
    box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    height: 48px;
    margin-top: 12px;
    transition: all 0.2s;

    &:hover {
      filter: brightness(1.1);
      transform: translateY(-2px);
    }

    &:disabled {
      background: #475569;
      box-shadow: none;
      cursor: not-allowed;
      transform: none;
    }
  }
`;
