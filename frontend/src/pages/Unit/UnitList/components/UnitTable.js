import { FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';
import { cnpj as cnpjValidator } from 'cpf-cnpj-validator';

import { maskPhone } from 'utils/masks';
import * as Styled from '../styled.js';

export default function UnitTable({
  units,
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
            <th>Info</th>
            <th>CNPJ</th>
            <th>Phone</th>
            <th>City</th>
            <th width="100">Status</th>
            {canManage && <th width="100">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {units.map((unit, index) => (
            <tr key={String(unit.id)}>
              <td>
                <strong>{(currentPage - 1) * limit + index + 1}</strong>
              </td>
              <td>
                <Styled.TableNameCol>
                  <strong>{unit.name}</strong>
                  <span>{unit.email}</span>
                </Styled.TableNameCol>
              </td>
              <td>{unit.cnpj ? cnpjValidator.format(unit.cnpj) : '—'}</td>
              <td>{maskPhone(unit.phone)}</td>
              <td>{unit.address?.city || '—'}</td>
              <td>
                <Styled.StatusCell $status={unit.status}>
                  {unit.status}
                </Styled.StatusCell>
              </td>
              {canManage && (
                <td>
                  <Styled.TableActions>
                    <Styled.EditButton to={`/unit/${unit.id}/edit`}>
                      <FaEdit size={16} />
                    </Styled.EditButton>
                    {confirmDeleteId === unit.id ? (
                      <Styled.DeleteButton
                        type="button"
                        onClick={(e) => handleDelete(e, unit.id)}
                        $isConfirming
                      >
                        <FaExclamation size={16} />
                      </Styled.DeleteButton>
                    ) : (
                      <Styled.DeleteButton
                        type="button"
                        onClick={(e) => handleDeleteAsk(e, unit.id)}
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
