import React from 'react';
import { FaHeartbeat, FaNotesMedical } from 'react-icons/fa';
import { TabContent, MedicalHeader, InfoGroup, NotesField, Label, Value } from '../styled';

export default function MedicalTab({ staff }) {
  if (!staff) return null;

  return (
    <TabContent>
      <MedicalHeader>
        <FaHeartbeat color="#e74c3c" /> Medical Record
      </MedicalHeader>

      <InfoGroup>
        <NotesField>
          <Label><FaNotesMedical color="#555" /> Medical Notes / Conditions</Label>
          <Value className="long-text">
            {staff.medical_notes ? (
              staff.medical_notes
            ) : (
              <span className="no-data">No medical notes recorded.</span>
            )}
          </Value>
        </NotesField>
      </InfoGroup>
    </TabContent>
  );
}
