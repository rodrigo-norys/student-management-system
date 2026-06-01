import { Link } from 'react-router-dom';
import { FaUserCircle, FaEdit } from 'react-icons/fa';

import { BLOOD_TYPES } from 'constants/medical';

import * as Styled from '../styled';

export default function IdentitySidebar({
  form,
  errors,
  onChange,
  mainPhoto,
  studentId,
}) {
  return (
    <Styled.Sidebar>
      <Styled.Section>
        <Styled.SectionTitle>Identity</Styled.SectionTitle>
        <Styled.ProfilePicture>
          {mainPhoto ? (
            <img src={mainPhoto} alt={form.name} />
          ) : (
            <FaUserCircle size={150} color="#323245" />
          )}
          <Link to={studentId ? `/avatar/students/${studentId}` : '#'}>
            <FaEdit size={20} />
          </Link>
        </Styled.ProfilePicture>
        <Styled.InputGroup>
          <Styled.ValidatedSelect
            label="Blood Type"
            name="blood_type"
            value={form.blood_type}
            onChange={onChange}
            array={BLOOD_TYPES}
            error={errors.blood_type}
          />
        </Styled.InputGroup>
        <Styled.MedicalNotesWrapper>
          <Styled.ValidatedTextarea
            label="Medical Notes"
            name="medical_notes"
            value={form.medical_notes}
            onChange={onChange}
            maxLength="255"
            error={errors.medical_notes}
          />
        </Styled.MedicalNotesWrapper>
      </Styled.Section>
    </Styled.Sidebar>
  );
}
