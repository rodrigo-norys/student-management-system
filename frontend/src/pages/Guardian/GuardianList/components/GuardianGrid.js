import { FaUserCircle, FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import { maskPhone } from 'utils/masks';
import { getGuardianImageUrl } from '../../constants.js';
import * as Styled from '../styled.js';

export default function GuardianGrid({
  guardians,
  animationParent,
  confirmDeleteId,
  handleDeleteAsk,
  handleDelete,
}) {
  return (
    <Styled.GuardianContainer ref={animationParent}>
      {guardians.map((guardian) => (
        <Styled.GuardianCard key={String(guardian.id)}>
          <Styled.ProfilePicture>
            {guardian.avatar_url ? (
              <img
                src={getGuardianImageUrl(guardian.avatar_url)}
                alt={guardian.name}
              />
            ) : (
              <FaUserCircle size={100} />
            )}
          </Styled.ProfilePicture>
          <Styled.GuardianName>{guardian.name}</Styled.GuardianName>
          <Styled.GuardianEmail>{guardian.email}</Styled.GuardianEmail>
          <Styled.GuardianDetails>
            <Styled.DetailRow>
              <span>Phone</span>
              <span>{maskPhone(guardian.phone)}</span>
            </Styled.DetailRow>
            <Styled.DetailRow>
              <span>CPF</span>
              <span>{cpfValidator.format(guardian.cpf)}</span>
            </Styled.DetailRow>
          </Styled.GuardianDetails>
          <Styled.ActionRow>
            <Styled.EditButton to={`/guardian/${guardian.id}/edit`}>
              <FaEdit size={18} />
            </Styled.EditButton>
            {confirmDeleteId === guardian.id ? (
              <Styled.DeleteButton
                type="button"
                onClick={(e) => handleDelete(e, guardian.id)}
                $isConfirming
              >
                <FaExclamation size={18} />
              </Styled.DeleteButton>
            ) : (
              <Styled.DeleteButton
                type="button"
                onClick={(e) => handleDeleteAsk(e, guardian.id)}
              >
                <FaWindowClose size={18} />
              </Styled.DeleteButton>
            )}
            <Styled.ProfileButton to={`/guardian/${guardian.id}/`}>
              <FaUserCircle size={18} />
            </Styled.ProfileButton>
          </Styled.ActionRow>
        </Styled.GuardianCard>
      ))}
    </Styled.GuardianContainer>
  );
}
