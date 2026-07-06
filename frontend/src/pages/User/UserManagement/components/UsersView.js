import React from 'react';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import * as Styled from '../styled';
import { getAvatarUrl } from 'utils/imageHelpers';

export default function UsersView({
  dataList,
  currentPage,
  limit,
  onEditClick,
  viewMode = 'table',
}) {
  // GRID
  if (viewMode === 'grid') {
    return (
      <Styled.GridContainer>
        {dataList.map((user) => (
          <Styled.UserCard key={`user-grid-${user.id}`}>
            <Styled.UserStatus $status={user.status}>
              {user.status?.toUpperCase()}
            </Styled.UserStatus>

            <Styled.ProfilePicture>
              {user.avatar_url ? (
                <img src={getAvatarUrl(user.avatar_url)} alt={user.email} />
              ) : (
                <FaUserCircle size={100} />
              )}
            </Styled.ProfilePicture>

            <Styled.UserSubTitle>User ID: {user.id}</Styled.UserSubTitle>
            <Styled.UserMainTitle>{user.email}</Styled.UserMainTitle>

            <Styled.UserDetails>
              <Styled.DetailRow>
                <span>Access Level</span>
                <span style={{ textTransform: 'uppercase' }}>
                  {user.access_level?.name || 'Not assigned'}
                </span>
              </Styled.DetailRow>
            </Styled.UserDetails>

            <Styled.ActionRow>
              <Styled.EditActionButton
                type="button"
                title="Edit Profile"
                onClick={() => onEditClick(user)}
              >
                <FaEdit size={18} />
              </Styled.EditActionButton>
            </Styled.ActionRow>
          </Styled.UserCard>
        ))}
      </Styled.GridContainer>
    );
  }

  // TABELA
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
          {dataList.map((user, index) => {
            const displayIndex = (currentPage - 1) * limit + index + 1;

            return (
              <tr key={`user-table-${user.id}`}>
                <td>
                  <strong>{displayIndex}</strong>
                </td>

                <td>
                  <Styled.StatusCell $status={user.status}>
                    {user.status?.toUpperCase()}
                  </Styled.StatusCell>
                </td>

                <td>
                  <Styled.SmallProfilePic>
                    {user.avatar_url ? (
                      <img
                        src={getAvatarUrl(user.avatar_url)}
                        alt={user.email}
                      />
                    ) : (
                      <FaUserCircle size={28} />
                    )}
                  </Styled.SmallProfilePic>
                </td>

                <td>
                  <Styled.TableNameCol>
                    <span>User ID: {user.id}</span>
                    <strong>{user.email}</strong>
                  </Styled.TableNameCol>
                </td>

                <Styled.AccessLevelCell>
                  {user.access_level?.name || 'Not assigned'}
                </Styled.AccessLevelCell>

                <td>
                  <Styled.TableActions>
                    <Styled.EditButton
                      type="button"
                      title="Edit Profile"
                      onClick={() => onEditClick(user)}
                    >
                      <FaEdit size={16} />
                    </Styled.EditButton>
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
