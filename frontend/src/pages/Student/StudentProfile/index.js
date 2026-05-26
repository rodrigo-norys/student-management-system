import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { FaUserCircle, FaEdit } from 'react-icons/fa';

import Loading from 'components/Loading';

import * as actions from 'store/modules/student/actions';

import { getAvatarUrl } from 'utils/imageHelpers';
import { PROFILE_TABS, DEFAULT_TAB, TAB_KEYS } from './constants';

import GeneralTab from './components/GeneralTab';
import AddressTab from './components/AddressTab';
import MedicalTab from './components/MedicalTab';

import * as Styled from './styled.js';
import { PageContainer } from 'components/ui';

export default function StudentProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.student.isLoading);
  const student = useSelector((state) =>
    state.student.students.find((s) => String(s.id) === String(id)),
  );
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);

  useEffect(() => {
    if (!student || String(student.id) !== String(id)) {
      dispatch(actions.getStudentsRequest(id));
    }
  }, [id, dispatch, student]);

  if (!student && !isLoading) return null;
  if (!student) return <Loading isLoading={true} />;

  const mainPhoto = getAvatarUrl(student.avatar_url);

  return (
    <PageContainer>
      <Loading isLoading={isLoading} />

      <Styled.HeaderContent>
        <h1>Student Profile</h1>
        <Styled.PrimaryButton as={Link} to={`/student/${id}/edit`}>
          <FaEdit size={16} /> To form
        </Styled.PrimaryButton>
      </Styled.HeaderContent>

      <Styled.FormGrid>
        <Styled.Sidebar>
          <Styled.Section>

            <Styled.ProfilePicture>
              {student.avatar_url ? (
                <img src={mainPhoto} alt={student.name} />
              ) : (
                <FaUserCircle size={150} color="#334155" />
              )}
            </Styled.ProfilePicture>

            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '5px' }}>
                {student.name} {student.last_name}
              </h2>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                RN: {student.registration_number}
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
            {activeTab === TAB_KEYS.GENERAL && <GeneralTab student={student} />}
            {activeTab === TAB_KEYS.ADDRESS && <AddressTab student={student} />}
            {activeTab === TAB_KEYS.MEDICAL && <MedicalTab student={student} />}
          </Styled.Section>
        </Styled.MainContent>
      </Styled.FormGrid>
    </PageContainer>
  );
}
