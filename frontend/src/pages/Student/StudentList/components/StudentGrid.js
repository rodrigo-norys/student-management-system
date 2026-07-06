import {
  FaUserCircle,
  FaEdit,
  FaWindowClose,
  FaExclamation,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { getStudentAvatarUrl } from 'utils/imageHelpers';

import * as Styled from '../styled';

export default function StudentGrid({
  students,
  animationParent,
  confirmDeleteId,
  handleDeleteAsk,
  handleDelete,
}) {
  return (
    <Styled.StudentContainer ref={animationParent}>
      {students.map((student) => (
        <Styled.StudentCard key={String(student.id)}>
          <Styled.StudentStatus $status={student.status}>
            {student.status.toUpperCase()}
          </Styled.StudentStatus>

          <Styled.ProfilePicture>
            {student.avatar_url ? (
              <img
                src={getStudentAvatarUrl(student.avatar_url)}
                alt={student.name}
              />
            ) : (
              <FaUserCircle size={28} />
            )}
          </Styled.ProfilePicture>

          <Styled.StudentName>{student.name}</Styled.StudentName>
          <Styled.StudentEmail>{student.email}</Styled.StudentEmail>

          <Styled.StudentDetails>
            <Styled.DetailRow>
              <span>Registration</span>
              <span>{student.registration_number}</span>
            </Styled.DetailRow>
            <Styled.DetailRow>
              <span>Blood Type</span>
              <span>{student.blood_type || 'N/A'}</span>
            </Styled.DetailRow>
          </Styled.StudentDetails>

          <Styled.ActionRow>
            <Styled.EditButton to={`/student/${student.id}/edit`}>
              <FaEdit size={18} />
            </Styled.EditButton>

            {confirmDeleteId === student.id ? (
              <Styled.DeleteButton
                type="button"
                onClick={(e) => handleDelete(e, student.id)}
                $isConfirming
              >
                <FaExclamation size={18} />
              </Styled.DeleteButton>
            ) : (
              <Styled.DeleteButton
                type="button"
                onClick={(e) => handleDeleteAsk(e, student.id)}
              >
                <FaWindowClose size={18} />
              </Styled.DeleteButton>
            )}

            <Styled.ProfileButton to={`/student/${student.id}`}>
              <FaExternalLinkAlt size={16} />
            </Styled.ProfileButton>
          </Styled.ActionRow>
        </Styled.StudentCard>
      ))}
    </Styled.StudentContainer>
  );
}
