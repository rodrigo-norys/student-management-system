import React from 'react';
import { FaUserCircle, FaUserCheck } from 'react-icons/fa';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import * as Styled from '../styled';

export default function PendingAccessView({
  dataList,
  currentPage,
  limit,
  onValidateClick,
  viewMode = 'table',
}) {

  // GRID VIEW - RENDERIZAÇÃO DO MODO GRID
  if (viewMode === 'grid') {
    return (
      <Styled.GridContainer>
        {dataList.map((target) => (
          <Styled.UserCard key={`pending-grid-${target.type}-${target.id}`}>

            <p>{target.displayName}</p>
          </Styled.UserCard>
        ))}
      </Styled.GridContainer>
    );
  }

  // TABLE VIEW - RENDERIZAÇÃO DO MODO TABELA (DEFAULT)
  return (
    <Styled.TableContainer>
      <Styled.StyledTable>
        <thead>
          <tr>
            <th>#</th>
            <th width="80">Avatar</th>
            <th>Info</th>
            <th>Role</th>
            <th>CPF</th>
            <th width="140">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((target, index) => {
            const displayIndex = (currentPage - 1) * limit + index + 1;
            const formattedCpf = cpfValidator.format(target.cpf) || target.cpf;

            return (
              <tr key={`pending-table-${target.type}-${target.id}`}>
                <td>
                  <strong>{displayIndex}</strong>
                </td>

                <td>
                  <Styled.SmallProfilePic>
                    <FaUserCircle size={28} />
                  </Styled.SmallProfilePic>
                </td>

                <td>
                  <Styled.TableNameCol>
                    <strong>{target.displayName}</strong>
                    <span>{target.email || 'No email provided'}</span>
                  </Styled.TableNameCol>
                </td>

                <Styled.RoleCell>
                  {target.type || ''}
                </Styled.RoleCell>

                <td>{formattedCpf}</td>

                <td>
                  <Styled.TableActions>
                    <Styled.GrantButton
                      type="button"
                      title="Validate"
                      onClick={() => onValidateClick(target)}
                    >
                      <FaUserCheck size={14} />
                      <span>Validate</span>
                    </Styled.GrantButton>
                  </Styled.TableActions>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Styled.StyledTable>
    </Styled.TableContainer>
  );
}
