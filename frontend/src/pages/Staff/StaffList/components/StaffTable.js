import { FaUserShield, FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';

import { maskPhone } from 'utils/masks';
import { getStaffImageUrl } from '../../constants.js';
import * as Styled from '../styled.js';

export default function StaffTable({
  staff,
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
            <th>Status</th>
            <th width="80">Avatar</th>
            <th>Info</th>
            <th>Job Title</th>
            <th>Phone</th>
            <th width="120">Actions</th>
          </tr>
        </thead>
        <tbody ref={animationParent}>
          {staff.map((member, index) => (
            <tr key={String(member.id)}>
              <td>
                <strong>{(currentPage - 1) * limit + index + 1}</strong>
              </td>
              <Styled.StatusCell $status={member.status}>
                {member.status?.toUpperCase()}
              </Styled.StatusCell>
              <td>
                <Styled.SmallProfilePic>
                  {member.avatar_url ? (
                    <img
                      src={getStaffImageUrl(member.avatar_url)}
                      alt={member.full_name}
                    />
                  ) : (
                    <FaUserShield size={28} />
                  )}
                </Styled.SmallProfilePic>
              </td>
              <td>
                <Styled.TableNameCol>
                  <strong>{member.full_name}</strong>
                  <span>{member.email}</span>
                </Styled.TableNameCol>
              </td>
              <td>{member.job_title}</td>
              <td>{maskPhone(member.phone)}</td>
              <td>
                <Styled.TableActions>
                  <Styled.EditButton to={`/staff/${member.id}/edit`}>
                    <FaEdit size={16} />
                  </Styled.EditButton>
                  {confirmDeleteId === member.id ? (
                    <Styled.DeleteButton
                      type="button"
                      onClick={(e) => handleDelete(e, member.id)}
                      $isConfirming
                    >
                      <FaExclamation size={16} />
                    </Styled.DeleteButton>
                  ) : (
                    <Styled.DeleteButton
                      type="button"
                      onClick={(e) => handleDeleteAsk(e, member.id)}
                    >
                      <FaWindowClose size={16} />
                    </Styled.DeleteButton>
                  )}
                  <Styled.ProfileButton to={`/staff/${member.id}/`}>
                    <FaUserShield size={16} />
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
