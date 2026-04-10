import { Link } from 'react-router-dom';
import { FaUserCircle, FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';

import {
  StudentContainer, StudentCard, ProfilePicture, StudentName, StudentStatus,
  StudentEmail, StudentDetails, DetailRow, ActionRow
} from '../styled.js';

export default function StudentGrid({
  students,
  animationParent,
  confirmDeleteId,
  handleDeleteAsk,
  handleDelete
}) {
  return (
    <StudentContainer ref={animationParent}>
      {students.map(student => (
        <StudentCard key={String(student.id)}>
          <StudentStatus $status={student.is_active}>{student.is_active.toUpperCase()}</StudentStatus>
          <ProfilePicture>
            {student.avatar_url
              ? <img src={`${process.env.REACT_APP_API_URL}/images/students/${student.avatar_url}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <FaUserCircle size={100} color="#1b1b28" />}
          </ProfilePicture>
          <StudentName>{student.name}</StudentName>
          <StudentEmail>{student.email}</StudentEmail>
          <StudentDetails>
            <DetailRow><span>Reg.</span><span>{student.registration_number}</span></DetailRow>
            <DetailRow><span>Blood Type</span><span>{student.blood_type}</span></DetailRow>
          </StudentDetails>
          <ActionRow>
            <Link to={`/student/${student.id}/edit`} className="edit-btn"><FaEdit size={18} /></Link>
            {confirmDeleteId === student.id ? (
              <FaExclamation size={18} onClick={(e) => handleDelete(e, student.id)} color="#e74c3c" cursor="pointer" />
            ) : (
              <Link to="/" onClick={(e) => handleDeleteAsk(e, student.id)} className="delete-btn">
                <FaWindowClose size={18} />
              </Link>
            )}
            <Link to={`/student/${student.id}/`} className="profile-btn">
              <FaUserCircle size={18} />
            </Link>
          </ActionRow>
        </StudentCard>
      ))}
    </StudentContainer>
  );
}
