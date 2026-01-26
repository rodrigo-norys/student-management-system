import React, { useState, useEffect } from 'react'; // Adicionei React
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { get } from 'lodash';
import * as actions from '../../store/modules/photo/actions.js';
import * as studentAction from '../../store/modules/student/actions.js';
import Loading from '../../components/Loading';
import { Container } from '../../styles/GlobalStyles';
import { Title, Form } from './styled';

export default function Photos() {
  const [photo, setPhoto] = useState('');
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const student = useSelector(state =>
    state.student.students.find(student => String(student.id) === String(id))
  );
  const isLoading = useSelector(state => state.student.isLoading);
  const mainPhoto = student?.Photos?.[0]?.url || photo;

  useEffect(() => {
    if (!student) {
      dispatch(studentAction.getStudentsRequest());
    }
  }, [id, student, dispatch]);

  function handleChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const photoURL = URL.createObjectURL(file);
    setPhoto(photoURL);

    const formData = new FormData();
    formData.append('student_id', id);
    formData.append('photo', file);

    dispatch(actions.updatePhotoRequest({ id, formData, navigate}));
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Title> Profile Picture </Title>

      <Form>
        <label htmlFor="photo">
          {photo || mainPhoto ? (
            <img src={photo || mainPhoto} alt="Photo" />
          ) : (
            'Select'
          )}
          <input type="file" id="photo" onChange={handleChange} />
        </label>
      </Form>
    </Container>
  );
}
