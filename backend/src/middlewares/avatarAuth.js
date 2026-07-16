// @ts-check
import Staff from '../models/Staff.js';

const FORBIDDEN =
  'Forbidden. You do not have permission to access this resource.';

function isValidId(id) {
  return id && !isNaN(Number(id)) && Number(id) > 0;
}

/**
 * Autorização do PATCH /avatar/:userType/:id.
 *
 * Substitui o roleAuth('manage_record') chapado que a rota tinha — ele errava
 * dos dois lados: barrava todo staff sem flag de gestão (um Teacher não trocava
 * nem o próprio avatar) e ao mesmo tempo entregava o avatar de conta alheia a
 * qualquer manage_record, incluindo o Finance Admin.
 *
 * Regra: avatar de TERCEIRO é operação de conta → exige `manage_account`
 * (= só General Director e School Office). O único self permitido é o de staff
 * na própria ficha, e ativa.
 *
 * "Ter linha em `staff`" é o que prova que o ator é staff — e isso é
 * load-bearing, não conveniência: NÃO existe flag que separe staff de
 * student/guardian (Security(6), Student(7) e Guardian(8) têm as quatro
 * manage_* zeradas e o mesmo is_system_level). Como não há self em
 * `users`/`students`/`guardians`, um student não troca nem o próprio avatar.
 *
 * SEM guarda de nível-1 aqui, de propósito: o School Office PODE trocar o avatar
 * do General Director. Diverge de utils/hierarchy.js (onde o nível-1 é
 * intocável) porque lá o ato é terminal — desativar o GD bricka o sistema sem
 * volta; aqui é uma imagem, reversível, e gerenciar a foto do diretor é tarefa
 * administrativa normal do School Office. Decisão do dono, 2026-07-16.
 *
 * Roda ANTES do multer de propósito: autorizar depois gravaria em disco o
 * upload de quem vai levar 403.
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
export default async function avatarAuth(req, res, next) {
  if (req.userPermissions?.manage_account) return next();

  const { userType, id } = req.params;

  if (userType === 'staff' && isValidId(id)) {
    // Cast p/ any como em loginRequired: os models não são tipados para checkJs.
    const staff = await /** @type {any} */ (Staff).findByPk(id, {
      attributes: ['id', 'user_id', 'status'],
    });
    // status ativo entra no self porque o cascade foi desacoplado: desativar a
    // ficha não desativa mais a conta, então um desligado ainda loga.
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
