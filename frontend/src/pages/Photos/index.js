import { useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as actions from '../../store/modules/photo/actions.js';
import Loading from '../../components/Loading';
import { Container } from '../../styles/GlobalStyles';
import { Title, Form } from './styled';
import { useDispatch } from 'react-redux';

export default function Photos() {
  const [photo, setPhoto] = useState('');
  const dispatch = useDispatch();
  const { id } = useParams();

  function handleChange(e) {
    const photo = e.target.files[0];
    const photoURL = URL.createObjectURL(photo);

    const formData = new FormData();
    formData.append('student_id', id);
    formData.append('photo', photo);

    dispatch(actions.updatePhotoRequest({ formData, id }))
  }
  return (
    <Container>
      {/* <Loading isLoading={isLoading} /> */}

      <Title> Profile Picture </Title>

      <Form>
        <label htmlFor="photo">
          <input type="file" id="photo" onChange={handleChange} />
        </label>
      </Form>
    </Container>
  );
}

Photos.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
