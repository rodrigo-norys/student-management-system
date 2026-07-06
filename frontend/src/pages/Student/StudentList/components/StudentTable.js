import {
  FaUserCircle,
  FaEdit,
  FaWindowClose,
  FaExclamation,
  FaExternalLinkAlt,
} from 'react-icons/fa';

import { getStudentAvatarUrl } from 'utils/imageHelpers';
import * as Styled from '../styled';

export default function StudentTable({
  students,
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
            <th>Registration</th>
            <th>Blood Type</th>
            <th width="120">Actions</th>
          </tr>
        </thead>
        <tbody ref={animationParent}>
          {students.map((student, index) => (
            <tr key={String(student.id)}>
              <td>
                <strong>{(currentPage - 1) * limit + index + 1}</strong>
              </td>
              <td>
                <Styled.StatusCell $status={student.status}>
                  {student.status}
                </Styled.StatusCell>
              </td>
              <td>
                <Styled.SmallProfilePic>
                  {student.avatar_url ? (
                    <img
                      src={getStudentAvatarUrl(student.avatar_url)}
                      alt={student.name}
                    />
                  ) : (
                    <FaUserCircle size={28} />
                  )}
                </Styled.SmallProfilePic>
              </td>
              <td>
                <Styled.TableNameCol>
                  <strong>
                    {student.name} {student.last_name}
                  </strong>
                  <span>{student.email}</span>
                </Styled.TableNameCol>
              </td>
              <td>{student.registration_number}</td>
              <td style={{ fontWeight: 700 }}>{student.blood_type || 'N/A'}</td>
              <td>
                <Styled.TableActions>
                  <Styled.EditButton to={`/student/${student.id}/edit`}>
                    <FaEdit size={16} />
                  </Styled.EditButton>

                  {confirmDeleteId === student.id ? (
                    <Styled.DeleteButton
                      type="button"
                      onClick={(e) => handleDelete(e, student.id)}
                      $isConfirming
                    >
                      <FaExclamation size={16} />
                    </Styled.DeleteButton>
                  ) : (
                    <Styled.DeleteButton
                      type="button"
                      onClick={(e) => handleDeleteAsk(e, student.id)}
                    >
                      <FaWindowClose size={16} />
                    </Styled.DeleteButton>
                  )}

                  <Styled.ProfileButton to={`/student/${student.id}/`}>
                    <FaExternalLinkAlt size={14} />
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
