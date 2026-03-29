import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserTie } from 'react-icons/fa';

import * as actions from '../../store/modules/staff/actions.js';
import Loading from '../../components/Loading';

import GeneralTab from './components/GeneralTab.js';
import AddressTab from './components/AddressTab.js';
import MedicalTab from './components/MedicalTab.js';

import { Container } from '../../styles/GlobalStyles';
import { ProfileHeader, TabNav, TabContent } from './styled';

export default function StaffProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const isLoading = useSelector(state => state.staff.isLoading);
  const staffMember = useSelector(state =>
    state.staff.staff.find(member => String(member.id) === String(id))
  );

  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (!staffMember || String(staffMember.id) !== String(id)) {
      dispatch(actions.getStaffRequest(id));
    }
  }, [id, dispatch, staffMember]);

  if (!staffMember) {
    return (
      <Container>
        <Loading isLoading={true} />
      </Container>
    );
  }

  const mainPhoto = `${process.env.REACT_APP_API_URL}/images/staff/${staffMember.avatar_url}`;

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <ProfileHeader>
        <div className="avatar-placeholder">
          {staffMember.avatar_url ? (
            <img src={mainPhoto} alt={staffMember.full_name} />
          ) : (
            <FaUserTie size={150} color="#ddd" />
          )}
        </div>
        <div className="info">
          <h1>{staffMember.full_name}</h1>
          <p>{staffMember.job_title}</p>
        </div>

        <div className="actions">
          <Link to={`/staff/${id}/edit`} className="edit-button">
            Update Staff
          </Link>
        </div>
      </ProfileHeader>

      <TabNav>
        <button
          type="button"
          className={activeTab === 'general' ? 'active' : ''}
          onClick={() => setActiveTab('general')}
        >
          General Data
        </button>
        <button
          type="button"
          className={activeTab === 'address' ? 'active' : ''}
          onClick={() => setActiveTab('address')}
        >
          Addresses
        </button>
        <button
          type="button"
          className={activeTab === 'medical' ? 'active' : ''}
          onClick={() => setActiveTab('medical')}
        >
          Medical Record
        </button>
      </TabNav>

      <TabContent>
        {activeTab === 'general' && <GeneralTab staff={staffMember} />}
        {activeTab === 'address' && <AddressTab staff={staffMember} />}
        {activeTab === 'medical' && <MedicalTab staff={staffMember} />}
      </TabContent>
    </Container>
  );
}
