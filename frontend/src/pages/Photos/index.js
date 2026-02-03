import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaCamera, FaCloudUploadAlt } from 'react-icons/fa';

import * as actions from '../../store/modules/photo/actions.js';
import * as studentAction from '../../store/modules/student/actions.js';
import Loading from '../../components/Loading';

import { Container, Title, Form, Overlay, Placeholder } from './styled';

export default function Photos() {
  const [photo, setPhoto] = useState('');
  const { id } = useParams();

  const dispatch = useDispatch();

  const student = useSelector(state =>
    state.student.students.find(student => String(student.id) === String(id))
  );
  const isLoading = useSelector(state => state.student.isLoading);

  const mainPhoto = student?.Photos?.[0]?.url;
  const preview = photo || mainPhoto;

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

    dispatch(actions.updatePhotoRequest({ id, formData }));
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Title>Profile Picture</Title>

      <Form>
        <label htmlFor="photo">
          {preview ? (
            <>
              <img src={preview} alt="Profile" />
              <Overlay>
                 <FaCamera size={30} />
                 <span>Change</span>
              </Overlay>
            </>
          ) : (
            <Placeholder>
               <FaCloudUploadAlt size={50} />
               <span>Select Photo</span>
            </Placeholder>
          )}

          <input type="file" id="photo" onChange={handleChange} />
        </label>
      </Form>
    </Container>
  );
}
