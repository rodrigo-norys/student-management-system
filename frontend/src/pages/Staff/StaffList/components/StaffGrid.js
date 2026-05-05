import { FaUserShield, FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';

import { maskPhone } from 'utils/masks';
import { getStaffImageUrl } from '../../constants.js';
import * as Styled from '../styled.js';

export default function StaffGrid({
  staff,
  animationParent,
  confirmDeleteId,
  handleDeleteAsk,
  handleDelete,
}) {
  return (
    <Styled.StaffContainer ref={animationParent}>
      {staff.map((member) => (
        <Styled.StaffCard key={String(member.id)}>
          <Styled.StaffStatus $status={member.status}>
            {member.status?.toUpperCase()}
          </Styled.StaffStatus>
          <Styled.ProfilePicture>
            {member.avatar_url ? (
              <img src={getStaffImageUrl(member.avatar_url)} alt={member.full_name} />
            ) : (
              <FaUserShield size={100} />
            )}
          </Styled.ProfilePicture>
          <Styled.StaffName>{member.full_name}</Styled.StaffName>
          <Styled.StaffEmail>{member.email}</Styled.StaffEmail>
          <Styled.StaffDetails>
            <Styled.DetailRow>
              <span>Job Title</span>
              <span>{member.job_title}</span>
            </Styled.DetailRow>
            <Styled.DetailRow>
              <span>Phone</span>
              <span>{maskPhone(member.phone)}</span>
            </Styled.DetailRow>
          </Styled.StaffDetails>
          <Styled.ActionRow>
            <Styled.EditButton to={`/staff/${member.id}/edit`}>
              <FaEdit size={18} />
            </Styled.EditButton>
            {confirmDeleteId === member.id ? (
              <Styled.DeleteButton
                type="button"
                onClick={(e) => handleDelete(e, member.id)}
                $isConfirming
              >
                <FaExclamation size={18} />
              </Styled.DeleteButton>
            ) : (
              <Styled.DeleteButton
                type="button"
                onClick={(e) => handleDeleteAsk(e, member.id)}
              >
                <FaWindowClose size={18} />
              </Styled.DeleteButton>
            )}
            <Styled.ProfileButton to={`/staff/${member.id}/`}>
              <FaUserShield size={18} />
            </Styled.ProfileButton>
          </Styled.ActionRow>
        </Styled.StaffCard>
      ))}
    </Styled.StaffContainer>
  );
}
