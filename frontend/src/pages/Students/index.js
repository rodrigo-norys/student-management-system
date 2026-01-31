import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { get } from 'lodash';
import { FaUserCircle, FaEdit, FaWindowClose, FaExclamation, FaCamera } from 'react-icons/fa';

import {
  Container,
  HeaderToolbar,
  StudentContainer,
  StudentCard,
  ProfilePicture,
  PictureOverlay,
  StudentName,
  StudentEmail,
  ActionRow,
  NewStudentLink
} from './styled.js';

import * as actions from '../../store/modules/student/actions';
import Loading from '../../components/Loading';
import { useDispatch, useSelector } from 'react-redux';


export default function Students() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const students = useSelector(state => state.student.students);
  const isLoading = useSelector(state => state.student.isLoading);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    dispatch(actions.getStudentsRequest());
  }, [dispatch]);

  if (!isLoggedIn) {
    navigate('/login');
  }

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
    const photoUrl = get(student, 'Photos[0].url', false);
    return (
      <ProfilePicture>
        <Link to={`/photos/${student.id}`}>
        {photoUrl ? <img src={student.Photos[0].url} alt="" /> : <FaUserCircle size={85} />}
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

            <StudentName>{student.name}</StudentName>
            <StudentEmail>{student.email}</StudentEmail>

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
            </ActionRow>

          </StudentCard>
        ))}
      </StudentContainer>
    </Container>
  );
}
