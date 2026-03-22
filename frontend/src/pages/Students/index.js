import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { FaUserCircle, FaEdit, FaWindowClose, FaExclamation, FaCamera, FaTh, FaList, FaSearch } from 'react-icons/fa';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import {
  Container, HeaderToolbar, ControlsArea, SearchInput, ViewToggle, ToggleButton,
  NoResultsMessage, StudentContainer, StudentCard, ProfilePicture, PictureOverlay,
  StudentName, StudentEmail, StudentDetails, DetailRow, ActionRow, NewStudentLink, ProfileLink
} from './styled.js';

import * as actions from '../../store/modules/student/actions';
import Loading from '../../components/Loading';

export default function Students() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { students = [], isLoading = false } = useSelector(state => state.student || {});
  const { isLoggedIn = false } = useSelector(state => state.auth || {});

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  const [animationParent] = useAutoAnimate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      dispatch(actions.getStudentsRequest());
    }
  }, [isLoggedIn, navigate, dispatch]);

  const handleDeleteAsk = (e, id) => {
    e.preventDefault();
    setConfirmDeleteId(id);
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    dispatch(actions.deleteStudentRequest(id));
    setConfirmDeleteId(null);
  };

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${student.name} ${student.last_name || ''}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      student.registration_number.includes(searchLower) ||
      student.cpf.includes(searchLower)
    );
  });

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <HeaderToolbar>
        <h1>Students</h1>
        <NewStudentLink to="/student/create">Add Student</NewStudentLink>
      </HeaderToolbar>

      <ControlsArea>
        <SearchInput>
          <FaSearch color="#999" />
          <input
            type="text"
            placeholder="Search by name, email or registration..."
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

      <StudentContainer ref={animationParent} $isGrid={isGridView}>
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => {
            const hasAvatar = !!student.avatar_url;
            const mainPhoto = hasAvatar ? `${process.env.REACT_APP_API_URL}/images/${student.avatar_url}` : null;

            return (
              <StudentCard key={String(student.id)} $isGrid={isGridView}>

                <ProfilePicture>
                  <ProfileLink to={`/avatar/${student.id}`}>
                    {hasAvatar
                      ? <img src={mainPhoto} alt={student.name} />
                      : <FaUserCircle size={85} />}
                    <PictureOverlay>
                      <FaCamera size={24} color="#fff" />
                      <span>Edit</span>
                    </PictureOverlay>
                  </ProfileLink>
                </ProfilePicture>

                <div className="card-content">
                  <StudentName>{student.name} {student.last_name}</StudentName>
                  <StudentEmail>{student.email}</StudentEmail>

                  <StudentDetails $isGrid={isGridView}>
                    <DetailRow $isGrid={isGridView}>
                      <span>Registration</span>
                      <span>{student.registration_number}</span>
                    </DetailRow>
                    <DetailRow $isGrid={isGridView}>
                      <span>CPF</span>
                      <span>{cpfValidator.format(student.cpf)}</span>
                    </DetailRow>
                    <DetailRow $isGrid={isGridView}>
                      <span>Blood Type</span>
                      <span>{student.blood_type || 'N/A'}</span>
                    </DetailRow>
                  </StudentDetails>
                </div>

                <ActionRow $isGrid={isGridView}>
                  <ProfileLink to={`/student/${student.id}/edit`}>
                    <FaEdit size={18} title="Edit" />
                  </ProfileLink>

                  {confirmDeleteId === student.id ? (
                    <FaExclamation
                      size={18} cursor="pointer"
                      onClick={(e) => handleDelete(e, student.id)}
                      color="#c30e0e"
                      title="Confirm Delete"
                    />
                  ) : (
                    <ProfileLink
                      className="delete-btn"
                      to={`/student/${student.id}/delete`}
                      onClick={(e) => handleDeleteAsk(e, student.id)}>
                      <FaWindowClose size={18} title="Delete" />
                    </ProfileLink>
                  )}

                  <ProfileLink to={`/student/${student.id}/`}>
                    <FaUserCircle size={18} color="#3f51b5" title="Profile" />
                  </ProfileLink>
                </ActionRow>
              </StudentCard>
            );
          })
        ) : (
          <NoResultsMessage>
            No students found matching "{searchTerm}".
          </NoResultsMessage>
        )}
      </StudentContainer>
    </Container>
  );
}
