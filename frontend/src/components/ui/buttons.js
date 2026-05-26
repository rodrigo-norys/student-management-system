import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as colors from 'config/colors';

// Botão primário de ação.
export const PrimaryButton = styled.button`
  align-items: center;
  background: ${colors.accentColor};
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

// Link de criação no cabeçalho das listagens.
export const NewEntityLink = styled(Link)`
  background: ${colors.accentColor};
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

// Botão de ação editar.
export const EditButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.textSecondary};
  transition: all 0.2s ease;

  &:hover {
    color: #f1c40f;
    transform: scale(1.1);
  }
`;

// Botão de ação excluir.
export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  color: ${(props) => (props.$isConfirming ? '#ef4444' : colors.textSecondary)};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #ef4444;
    transform: scale(1.1);
  }
`;

// Botão de ação "ver perfil".
export const ProfileButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.textSecondary};
  transition: all 0.2s ease;

  &:hover {
    color: ${colors.accentColor};
    transform: scale(1.1);
  }
`;
