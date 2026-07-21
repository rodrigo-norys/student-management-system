import { FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';

import * as Styled from '../styled.js';

export default function UnitClassTable({
  unitClasses,
  confirmDeleteId,
  handleDeleteAsk,
  handleDelete,
  currentPage,
  limit,
  canManage,
}) {
  return (
    <Styled.TableContainer>
      <Styled.StyledTable>
        <thead>
          <tr>
            <th>#</th>
            <th>Class</th>
            <th>Unit</th>
            <th>Grade</th>
            <th>Room</th>
            <th>Shift</th>
            <th width="90">Year</th>
            <th width="100">Status</th>
            {canManage && <th width="100">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {unitClasses.map((unitClass, index) => (
            <tr key={String(unitClass.id)}>
              <td>
                <strong>{(currentPage - 1) * limit + index + 1}</strong>
              </td>
              <td>
                <Styled.TableNameCol>
                  <strong>{unitClass.name}</strong>
                  <span>Max {unitClass.max_students}</span>
                </Styled.TableNameCol>
              </td>
              <td>{unitClass.unit?.name || '—'}</td>
              <td>{unitClass.grade_level}</td>
              <td>{unitClass.room_number}</td>
              <td>{unitClass.shift}</td>
              <td>{unitClass.school_year}</td>
              <td>
                <Styled.StatusCell $status={unitClass.status}>
                  {unitClass.status}
                </Styled.StatusCell>
              </td>
              {canManage && (
                <td>
                  <Styled.TableActions>
                    <Styled.EditButton to={`/unit-class/${unitClass.id}/edit`}>
                      <FaEdit size={16} />
                    </Styled.EditButton>
                    {confirmDeleteId === unitClass.id ? (
                      <Styled.DeleteButton
                        type="button"
                        onClick={(e) => handleDelete(e, unitClass.id)}
                        $isConfirming
                      >
                        <FaExclamation size={16} />
                      </Styled.DeleteButton>
                    ) : (
                      <Styled.DeleteButton
                        type="button"
                        onClick={(e) => handleDeleteAsk(e, unitClass.id)}
                      >
                        <FaWindowClose size={16} />
                      </Styled.DeleteButton>
                    )}
                  </Styled.TableActions>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Styled.StyledTable>
    </Styled.TableContainer>
  );
}
