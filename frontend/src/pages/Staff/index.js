import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { FaUserShield, FaEdit, FaWindowClose, FaExclamation, FaCamera, FaTh, FaList, FaSearch } from 'react-icons/fa';

import {
  Container, HeaderToolbar, ControlsArea, SearchInput, ViewToggle, ToggleButton,
  NoResultsMessage, StaffContainer, StaffCard, ProfilePicture, PictureOverlay,
  StaffName, StaffEmail, StaffDetails, DetailRow, ActionRow, NewStaffLink, ProfileLink
} from './styled.js';

import * as actions from '../../store/modules/staff/actions.js';
import Loading from '../../components/Loading';

export default function Staff() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { staff = [], isLoading = false } = useSelector(state => state.staff || {});
  const { isLoggedIn = false } = useSelector(state => state.auth || {});

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  const [animationParent] = useAutoAnimate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      dispatch(actions.getStaffRequest());
    }
  }, [isLoggedIn, navigate, dispatch]);

  const handleDeleteAsk = (e, id) => {
    e.preventDefault();
    setConfirmDeleteId(id);
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    dispatch(actions.deleteStaffRequest({ id }));
    setConfirmDeleteId(null);
  };

  const filteredStaff = staff.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    const fullNameLower = (member.full_name || '').toLowerCase();
    const emailLower = (member.email || '').toLowerCase();
    const jobTitleLower = (member.job_title || '').toLowerCase();

    return (
      fullNameLower.includes(searchLower) ||
      emailLower.includes(searchLower) ||
      jobTitleLower.includes(searchLower)
    );
  });

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <HeaderToolbar>
        <h1>Staff Members</h1>
        <NewStaffLink to="/staff/create">Add Member</NewStaffLink>
      </HeaderToolbar>

      <ControlsArea>
        <SearchInput>
          <FaSearch color="#999" />
          <input
            type="text"
            placeholder="Search by name, email or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>

        <ViewToggle>
          <ToggleButton
            $active={isGridView}
            onClick={() => setIsGridView(true)}
            title="Grid View"
          >
            <FaTh size={18} />
          </ToggleButton>
          <ToggleButton
            $active={!isGridView}
            onClick={() => setIsGridView(false)}
            title="List View"
          >
            <FaList size={18} />
          </ToggleButton>
        </ViewToggle>
      </ControlsArea>

      <StaffContainer ref={animationParent} $isGrid={isGridView}>
        {filteredStaff.length > 0 ? (
          filteredStaff.map(member => {
            const hasAvatar = !!member.avatar_url;
            const mainPhoto = hasAvatar ? `${process.env.REACT_APP_API_URL}/images/staff/${member.avatar_url}` : null;

            return (
              <StaffCard key={String(member.id)} $isGrid={isGridView}>

                <ProfilePicture>
                  <ProfileLink to={`/avatar/staff/${member.id}`}>
                    {hasAvatar
                      ? <img src={mainPhoto} alt={member.full_name} />
                      : <FaUserShield size={85} />}
                    <PictureOverlay>
                      <FaCamera size={24} color="#fff" />
                      <span>Edit</span>
                    </PictureOverlay>
                  </ProfileLink>
                </ProfilePicture>

                <div className="card-content">
                  <StaffName>{member.full_name}</StaffName>
                  <StaffEmail>{member.email}</StaffEmail>

                  <StaffDetails $isGrid={isGridView}>
                    <DetailRow $isGrid={isGridView}>
                      <span>Job Title</span>
                      <span>{member.job_title}</span>
                    </DetailRow>
                    <DetailRow $isGrid={isGridView}>
                      <span>Status</span>
                      <span>{member.status}</span>
                    </DetailRow>
                  </StaffDetails>
                </div>

                <ActionRow $isGrid={isGridView}>
                  <ProfileLink to={`/staff/${member.id}/edit`}>
                    <FaEdit size={18} title="Edit" />
                  </ProfileLink>

                  {confirmDeleteId === member.id ? (
                    <FaExclamation
                      size={18} cursor="pointer"
                      onClick={(e) => handleDelete(e, member.id)}
                      color="#c30e0e"
                      title="Confirm Delete"
                    />
                  ) : (
                    <ProfileLink
                      className="delete-btn"
                      to={`/staff/${member.id}/delete`}
                      onClick={(e) => handleDeleteAsk(e, member.id)}>
                      <FaWindowClose size={18} title="Delete" />
                    </ProfileLink>
                  )}

                  <ProfileLink to={`/staff/${member.id}/`}>
                    <FaUserShield size={18} color="#3f51b5" title="Profile" />
                  </ProfileLink>
                </ActionRow>
              </StaffCard>
            );
          })
        ) : (
          <NoResultsMessage>
            No staff members found matching "{searchTerm}".
          </NoResultsMessage>
        )}
      </StaffContainer>
    </Container>
  );
}
