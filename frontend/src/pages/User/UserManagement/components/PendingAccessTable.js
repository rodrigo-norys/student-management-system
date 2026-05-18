import React from 'react';
import { FaUserCircle, FaUserCheck } from 'react-icons/fa';
import * as Styled from '../styled';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

export default function PendingAccessTable({ dataList, currentPage, limit }) {
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
          {dataList.map((target, index) => (
            <tr key={`${target.type}-${target.id}`}>
              <td>
                <strong>{(currentPage - 1) * limit + index + 1}</strong>
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
              <td style={{ textTransform: 'uppercase', fontWeight: 800, fontSize: '12px', color: '#94a3b8' }}>
                {target.type || ''}
              </td>
              <td>{cpfValidator.format(target.cpf) ? cpfValidator.format(target.cpf) : target.cpf}</td>
              <td>
                <Styled.TableActions>
                  <Styled.GrantButton type="button" title="Grant Access">
                    <FaUserCheck size={14} />
                    <span>Validate</span>
                  </Styled.GrantButton>
                </Styled.TableActions>
              </td>
            </tr>
          ))}
        </tbody>
      </Styled.StyledTable>
    </Styled.TableContainer>
  );
}
