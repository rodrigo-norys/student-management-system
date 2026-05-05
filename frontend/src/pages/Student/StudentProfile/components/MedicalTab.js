import { FaTint, FaNotesMedical } from 'react-icons/fa';
import * as Styled from '../styled';

export default function MedicalTab({ student }) {
  return (
    <>
      <Styled.InfoGroup>
        <div style={{ maxWidth: '200px' }}>
          <Styled.Label>
            <FaTint /> Blood Type
          </Styled.Label>
          <Styled.Value>{student.blood_type || 'N/A'}</Styled.Value>
        </div>
      </Styled.InfoGroup>

      <div>
        <Styled.Label>
          <FaNotesMedical /> Medical Notes & Observations
        </Styled.Label>
        <Styled.MedicalNotesWrapper>
          {student.medical_notes ? (
            student.medical_notes
          ) : (
            <span className="no-data">
              No medical records available for this student.
            </span>
          )}
        </Styled.MedicalNotesWrapper>
      </div>
    </>
  );
}
