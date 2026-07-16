// @ts-check
import Staff from '../models/Staff.js';

const FORBIDDEN =
  'Forbidden. You do not have permission to access this resource.';

function isValidId(id) {
  return id && !isNaN(Number(id)) && Number(id) > 0;
}

/**
 * Autorização do PATCH /avatar/:userType/:id. Avatar de terceiro exige
 * `manage_account`; o único self permitido é o de staff na própria ficha, ativa.
 *
 * A existência da ficha em `staff` é o que identifica o ator como staff:
 * nenhuma flag de access_level distingue staff de student/guardian.
 *
 * O status da ficha é independente do status da conta — uma ficha desativada
 * convive com login válido.
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
export default async function avatarAuth(req, res, next) {
  if (req.userPermissions?.manage_account) return next();

  const { userType, id } = req.params;

  if (userType === 'staff' && isValidId(id)) {
    // Os models não são tipados para checkJs.
    const staff = await /** @type {any} */ (Staff).findByPk(id, {
      attributes: ['id', 'user_id', 'status'],
    });
    if (
      staff &&
      staff.status === 'active' &&
      Number(staff.user_id) === Number(req.userId)
    ) {
      return next();
    }
  }

  return res.status(403).json({ errors: [FORBIDDEN] });
}
