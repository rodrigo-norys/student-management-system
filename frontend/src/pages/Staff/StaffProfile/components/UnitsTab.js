import { useState } from 'react';
import { FaBuilding, FaPlus, FaTrash } from 'react-icons/fa';

import useStaffUnits from '../hooks/useStaffUnits';
import { ASSIGNMENT_STATUS } from '../constants';

import * as Styled from '../styled';

export default function UnitsTab({ staff, canManage }) {
  const { assignments, unitOptions, isLoading, assignUnit, removeAssignment } =
    useStaffUnits(staff.id, canManage);

  const [selectedUnitId, setSelectedUnitId] = useState('');

  const assignedUnitIds = assignments
    .filter((assignment) => assignment.status === ASSIGNMENT_STATUS.ACTIVE)
    .map((assignment) => assignment.unit_id);

  const availableUnits = unitOptions
    .filter((unit) => !assignedUnitIds.includes(unit.id))
    .map((unit) => ({ value: unit.id, label: unit.name }));

  async function handleAssign(e) {
    e.preventDefault();
    if (!selectedUnitId) return;

    await assignUnit(selectedUnitId);
    setSelectedUnitId('');
  }

  return (
    <>
      {canManage && (
        <Styled.AssignmentForm onSubmit={handleAssign}>
          <Styled.ValidatedSelect
            label="Assign to unit"
            array={availableUnits}
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
          />
          <Styled.PrimaryButton
            type="submit"
            disabled={!selectedUnitId || isLoading}
          >
            <FaPlus size={14} /> Assign
          </Styled.PrimaryButton>
        </Styled.AssignmentForm>
      )}

      <Styled.AddressGrid>
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <Styled.InfoCard key={assignment.id}>
              <Styled.InfoCardHeader>
                <h3>{assignment.unit?.name}</h3>
                {canManage &&
                  assignment.status === ASSIGNMENT_STATUS.ACTIVE && (
                    <Styled.DeleteButton
                      type="button"
                      title="Remove assignment"
                      onClick={() => removeAssignment(assignment.id)}
                    >
                      <FaTrash size={14} />
                    </Styled.DeleteButton>
                  )}
              </Styled.InfoCardHeader>
              <div>
                <Styled.Label>
                  <FaBuilding /> Assignment status
                </Styled.Label>
                <Styled.Value>
                  <Styled.StatusCell $status={assignment.status}>
                    {assignment.status}
                  </Styled.StatusCell>
                </Styled.Value>
              </div>
            </Styled.InfoCard>
          ))
        ) : (
          <Styled.EmptyMessage>
            No units assigned to this staff member.
          </Styled.EmptyMessage>
        )}
      </Styled.AddressGrid>
    </>
  );
}
