import styled from 'styled-components';
import * as colors from '../../../config/colors.js';

const bgColor = '#0f172a';
const surfaceColor = '#1e293b';
const borderColor = '#334155';
const textPrimary = '#f8fafc';
const textSecondary = '#94a3b8';
const accentColor = colors.primaryColor || '#3b82f6';

export const Container = styled.div`
  margin: 40px auto;
  max-width: 480px;
  padding: 0 20px;
  width: 100%;
`;

export const Section = styled.section`
  background: ${surfaceColor};
  border: 1px solid ${borderColor};
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
`;

export const Title = styled.h1`
  color: ${textPrimary};
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
`;

export const Form = styled.form`
  label {
    align-items: center;
    background: ${bgColor};
    border: 4px solid ${surfaceColor};
    border-radius: 50%;
    box-shadow: 0 0 0 2px ${borderColor};
    cursor: pointer;
    display: flex;
    height: 180px;
    justify-content: center;
    margin: 0 auto;
    overflow: hidden;
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 180px;

    &:hover {
      border-color: ${surfaceColor};
      box-shadow: 0 0 0 2px ${accentColor};
      transform: scale(1.02);
    }
  }

  input {
    display: none;
  }

  img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  &:hover .overlay {
    opacity: 1;
  }
`;

export const Placeholder = styled.div`
  align-items: center;
  color: ${textSecondary};
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  width: 100%;

  span {
    font-size: 13px;
    font-weight: 700;
    margin-top: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

export const Overlay = styled.div.attrs({
  className: 'overlay',
})`
  align-items: center;
  background: rgba(15, 23, 42, 0.85);
  color: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  transition: opacity 0.2s ease;
  width: 100%;

  span {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.05em;
    margin-top: 8px;
    text-transform: uppercase;
  }
`;
