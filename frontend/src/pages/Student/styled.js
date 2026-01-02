import styled from "styled-components";

export const Form = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;

  input {
    margin-bottom: 20px;
    height: 40px;
    padding: 0 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* Um botão em cada ponta */
  gap: 10px; /* Espaço fixo entre eles */
  margin-top: 10px;

  button {
    /* Se quiser que eles dividam o espaço igualmente: */
    flex: 1;

    /* Ou se quiser que eles tenham tamanhos baseados no texto: */
    /* width: auto; */
    /* padding: 0 20px; */
  }
`;

