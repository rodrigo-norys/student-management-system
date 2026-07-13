// @ts-check

/**
 * Guarda de alvo da política de delete (user/staff/guardian/student).
 *
 * As duas regras são acopladas e precisam viver juntas: a paridade (`>=`)
 * permite que pesos iguais se desativem — níveis 2 e 3 têm peso 80 —, mas
 * sozinha ela também liberaria um nível-1 desativar outro nível-1, já que
 * 100 >= 100. É `isProtectedTarget` que fecha esse buraco.
 *
 * Ambas recebem o `user_id` CRU da linha e o user CARREGADO, e não só o user.
 * O par é o que permite distinguir "o alvo não tem conta" (user_id null —
 * liberado, não há hierarquia a violar) de "o include do user/access_level não
 * veio" (user_id presente, dado ausente — barrado). Sem essa distinção a guarda
 * falharia ABERTA: a convenção do projeto é projetar o include com `attributes`
 * whitelisted (ver GuardianController.show e loginRequired), e uma projeção que
 * derrubasse `access_level_id` desligaria a proteção do General Director em
 * silêncio. Aqui, projeção incompleta trava o delete em vez de liberá-lo.
 */

export const PROTECTED_ACCESS_LEVEL_ID = 1;

export const PROTECTED_TARGET_ERROR =
  'Forbidden. The General Director cannot be deactivated.';

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
