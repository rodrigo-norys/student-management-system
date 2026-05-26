import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { FaUserCircle, FaEdit } from 'react-icons/fa';

import Loading from 'components/Loading';

import * as actions from 'store/modules/guardian/actions';

import { getGuardianImageUrl } from '../constants';
import { PROFILE_TABS, DEFAULT_TAB, TAB_KEYS } from './constants';

import GeneralTab from './components/GeneralTab';
import AddressTab from './components/AddressTab';
import DependentsTab from './components/DependentsTab';

import * as Styled from './styled';
import { PageContainer } from 'components/ui';

export default function GuardianProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.guardian.isLoading);
  const guardian = useSelector((state) =>
    state.guardian.guardians.find((g) => String(g.id) === String(id)),
  );

  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);

  useEffect(() => {
    if (!guardian || String(guardian.id) !== String(id)) {
      dispatch(actions.getGuardiansRequest(id));
    }
  }, [id, dispatch, guardian]);

  if (!guardian && !isLoading) return null;
  if (!guardian) return <Loading isLoading={true} />;

  const mainPhoto = getGuardianImageUrl(guardian.avatar_url);

  return (
    <PageContainer>
      <Loading isLoading={isLoading} />
      <Styled.HeaderContent>
        <h1>Guardian Profile</h1>
        <Styled.PrimaryButton as={Link} to={`/guardian/${id}/edit`}>
          <FaEdit size={16} /> Edit Profile
        </Styled.PrimaryButton>
      </Styled.HeaderContent>

      <Styled.FormGrid>
        <Styled.Sidebar>
          <Styled.Section>
            <Styled.ProfilePicture>
              {guardian.avatar_url ? (
                <img src={mainPhoto} alt={guardian.name} />
              ) : (
                <FaUserCircle size={150} color="#334155" />
              )}
            </Styled.ProfilePicture>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '5px' }}>
                {guardian.name} {guardian.last_name}
              </h2>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                Guardian ID: {guardian.id}
              </span>
            </div>
          </Styled.Section>
        </Styled.Sidebar>

        <Styled.MainContent>
          <Styled.Section>

            <Styled.TabNav>
              {PROFILE_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={activeTab === tab.key ? 'active' : ''}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </Styled.TabNav>

            {activeTab === TAB_KEYS.GENERAL && (
              <GeneralTab guardian={guardian} />
            )}
            {activeTab === TAB_KEYS.ADDRESS && (
              <AddressTab guardian={guardian} />
            )}
            {activeTab === TAB_KEYS.DEPENDENTS && (
              <DependentsTab guardian={guardian} />
            )}

          </Styled.Section>
        </Styled.MainContent>
      </Styled.FormGrid>
    </PageContainer>
  );
}
