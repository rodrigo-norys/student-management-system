import { Link } from 'react-router-dom';
import { FaUserShield, FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';
import {
  StaffContainer, StaffCard, ProfilePicture, StaffName, StaffStatus,
  StaffEmail, StaffDetails, DetailRow, ActionRow
} from '../styled.js';

export default function StaffGrid({
  staff,
  animationParent,
  confirmDeleteId,
  handleDeleteAsk,
  handleDelete
}) {
  return (
    <StaffContainer ref={animationParent}>
      {staff.map(member => (
        <StaffCard key={String(member.id)}>
          <StaffStatus $status={member.status}>{member.status?.toUpperCase()}</StaffStatus>
          <ProfilePicture>
            {member.avatar_url
              ? <img src={`${process.env.REACT_APP_API_URL}/images/staff/${member.avatar_url}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <FaUserShield size={100} color="#1b1b28" />}
          </ProfilePicture>
          <StaffName>{member.full_name}</StaffName>
          <StaffEmail>{member.email}</StaffEmail>
          <StaffDetails>
            <DetailRow><span>Job Title</span><span>{member.job_title}</span></DetailRow>
            <DetailRow><span>CPF</span><span>{member.cpf}</span></DetailRow>
          </StaffDetails>
          <ActionRow>
            <Link to={`/staff/${member.id}/edit`} className="edit-btn"><FaEdit size={18} /></Link>
            {confirmDeleteId === member.id ? (
              <FaExclamation size={18} onClick={(e) => handleDelete(e, member.id)} color="#e74c3c" cursor="pointer" />
            ) : (
              <Link to="/" onClick={(e) => handleDeleteAsk(e, member.id)} className="delete-btn">
                <FaWindowClose size={18} />
              </Link>
            )}
            <Link to={`/staff/${member.id}/`} className="profile-btn">
              <FaUserShield size={18} />
            </Link>
          </ActionRow>
        </StaffCard>
      ))}
    </StaffContainer>
  );
}
