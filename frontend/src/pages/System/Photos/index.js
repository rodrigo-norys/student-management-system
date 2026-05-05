import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaCamera, FaCloudUploadAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

import Loading from 'components/Loading';

import * as photoActions from 'store/modules/photo/actions';
import * as studentActions from 'store/modules/student/actions';
import * as staffActions from 'store/modules/staff/actions';
import * as guardianActions from 'store/modules/guardian/actions';

import * as Styled from './styled';

export default function Photos() {
  const { id, userType } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading = false } = useSelector((state) => state.photo || {});

  const profileData = useSelector((state) => {
    const contextMap = {
      students: state.student?.students,
      staff: state.staff?.staffList,
      guardians: state.guardian?.guardians,
    };
    return contextMap[userType]?.find((item) => String(item.id) === String(id));
  });

  const [tempPhotoUrl, setTempPhotoUrl] = useState('');

  const currentAvatarUrl = useMemo(() => {
    if (!profileData?.avatar_url) return '';
    const endpoint = `${process.env.REACT_APP_API_URL}/images/${userType}/`;
    
    return `${endpoint}${profileData.avatar_url}`;
  }, [profileData, userType]);

  const preview = tempPhotoUrl || currentAvatarUrl;

  useEffect(() => {
    const validContexts = ['students', 'staff', 'guardians'];

    if (!validContexts.includes(userType)) {
      toast.error('Invalid URL context');
      navigate('/');
      return;
    }

    if (!profileData && id) {
      const hydrationMap = {
        students: studentActions.getStudentsRequest,
        staff: staffActions.getStaffRequest,
        guardians: guardianActions.getGuardiansRequest,
      };

      const action = hydrationMap[userType];
      if (action) dispatch(action(id));
    }
  }, [id, userType, profileData, dispatch, navigate]);

  useEffect(() => {
    return () => {
      if (tempPhotoUrl) URL.revokeObjectURL(tempPhotoUrl);
    };
  }, [tempPhotoUrl]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid image format');
      return;
    }

    const newPhotoURL = URL.createObjectURL(file);
    setTempPhotoUrl(newPhotoURL);

    const formData = new FormData();
    const payloadMap = {
      students: 'student_id',
      staff: 'staff_id',
      guardians: 'guardian_id',
    };

    formData.append(payloadMap[userType] || 'user_id', id);
    formData.append('avatar', file);

    dispatch(photoActions.updatePhotoRequest({ id, userType, formData }));
  };

  return (
    <Styled.Container>
      <Loading isLoading={isLoading} />
      <Styled.Section>
        <Styled.Title>Profile Picture</Styled.Title>
        <Styled.Form>
          <label htmlFor="photo">
            {preview ? (
              <>
                <img src={preview} alt="Profile Preview" />
                <Styled.Overlay>
                  <FaCamera size={28} />
                  <span>Update Photo</span>
                </Styled.Overlay>
              </>
            ) : (
              <Styled.Placeholder>
                <FaCloudUploadAlt size={48} />
                <span>Select Image</span>
              </Styled.Placeholder>
            )}
            <input
              type="file"
              id="photo"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleChange}
            />
          </label>
        </Styled.Form>
      </Styled.Section>
    </Styled.Container>
  );
}
