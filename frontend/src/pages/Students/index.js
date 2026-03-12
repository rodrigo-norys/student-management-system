import { useEffect } from 'react';
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

  const students = useSelector(state => state.student.students);
  const isLoading = useSelector(state => state.student.isLoading);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    !isLoggedIn
      ? navigate('/login')
      : dispatch(actions.getStudentsRequest());
  }, [isLoggedIn, navigate, dispatch]);


  function handleDeleteAsk(e) {
    e.preventDefault();
    const exclamation = e.currentTarget.nextSibling;
    exclamation.setAttribute('display', 'block');
    e.currentTarget.remove();
  };

  function handleDelete(e, id) {
    e.preventDefault();
    dispatch(actions.deleteStudentRequest(id));
  }

  function StudentPhoto({ student }) {
    const mainPhoto = `${process.env.REACT_APP_API_URL}/images/${student.avatar_url}`
    return (
      <ProfilePicture>
        <Link to={`/avatar/${student.id}`}>
          {mainPhoto ? <img src={mainPhoto} alt="" /> : <FaUserCircle size={85} />}
          <PictureOverlay>
            <FaCamera size={24} color="#fff" />
            <span>Edit</span>
          </PictureOverlay>
        </Link>
      </ProfilePicture>
    );
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <HeaderToolbar>
        <h1>Students</h1>
        <NewStudentLink to="/student/create">
          Add Student
        </NewStudentLink>
      </HeaderToolbar>

      <StudentContainer>
        {students.map(student => (
          <StudentCard key={String(student.id)}>

            <StudentPhoto student={student} />

            <StudentName>{student.name} {student.last_name}</StudentName>
            <StudentEmail>{student.email}</StudentEmail>

            <StudentDetails>
              <DetailRow>
                <span>Registration Number</span>
                <span>{student.registration_number}</span>
              </DetailRow>

              <DetailRow>
                <span>CPF</span>
                <span>{cpfValidator.format(student.cpf)}</span>
              </DetailRow>

              <DetailRow>
                <span>Blood Type</span>
                <span>{student.blood_type}</span>
              </DetailRow>
            </StudentDetails>

            <ActionRow>
              <Link to={`/student/${student.id}/edit`}>
                <FaEdit size={18} title="Edit" />
              </Link>

              <Link className="delete-btn" to={`/student/${student.id}/delete`} onClick={handleDeleteAsk}>
                <FaWindowClose size={18} title="Delete" />
              </Link>

              <FaExclamation
                size={18}
                display="none"
                cursor="pointer"
                onClick={(e) => handleDelete(e, student.id)}
                color="#c30e0e"
                title="Confirm Delete"
              />

              <Link to={`/student/${student.id}/`}>
                <FaUserCircle size={18} color="#3f51b5" title="Perfil" />
              </Link>

            </ActionRow>

          </StudentCard>
        ))}
      </StudentContainer>
    </Container>
  );
}
