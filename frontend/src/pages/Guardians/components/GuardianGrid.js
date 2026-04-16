import { Link } from 'react-router-dom';
import { FaUserCircle, FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';
import {
  GuardianContainer, GuardianCard, ProfilePicture, GuardianName, GuardianStatus,
  GuardianEmail, GuardianDetails, DetailRow, ActionRow
} from '../styled.js';

export default function GuardianGrid({
  guardians,
  animationParent,
  confirmDeleteId,
  handleDeleteAsk,
  handleDelete
}) {
  return (
    <GuardianContainer ref={animationParent}>
      {guardians.map(guardian => (
        <GuardianCard key={String(guardian.id)}>
          <ProfilePicture>
            {guardian.avatar_url
              ? <img src={`${process.env.REACT_APP_API_URL}/images/guardians/${guardian.avatar_url}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <FaUserCircle size={100} color="#1b1b28" />}
          </ProfilePicture>
          <GuardianName>{guardian.name}</GuardianName>
          <GuardianEmail>{guardian.email}</GuardianEmail>
          <GuardianDetails>
            <DetailRow><span>Phone</span><span>{guardian.phone}</span></DetailRow>
            <DetailRow><span>CPF</span><span>{guardian.cpf}</span></DetailRow>
          </GuardianDetails>
          <ActionRow>
            <Link to={`/guardian/${guardian.id}/edit`} className="edit-btn"><FaEdit size={18} /></Link>
            {confirmDeleteId === guardian.id ? (
              <FaExclamation size={18} onClick={(e) => handleDelete(e, guardian.id)} color="#e74c3c" cursor="pointer" />
            ) : (
              <Link to="/" onClick={(e) => handleDeleteAsk(e, guardian.id)} className="delete-btn">
                <FaWindowClose size={18} />
              </Link>
            )}
            <Link to={`/guardian/${guardian.id}/`} className="profile-btn">
              <FaUserCircle size={18} />
            </Link>
          </ActionRow>
        </GuardianCard>
      ))}
    </GuardianContainer>
  );
}
