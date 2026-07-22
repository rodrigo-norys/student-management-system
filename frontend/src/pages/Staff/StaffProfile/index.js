import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserTie, FaEdit } from 'react-icons/fa';

import Loading from 'components/Loading';

import * as actions from 'store/modules/staff/actions';

import {
  TAB_KEYS,
  PROFILE_TABS,
  DEFAULT_TAB,
  ASSIGNMENT_MANAGER_LEVELS,
} from './constants';

import GeneralTab from './components/GeneralTab';
import AddressTab from './components/AddressTab';
import UnitsTab from './components/UnitsTab';
import MedicalTab from './components/MedicalTab';

import * as Styled from './styled';
import { PageContainer } from 'components/ui';

export default function StaffProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.staff.isLoading);
  const staffMember = useSelector((state) =>
    state.staff.staff.find((member) => String(member.id) === String(id)),
  );
  const { user = {} } = useSelector((state) => state.auth || {});

  const canManageAssignments = ASSIGNMENT_MANAGER_LEVELS.includes(
    user?.access_level_id,
  );

  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);

  useEffect(() => {
    if (!staffMember || String(staffMember.id) !== String(id)) {
      dispatch(actions.getStaffRequest(id));
    }
  }, [id, dispatch, staffMember]);

  if (!staffMember && !isLoading) return null;
  if (!staffMember) return <Loading isLoading={true} />;

  const mainPhoto = `${import.meta.env.VITE_API_URL}/images/staff/${staffMember.avatar_url}`;

  return (
    <PageContainer>
      <Loading isLoading={isLoading} />
      <Styled.HeaderContent>
        <h1>Staff Profile</h1>
        <Styled.PrimaryButton as={Link} to={`/staff/${id}/edit`}>
          <FaEdit size={16} /> Edit Profile
        </Styled.PrimaryButton>
      </Styled.HeaderContent>

      <Styled.FormGrid>
        <Styled.Sidebar>
          <Styled.Section>
            <Styled.ProfilePicture>
              {staffMember.avatar_url ? (
                <img src={mainPhoto} alt={staffMember.full_name} />
              ) : (
                <FaUserTie size={150} color="#334155" />
              )}
            </Styled.ProfilePicture>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '5px' }}>
                {staffMember.full_name}
              </h2>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                {staffMember.job_title}
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
              <GeneralTab staff={staffMember} />
            )}
            {activeTab === TAB_KEYS.ADDRESS && (
              <AddressTab staff={staffMember} />
            )}
            {activeTab === TAB_KEYS.UNITS && (
              <UnitsTab staff={staffMember} canManage={canManageAssignments} />
            )}
            {activeTab === TAB_KEYS.MEDICAL && (
              <MedicalTab staff={staffMember} />
            )}
          </Styled.Section>
        </Styled.MainContent>
      </Styled.FormGrid>
    </PageContainer>
  );
}
