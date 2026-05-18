import React from 'react';
import { FaUserCircle, FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';
import * as Styled from '../styled';

export default function ActiveUsersTable({
  dataList,
  currentPage,
  limit,
  confirmDeleteId,
  handleDeleteAsk,
  handleDelete
}) {
  return (
    <Styled.TableContainer>
      <Styled.StyledTable>
        <thead>
          <tr>
            <th>#</th>
            <th>Status</th>
            <th width="80">Avatar</th>
            <th>Info</th>
            <th>Access Level</th>
            <th width="120">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((user, index) => (
            <tr key={`active-user-${user.id}`}>
              <td>
                <strong>{(currentPage - 1) * limit + index + 1}</strong>
              </td>
              <Styled.StatusCell $status={user.is_active ? 'active' : 'inactive'}>
                <span>{user.is_active ? 'ACTIVE' : 'INACTIVE'}</span>
              </Styled.StatusCell>
              <td>
                <Styled.SmallProfilePic>
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.email} />
                  ) : (
                    <FaUserCircle size={28} />
                  )}
                </Styled.SmallProfilePic>
              </td>
              <td>
                <Styled.TableNameCol>
                  <strong>{user.email}</strong>
                  <span>User ID: {user.id}</span>
                </Styled.TableNameCol>
              </td>
              <td style={{ fontWeight: 700 }}>
                {user.access_level?.name || 'Not assigned'}
              </td>
              <td>
                <Styled.TableActions>
                  <Styled.EditButton type="button" title="Edit">
                    <FaEdit size={16} />
                  </Styled.EditButton>
                  {confirmDeleteId === user.id ? (
                    <Styled.DeleteButton
                      type="button"
                      onClick={(e) => handleDelete(e, user.id)}
                      $isConfirming
                    >
                      <FaExclamation size={16} />
                    </Styled.DeleteButton>
                  ) : (
                    <Styled.DeleteButton
                      type="button"
                      onClick={(e) => handleDeleteAsk(e, user.id)}
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
