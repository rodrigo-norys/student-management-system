import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/modules/student/actions.js';
import Loading from '../../components/Loading';
import { FaUserCircle } from 'react-icons/fa';

import GeneralTab from './components/GeneralTab.js';
import AddressTab from './components/AddressTab.js';
import MedicalTab from './components/MedicalTab';

import { Container } from '../../styles/GlobalStyles';
import { ProfileHeader, TabNav, TabContent } from './styled';

export default function StudentProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const isLoading = useSelector(state => state.student.isLoading);
  const student = useSelector(state =>
    state.student.students.find(student =>
      String(student.id) === String(id)));

  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (!student || String(student.id) !== String(id)) {
      dispatch(actions.getStudentsRequest(id));
    }
  }, [id, dispatch, student]);

  if (!student) {
    return (
      <Container>
        <Loading isLoading={true} />
      </Container>
    );
  }

  const mainPhoto = `${process.env.REACT_APP_API_URL}/images/${student.avatar_url}`;

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <ProfileHeader>
        <div className="avatar-placeholder">
          {student.avatar_url ? (
            <img src={mainPhoto} alt={student.name} />
          ) : (
            <FaUserCircle size={150} color="#ddd" />
          )}
        </div>
        <div className="info">
          <h1>{student.name} {student.last_name}</h1>
          <p>RN: {student.registration_number}</p>
        </div>

        <div className="actions">
          <Link to={`/student/${id}/edit`} className="edit-button">
            Update Student
          </Link>
        </div>
      </ProfileHeader>

      <TabNav>
        <button
          type="button"
          className={activeTab === 'general' ? 'active' : ''}
          onClick={() => setActiveTab('general')}
        > General Data
        </button>
        <button
          type="button"
          className={activeTab === 'address' ? 'active' : ''}
          onClick={() => setActiveTab('address')}
        > Addresses
        </button>
        <button
          type="button"
          className={activeTab === 'medical' ? 'active' : ''}
          onClick={() => setActiveTab('medical')}
        > Medical Record
        </button>
      </TabNav>

      <TabContent>
        {activeTab === 'general' && <GeneralTab student={student} />}
        {activeTab === 'address' && <AddressTab student={student} />}
        {activeTab === 'medical' && <MedicalTab student={student} />}
      </TabContent>
    </Container>
  );
}

