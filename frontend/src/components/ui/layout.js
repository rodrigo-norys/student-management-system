import styled from 'styled-components';
import * as colors from 'config/colors';

// Wrapper principal da página.
export const PageContainer = styled.div`
  color: ${colors.textPrimary};
  margin: 40px auto;
  max-width: 1200px;
  padding: 0 20px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

// Layout de duas colunas: sidebar fixa + conteúdo fluido.
export const FormGrid = styled.div`
  align-items: start;
  display: grid;
  gap: 24px;
  grid-template-columns: 320px 1fr;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// Superfície de card/seção.
export const Section = styled.div`
  background: ${colors.surfaceColor};
  border: 1px solid ${colors.borderColor};
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

// Linha de cabeçalho da página com divisória inferior.
export const HeaderContent = styled.div`
  align-items: center;
  border-bottom: 1px solid ${colors.borderColor};
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 20px;

  h1 {
    font-size: 24px;
    font-weight: 700;
  }
`;

// Barra de ações alinhada à direita.
export const ActionsContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  margin-top: 20px;
`;
