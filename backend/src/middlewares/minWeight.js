// @ts-check

/**
 * Exige um peso hierárquico mínimo do ator, sem comparar com alvo — é o corte
 * usado quando nenhuma flag separa dois papéis que compartilham a mesma
 * permissão. Complementa o `roleAuth`, que valida a flag.
 *
 * @param {number} minimumWeight
 */
export default (minimumWeight) => {
  return (req, res, next) => {
    if (!(Number(req.userWeight) >= minimumWeight)) {
      return res.status(403).json({
        errors: ['Forbidden or restricted action.'],
      });
    }
    return next();
  };
};
