import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { get } from 'lodash';
import { FaUserCircle, FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';

import { Container } from '../../styles/GlobalStyles';
import { StudentContainer, ProfilePicture, HeaderToolbar } from './styled';

import * as actions from '../../store/modules/student/actions';
import Loading from '../../components/Loading';
import { useDispatch, useSelector } from 'react-redux';

export default function Students() {
  const dispatch = useDispatch();
  const students = useSelector(state => state.student.students);
  const isLoading = useSelector(state => state.student.isLoading);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    dispatch(actions.getStudentsRequest());
  }, [dispatch]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleDeleteAsk = e => {
    e.preventDefault();
    const exclamation = e.currentTarget.nextSibling;
    exclamation.setAttribute('display', 'block');
    e.currentTarget.remove();
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    dispatch(actions.deleteStudentRequest(id));
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <HeaderToolbar>
        <h1>Students</h1>
        <Link to={`/student/create`}>
          <button type='button'>Add</button>
        </Link>
      </HeaderToolbar>
      <StudentContainer>
        {students.map(student => (
          <div key={String(student.id)}>
            <ProfilePicture>
              {
                get(student, 'Photos[0].url', false) ?
                  (<img src={student.Photos[0].url} alt="" />) :
                  (<FaUserCircle size={36} />)
              }
            </ProfilePicture>
            <span>{student.name}</span>
            <span>{student.email}</span>
            <Link to={`/student/${student.id}/edit`}>
              <FaEdit size={16} />
            </Link>

            <Link
              to={`/student/${student.id}/delete`}
              onClick={handleDeleteAsk}>
              <FaWindowClose size={16} />
            </Link>

            <FaExclamation
              size={16}
              display="none"
              cursor="pointer"
              onClick={(e) => handleDelete(e, student.id)}
            />
          </div>
        ))}
      </StudentContainer>
    </Container>
  );
}
