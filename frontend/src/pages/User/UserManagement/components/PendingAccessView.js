import React from 'react';
import { FaUserCircle, FaUserCheck } from 'react-icons/fa';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import * as Styled from '../styled';
import { getAvatarUrl } from 'utils/imageHelpers';

export default function PendingAccessView({
  dataList,
  currentPage,
  limit,
  onValidateClick,
  viewMode = 'table',
}) {
  // GRID
  if (viewMode === 'grid') {
    return (
      <Styled.GridContainer>
        {dataList.map((target) => {
          const formattedCpf = cpfValidator.format(target.cpf) || target.cpf;

          return (
            <Styled.UserCard key={`pending-grid-${target.type}-${target.id}`}>
              <Styled.ProfilePicture>
                {target.avatar_url ? (
                  <img
                    src={getAvatarUrl(
                      `${
                        target.type === 'student'
                          ? 'students'
                          : target.type === 'staff'
                            ? 'staff'
                            : 'guardians'
                      }/${target.avatar_url}`,
                    )}
                    alt={target.displayName}
                  />
                ) : (
                  <FaUserCircle size={100} />
                )}
              </Styled.ProfilePicture>

              <Styled.UserMainTitle>{target.displayName}</Styled.UserMainTitle>
              <Styled.UserSubTitle>
                {target.email || 'No email provided'}
              </Styled.UserSubTitle>

              <Styled.UserDetails>
                <Styled.DetailRow>
                  <span>Role</span>
                  <span style={{ textTransform: 'uppercase' }}>
                    {target.type}
                  </span>
                </Styled.DetailRow>
                <Styled.DetailRow>
                  <span>CPF</span>
                  <span>{formattedCpf}</span>
                </Styled.DetailRow>
              </Styled.UserDetails>

              <Styled.ActionRow>
                <Styled.GrantButton
                  type="button"
                  title="Validate"
                  onClick={() => onValidateClick(target)}
                >
                  <FaUserCheck size={14} />
                  <span>Validate</span>
                </Styled.GrantButton>
              </Styled.ActionRow>
            </Styled.UserCard>
          );
        })}
      </Styled.GridContainer>
    );
  }

  // TABLE
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
                    {target.avatar_url ? (
                      <img
                        src={getAvatarUrl(
                          `${
                            target.type === 'student'
                              ? 'students'
                              : target.type === 'staff'
                                ? 'staff'
                                : 'guardians'
                          }/${target.avatar_url}`,
                        )}
                        alt={target.displayName}
                      />
                    ) : (
                      <FaUserCircle size={28} />
                    )}
                  </Styled.SmallProfilePic>
                </td>

                <td>
                  <Styled.TableNameCol>
                    <strong>{target.displayName}</strong>
                    <span>{target.email || 'No email provided'}</span>
                  </Styled.TableNameCol>
                </td>

                <Styled.RoleCell>{target.type || ''}</Styled.RoleCell>

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
