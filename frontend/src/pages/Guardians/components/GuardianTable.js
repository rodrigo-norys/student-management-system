import { Link } from 'react-router-dom';
import { FaUserCircle, FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';
import {
  TableContainer, StyledTable, SmallProfilePic,
  TableNameCol, TableActions, StatusCell
} from '../styled.js';

export default function GuardianTable({
  guardians,
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
              <td><strong>{(currentPage - 1) * limit + index + 1}</strong></td>
              <td>
                <SmallProfilePic>
                  {guardian.avatar_url
                    ? <img src={`${process.env.REACT_APP_API_URL}/images/guardians/${guardian.avatar_url}`} alt="" />
                    : <FaUserCircle size={28} color="#1b1b28" />}
                </SmallProfilePic>
              </td>
              <td>
                <TableNameCol>
                  <strong>{guardian.name} {guardian.last_name}</strong>
                  <span>{guardian.email}</span>
                </TableNameCol>
              </td>
              <td>{guardian.phone}</td>
              <td>{guardian.cpf}</td>
              <td>
                <TableActions>
                  <Link to={`/guardian/${guardian.id}/edit`} className="edit-btn">
                    <FaEdit size={16} />
                  </Link>
                  {confirmDeleteId === guardian.id ? (
                    <FaExclamation size={16} onClick={(e) => handleDelete(e, guardian.id)} color="#e74c3c" />
                  ) : (
                    <Link to="/" onClick={(e) => handleDeleteAsk(e, guardian.id)} className="delete-btn">
                      <FaWindowClose size={16} />
                    </Link>
                  )}
                  <Link to={`/guardian/${guardian.id}/`} className="profile-btn">
                    <FaUserCircle size={16} />
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
