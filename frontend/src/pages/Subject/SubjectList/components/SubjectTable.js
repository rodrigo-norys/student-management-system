import { FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';

import * as Styled from '../styled.js';

export default function SubjectTable({
  subjects,
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
            <th>Info</th>
            <th>Knowledge Area</th>
            <th width="90">Elective</th>
            <th width="100">Status</th>
            <th width="100">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={String(subject.id)}>
              <td>
                <strong>{(currentPage - 1) * limit + index + 1}</strong>
              </td>
              <td>
                <Styled.TableNameCol>
                  <strong>{subject.name}</strong>
                  <span>{subject.code}</span>
                </Styled.TableNameCol>
              </td>
              <td>{subject.knowledge_area || '—'}</td>
              <td>{subject.is_elective ? 'Yes' : 'No'}</td>
              <td>
                <Styled.StatusCell $status={subject.status}>
                  {subject.status}
                </Styled.StatusCell>
              </td>
              <td>
                <Styled.TableActions>
                  <Styled.EditButton to={`/subject/${subject.id}/edit`}>
                    <FaEdit size={16} />
                  </Styled.EditButton>
                  {confirmDeleteId === subject.id ? (
                    <Styled.DeleteButton
                      type="button"
                      onClick={(e) => handleDelete(e, subject.id)}
                      $isConfirming
                    >
                      <FaExclamation size={16} />
                    </Styled.DeleteButton>
                  ) : (
                    <Styled.DeleteButton
                      type="button"
                      onClick={(e) => handleDeleteAsk(e, subject.id)}
                    >
                      <FaWindowClose size={16} />
                    </Styled.DeleteButton>
                  )}
                </Styled.TableActions>
              </td>
            </tr>
          ))}
        </tbody>
      </Styled.StyledTable>
    </Styled.TableContainer>
  );
}
