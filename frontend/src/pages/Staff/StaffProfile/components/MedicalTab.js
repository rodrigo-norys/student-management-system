import { FaNotesMedical } from 'react-icons/fa';
import * as Styled from '../styled';

export default function MedicalTab({ staff }) {
  return (
    <>
      <Styled.MedicalNotesWrapper>
        <Styled.Label>
          <FaNotesMedical /> Medical Notes & Observations
        </Styled.Label>
        <div style={{ marginTop: '10px' }}>
          {staff.medical_notes ? (
            staff.medical_notes
          ) : (
            <span className="no-data">
              No medical records available for this staff member.
            </span>
          )}
        </div>
      </Styled.MedicalNotesWrapper>
    </>
  );
}
