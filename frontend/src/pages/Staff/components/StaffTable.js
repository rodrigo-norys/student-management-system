import { Link } from 'react-router-dom';
import { FaUserShield, FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';
import {
  TableContainer, StyledTable, SmallProfilePic,
  TableNameCol, TableActions, StatusCell
} from '../styled.js';

export default function StaffTable({
  staff,
  animationParent,
  confirmDeleteId,
  handleDeleteAsk,
  handleDelete,
  currentPage,
  limit
}) {
  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            <th>#</th>
            <th>Status</th>
            <th width="80">Avatar</th>
            <th>Info</th>
            <th>Job Title</th>
            <th>Hiring Date</th>
            <th width="120">Actions</th>
          </tr>
        </thead>
        <tbody ref={animationParent}>
          {staff.map((member, index) => (
            <tr key={String(member.id)}>
              <td><strong>{(currentPage - 1) * limit + index + 1}</strong></td>
              <StatusCell $status={member.status}>
                {member.status?.toUpperCase()}
              </StatusCell>
              <td>
                <SmallProfilePic>
                  {member.avatar_url
                    ? <img src={`${process.env.REACT_APP_API_URL}/images/staff/${member.avatar_url}`} alt="" />
                    : <FaUserShield size={28} color="#1b1b28" />}
                </SmallProfilePic>
              </td>
              <td>
                <TableNameCol>
                  <strong>{member.full_name}</strong>
                  <span>{member.email}</span>
                </TableNameCol>
              </td>
              <td>{member.job_title}</td>
              <td>{member.hiring_date ? new Date(member.hiring_date).toLocaleDateString() : 'N/A'}</td>
              <td>
                <TableActions>
                  <Link to={`/staff/${member.id}/edit`} className="edit-btn">
                    <FaEdit size={16} />
                  </Link>
                  {confirmDeleteId === member.id ? (
                    <FaExclamation size={16} onClick={(e) => handleDelete(e, member.id)} color="#e74c3c" />
                  ) : (
                    <Link to="/" onClick={(e) => handleDeleteAsk(e, member.id)} className="delete-btn">
                      <FaWindowClose size={16} />
                    </Link>
                  )}
                  <Link to={`/staff/${member.id}/`} className="profile-btn">
                    <FaUserShield size={16} />
                  </Link>
                </TableActions>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
}
