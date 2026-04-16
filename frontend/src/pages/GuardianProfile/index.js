import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

import { FaUserCircle } from 'react-icons/fa';

import Loading from '../../components/Loading';
import GeneralTab from './components/GeneralTab.js';
import AddressTab from './components/AddressTab.js';
import DependentsTab from './components/DependentsTab';

import * as actions from '../../store/modules/guardian/actions.js';

import { Container } from '../../styles/GlobalStyles';
import { ProfileHeader, TabNav, TabContent } from './styled';

export default function GuardianProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.guardian.isLoading);
  const guardian = useSelector(state =>
    state.guardian.guardians.find(guardian => String(guardian.id) === String(id)));

  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (!guardian || String(guardian.id) !== String(id)) {
      dispatch(actions.getGuardiansRequest(id));
    }
  }, [id, dispatch, guardian]);

  if (!guardian) {
    return (
      <Container>
        <Loading isLoading={true} />
      </Container>
    );
  }

  const mainPhoto = `${process.env.REACT_APP_API_URL}/images/guardians/${guardian.avatar_url}`;

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <ProfileHeader>
        <div className="avatar-placeholder">
          {guardian.avatar_url ? (
            <img src={mainPhoto} alt={guardian.name} />
          ) : (
            <FaUserCircle size={80} color="#9aa0ac" />
          )}
        </div>
        <div className="info">
          <h1>{guardian.name} {guardian.last_name}</h1>
          <p>CPF: {guardian.cpf}</p>
        </div>
        <div className="actions">
          <Link to={`/guardian/${id}/edit`} className="edit-button">
            Update Guardian
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
          className={activeTab === 'dependents' ? 'active' : ''}
          onClick={() => setActiveTab('dependents')}
        >
          Students
        </button>
      </TabNav>

      <TabContent>
        {activeTab === 'general' && <GeneralTab />}
        {activeTab === 'address' && <AddressTab guardian={guardian} />}
        {activeTab === 'dependents' && <DependentsTab guardian={guardian} />}
      </TabContent>
    </Container>
  );
}
