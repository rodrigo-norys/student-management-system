import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserCircle, FaEdit, FaWindowClose, FaExclamation, FaCamera } from 'react-icons/fa';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import {
  Container, HeaderToolbar, StudentContainer, StudentCard, ProfilePicture, PictureOverlay,
  StudentName, StudentEmail, StudentDetails, DetailRow, ActionRow, NewStudentLink
} from './styled.js';

import * as actions from '../../store/modules/student/actions';
import Loading from '../../components/Loading';

export default function Students() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { students = [], isLoading = false } = useSelector(state => state.student || {});
  const { isLoggedIn = false } = useSelector(state => state.auth || {});

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <HeaderToolbar>
        <h1>Students</h1>
        <NewStudentLink to="/student/create">Add Student</NewStudentLink>
      </HeaderToolbar>

      <StudentContainer>
        {students.map(student => {
          const hasAvatar = !!student.avatar_url;
          const mainPhoto = hasAvatar ? `${process.env.REACT_APP_API_URL}/images/${student.avatar_url}` : null;

          return (
            <StudentCard key={String(student.id)}>

              <ProfilePicture>
                <Link to={`/avatar/${student.id}`}>
                  {hasAvatar ? <img src={mainPhoto} alt={student.name} /> : <FaUserCircle size={85} />}
                  <PictureOverlay>
                    <FaCamera size={24} color="#fff" />
                    <span>Edit</span>
                  </PictureOverlay>
                </Link>
              </ProfilePicture>

              <StudentName>{student.name} {student.last_name}</StudentName>
              <StudentEmail>{student.email}</StudentEmail>

              <StudentDetails>
                <DetailRow>
                  <span>Registration</span>
                  <span>{student.registration_number}</span>
                </DetailRow>

                <DetailRow>
                  <span>CPF</span>
                  <span>{cpfValidator.format(student.cpf)}</span>
                </DetailRow>

                <DetailRow>
                  <span>Blood Type</span>
                  <span>{student.blood_type || 'N/A'}</span>
                </DetailRow>
              </StudentDetails>

              <ActionRow>
                <Link to={`/student/${student.id}/edit`}>
                  <FaEdit size={18} title="Edit" />
                </Link>

                {confirmDeleteId === student.id ? (
                  <FaExclamation
                    size={18}
                    cursor="pointer"
                    onClick={(e) => handleDelete(e, student.id)}
                    color="#c30e0e"
                    title="Confirm Delete"
                  />
                ) : (
                  <Link
                    className="delete-btn"
                    to={`/student/${student.id}/delete`}
                    onClick={(e) => handleDeleteAsk(e, student.id)}
                  >
                    <FaWindowClose size={18} title="Delete" />
                  </Link>
                )}

                <Link to={`/student/${student.id}/`}>
                  <FaUserCircle size={18} color="#3f51b5" title="Profile" />
                </Link>
              </ActionRow>
            </StudentCard>
          );
        })}
      </StudentContainer>
    </Container>
  );
}
