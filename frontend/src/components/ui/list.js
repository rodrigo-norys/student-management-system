import styled from 'styled-components';
import * as colors from 'config/colors';

// Wrapper de página de listagem.
export const ListContainer = styled.div`
  width: 100%;
  margin: 0;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

// Cabeçalho da listagem com título e ação à direita.
export const HeaderToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${colors.borderColor};
  padding-bottom: 20px;
  margin-bottom: 25px;

  h1 {
    font-size: 28px;
    color: ${colors.textPrimary};
    font-weight: 800;
  }
`;

// Barra de controles..
export const ControlsArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 15px;
`;

// Campo de busca com ícone.
export const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background: ${colors.bgColor};
  border-radius: 8px;
  padding: 0 15px;
  flex: 1;
  max-width: 500px;
  border: 1px solid ${colors.borderColor};
  height: 44px;

  input {
    border: none;
    outline: none;
    width: 100%;
    background: transparent;
    font-size: 14px;
    color: ${colors.textPrimary};
    margin-left: 10px;

    &::placeholder {
      color: ${colors.textSecondary};
    }
  }

  svg {
    color: ${colors.textSecondary};
  }
`;

// Moldura rolável da tabela.
export const TableContainer = styled.div`
  width: 100%;
  background: ${colors.surfaceColor};
  border-radius: 12px;
  overflow-x: auto;
  border: 1px solid ${colors.borderColor};
`;

// Linha de ações de uma célula da tabela.
export const TableActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

// Rodapé de ações de um card (modo grid).
export const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid ${colors.borderColor};
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

// Subtítulo do card (e-mail/identificador secundário).
export const CardSubtitle = styled.span`
  color: ${colors.textSecondary};
  font-size: 13px;
  margin-bottom: 20px;
`;

export const CardDetails = styled.div`
  width: 100%;
  border-top: 1px solid ${colors.borderColor};
  padding-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// Par rótulo/valor dentro dos detalhes.
export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;

  span:first-child {
    color: ${colors.textSecondary};
    font-weight: 600;
  }
  span:last-child {
    color: ${colors.textPrimary};
    font-weight: 700;
  }
`;

export const PaginationArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
  padding-bottom: 20px;

  span {
    font-size: 13px;
    font-weight: 700;
    color: ${colors.textSecondary};
  }
`;

// Mensagem de lista vazia.
export const NoResultsMessage = styled.p`
  color: ${colors.textSecondary};
  text-align: center;
  padding: 60px 0;
  font-weight: 600;
`;

// Tabela de dados.
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background-color: rgba(15, 23, 42, 0.4);
    color: ${colors.textSecondary};
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 16px 20px;
    border-bottom: 1px solid ${colors.borderColor};
    text-align: center;
  }

  td {
    padding: 16px 20px;
    border-bottom: 1px solid ${colors.borderColor};
    color: ${colors.textPrimary};
    font-size: 14px;
    text-align: center;
    vertical-align: middle;
  }

  tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
`;

// Botão de paginação.
export const PageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${colors.surfaceColor};
  color: ${colors.textPrimary};
  border: 1px solid ${colors.borderColor};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${colors.borderColor};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// Alternador de visualização.
export const ViewToggle = styled.div`
  display: flex;
  background: ${colors.bgColor};
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${colors.borderColor};
  height: 44px;
`;

export const ToggleButton = styled.button`
  background: ${(props) => (props.$active ? colors.accentColor : 'transparent')};
  border: none;
  padding: 0 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${(props) => (props.$active ? '#fff' : colors.textSecondary)};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    color: ${(props) => (props.$active ? '#fff' : colors.textPrimary)};
  }
`;

export const EntityCard = styled.div`
  background: ${colors.surfaceColor};
  border-radius: 12px;
  padding: 24px;
  border: 1px solid ${colors.borderColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.accentColor}80;
    transform: translateY(-4px);
  }
`;

export const CardTitle = styled.h3`
  color: ${colors.textPrimary};
  font-size: 18px;
  margin-bottom: 4px;
`;

// Coluna de nome na tabela.
export const TableNameCol = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;

  strong {
    color: ${colors.textPrimary};
    font-size: 14px;
  }

  span {
    color: ${colors.textSecondary};
    font-size: 12px;
  }
`;

// Miniatura de avatar na tabela.
export const SmallProfilePic = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  background: ${colors.bgColor};
  border: 1px solid ${colors.borderColor};
  margin: 0 auto;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    color: ${colors.borderColor};
  }
`;
