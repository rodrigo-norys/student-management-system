import { Link } from 'react-router-dom';
import { FaUserCircle, FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import {
  TableContainer, StyledTable, SmallProfilePic, TableNameCol, TableActions
} from '../styled.js';

export default function StudentTable({
  students,
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
            <th>Registration</th>
            <th>CPF</th>
            <th width="120">Actions</th>
          </tr>
        </thead>
        <tbody ref={animationParent}>
          {students.map((student, index) => (
            <tr key={String(student.id)}>
              <td><strong>{(currentPage - 1) * limit + index + 1}</strong></td>
              <td>
                <SmallProfilePic>
                  {student.avatar_url
                    ? <img src={`${process.env.REACT_APP_API_URL}/images/students/${student.avatar_url}`} alt="" />
                    : <FaUserCircle size={28} color="#1b1b28" />}
                </SmallProfilePic>
              </td>
              <td>
                <TableNameCol>
                  <strong>{student.name} {student.last_name}</strong>
                  <span>{student.email}</span>
                </TableNameCol>
              </td>
              <td>{student.registration_number}</td>
              <td>{cpfValidator.format(student.cpf)}</td>
              <td>
                <TableActions>
                  <Link to={`/student/${student.id}/edit`} className="edit-btn">
                    <FaEdit size={16} />
                  </Link>
                  {confirmDeleteId === student.id ? (
                    <FaExclamation size={16} onClick={(e) => handleDelete(e, student.id)} color="#e74c3c" />
                  ) : (
                    <Link to="/" onClick={(e) => handleDeleteAsk(e, student.id)} className="delete-btn">
                      <FaWindowClose size={16} />
                    </Link>
                  )}
                  <Link to={`/student/${student.id}/`} className="profile-btn">
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
