import { FaUserCircle, FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import { maskPhone } from 'utils/masks';
import { getGuardianImageUrl } from '../../constants.js';
import * as Styled from '../styled.js';

export default function GuardianTable({
  guardians,
  animationParent,
  confirmDeleteId,
  handleDeleteAsk,
  handleDelete,
  currentPage,
  limit,
}) {
  return (
    <Styled.TableContainer>
      <Styled.StyledTable>
        <thead>
          <tr>
            <th>#</th>
            <th width="80">Avatar</th>
            <th>Info</th>
            <th>Phone</th>
            <th>CPF</th>
            <th width="120">Actions</th>
          </tr>
        </thead>
        <tbody ref={animationParent}>
          {guardians.map((guardian, index) => (
            <tr key={String(guardian.id)}>
              <td>
                <strong>{(currentPage - 1) * limit + index + 1}</strong>
              </td>
              <td>
                <Styled.SmallProfilePic>
                  {guardian.avatar_url ? (
                    <img
                      src={getGuardianImageUrl(guardian.avatar_url)}
                      alt={guardian.name}
                    />
                  ) : (
                    <FaUserCircle size={28} />
                  )}
                </Styled.SmallProfilePic>
              </td>
              <td>
                <Styled.TableNameCol>
                  <strong>
                    {guardian.name} {guardian.last_name}
                  </strong>
                  <span>{guardian.email}</span>
                </Styled.TableNameCol>
              </td>
              <td>{maskPhone(guardian.phone)}</td>
              <td>{cpfValidator.format(guardian.cpf)}</td>
              <td>
                <Styled.TableActions>
                  <Styled.EditButton to={`/guardian/${guardian.id}/edit`}>
                    <FaEdit size={16} />
                  </Styled.EditButton>
                  {confirmDeleteId === guardian.id ? (
                    <Styled.DeleteButton
                      type="button"
                      onClick={(e) => handleDelete(e, guardian.id)}
                      $isConfirming
                    >
                      <FaExclamation size={16} />
                    </Styled.DeleteButton>
                  ) : (
                    <Styled.DeleteButton
                      type="button"
                      onClick={(e) => handleDeleteAsk(e, guardian.id)}
                    >
                      <FaWindowClose size={16} />
                    </Styled.DeleteButton>
                  )}
                  <Styled.ProfileButton to={`/guardian/${guardian.id}/`}>
                    <FaUserCircle size={16} />
                  </Styled.ProfileButton>
                </Styled.TableActions>
              </td>
            </tr>
          ))}
        </tbody>
      </Styled.StyledTable>
    </Styled.TableContainer>
  );
}
