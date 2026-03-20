import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaCamera, FaCloudUploadAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

import * as actions from '../../store/modules/photo/actions.js';
import Loading from '../../components/Loading';

import { Container, Title, Form, Overlay, Placeholder } from './styled';

export default function Photos() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { isLoading = false } = useSelector(state => state.photo || {});

  const student = useSelector(state =>
    state.student?.students?.find(stud => String(stud.id) === String(id))
  );

  const [tempPhotoUrl, setTempPhotoUrl] = useState('');

  const baseURL = `${process.env.REACT_APP_API_URL}/images/`;
  const currentAvatarUrl = student?.avatar_url ? `${baseURL}${student.avatar_url}` : '';
  const preview = tempPhotoUrl || currentAvatarUrl;

  useEffect(() => {
    return () => {
      if (tempPhotoUrl) URL.revokeObjectURL(tempPhotoUrl);
    };
  }, [tempPhotoUrl]);

  const handleChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid format. Please select an image.');
      return;
    }

    const newPhotoURL = URL.createObjectURL(file);
    setTempPhotoUrl(newPhotoURL);

    const formData = new FormData();
    formData.append('student_id', id);
    formData.append('avatar', file);

    dispatch(actions.updatePhotoRequest({ id, formData }));
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Title>Profile Picture</Title>

      <Form>
        <label htmlFor="photo">
          {preview ? (
            <>
              <img src={preview} alt={`Profile of ${student?.nome || 'student'}`} />
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

          <input
            type="file"
            id="photo"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleChange}
          />
        </label>
      </Form>
    </Container>
  );
}
