import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

import axios from 'services/axios';

function reportErrors(e, fallbackMessage) {
  const errors = e?.response?.data?.errors ?? [];
  errors.length > 0
    ? errors.forEach((error) => toast.error(error))
    : toast.error(fallbackMessage);
}

export default function useStaffUnits(staffId, canManage) {
  const [assignments, setAssignments] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAssignments = useCallback(async () => {
    if (!staffId) return;

    setIsLoading(true);
    try {
      const response = await axios.get('/staff-units', {
        params: { staff_id: staffId },
      });
      setAssignments(response.data.data ?? []);
    } catch (e) {
      reportErrors(e, 'Could not load unit assignments.');
    } finally {
      setIsLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  useEffect(() => {
    if (!canManage) return;

    async function loadUnitOptions() {
      try {
        const response = await axios.get('/units/lookup');
        setUnitOptions(response.data.data ?? []);
      } catch (e) {
        reportErrors(e, 'Could not load the unit list.');
      }
    }

    loadUnitOptions();
  }, [canManage]);

  async function assignUnit(unitId) {
    try {
      await axios.post('/staff-units', {
        staff_id: Number(staffId),
        unit_id: Number(unitId),
      });
      toast.success('Unit assigned successfully');
    } catch (e) {
      reportErrors(e, 'Could not assign the unit.');
      return;
    }

    await loadAssignments();
  }

  async function removeAssignment(assignmentId) {
    try {
      await axios.delete(`/staff-units/${assignmentId}`);
      toast.success('Unit assignment removed');
    } catch (e) {
      reportErrors(e, 'Could not remove the assignment.');
      return;
    }

    await loadAssignments();
  }

  return { assignments, unitOptions, isLoading, assignUnit, removeAssignment };
}
