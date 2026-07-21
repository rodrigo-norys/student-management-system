// @ts-check

export const DEFAULT_PAGE_SIZE = 15;
export const MAX_PAGE_SIZE = 100;

/**
 * Normaliza os parâmetros de paginação da query string: valor ausente, não
 * numérico, zero ou negativo cai no default; o teto em `limit` evita varredura
 * de tabela inteira.
 *
 * @param {{ page?: unknown, limit?: unknown }} query
 * @returns {{ page: number, limit: number, offset: number }}
 */
export function parsePagination(query) {
  const parsedPage = Number.parseInt(/** @type {any} */ (query.page), 10);
  const parsedLimit = Number.parseInt(/** @type {any} */ (query.limit), 10);

  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit =
    Number.isInteger(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, MAX_PAGE_SIZE)
      : DEFAULT_PAGE_SIZE;

  return { page, limit, offset: (page - 1) * limit };
}
