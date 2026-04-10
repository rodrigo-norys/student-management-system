import React from 'react';
import { FaHeartbeat, FaTint, FaNotesMedical } from 'react-icons/fa';
import { TabContent, MedicalHeader, InfoGroup, BloodField, NotesField, Label, Value } from '../styled';

export default function MedicalTab({ student }) {
  if (!student) return null;

  return (
    <TabContent>
      <MedicalHeader>
        <FaHeartbeat color="#e74c3c" /> Medical Record
      </MedicalHeader>

      <InfoGroup>
        <BloodField>
          <Label><FaTint color="#e74c3c" /> Blood Type</Label>
          <Value>{student.blood_type || 'Not specified'}</Value>
        </BloodField>

        <NotesField>
          <Label><FaNotesMedical /> Medical Notes / Allergies</Label>
          <Value className="long-text">
            {student.medical_notes ? (
              student.medical_notes
            ) : (
              <span className="no-data">No medical notes recorded.</span>
            )}
          </Value>
        </NotesField>
      </InfoGroup>
    </TabContent>
  );
}
