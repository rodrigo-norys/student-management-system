// @ts-check

/**
 * Guardas de alvo da política de delete (user/staff/guardian/student).
 *
 * As duas regras são acopladas: a paridade (`>=`) sozinha liberaria um nível-1
 * desativar outro nível-1, já que 100 >= 100; é `isProtectedTarget` que fecha
 * essa brecha.
 *
 * Ambas recebem o `user_id` cru da linha além do user carregado. O par distingue
 * "alvo sem conta" (liberado) de "projeção não trouxe o nível" (barrado), de
 * modo que um include incompleto trava a operação em vez de liberá-la.
 */

export const PROTECTED_ACCESS_LEVEL_ID = 1;

export const PROTECTED_TARGET_ERROR =
  'Forbidden. The General Director cannot be deactivated.';

/**
 * Piso de escrita da estrutura acadêmica. `manage_academic` alcança do
 * Academic Coordinator ao Teacher; o peso é o que separa os dois, já que
 * nenhuma flag os distingue.
 */
export const ACADEMIC_STRUCTURE_MIN_WEIGHT = 70;

/**
 * @param {number | null | undefined} targetUserId
 * @param {{ access_level_id?: number } | null | undefined} targetUser
 * @returns {boolean}
 */
export function isProtectedTarget(targetUserId, targetUser) {
  if (!targetUserId) return false;
  if (targetUser?.access_level_id == null) return true;

  return Number(targetUser.access_level_id) === PROTECTED_ACCESS_LEVEL_ID;
}

/**
 * @param {number | undefined} actorWeight
 * @param {number | null | undefined} targetUserId
 * @param {{ access_level?: { hierarchy_weight?: number } } | null | undefined} targetUser
 * @returns {boolean}
 */
export function hasAuthorityOver(actorWeight, targetUserId, targetUser) {
  if (!targetUserId) return true;

  const targetWeight = targetUser?.access_level?.hierarchy_weight;
  if (targetWeight == null) return false;

  return Number(actorWeight) >= Number(targetWeight);
}
