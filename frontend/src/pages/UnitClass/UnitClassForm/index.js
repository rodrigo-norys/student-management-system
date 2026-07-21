import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Loading from 'components/Loading';

import * as actions from 'store/modules/unitClass/actions';

import {
  UNIT_CLASS_STATUS,
  UNIT_CLASS_STATUS_OPTIONS,
  SHIFTS,
} from '../constants';
import { INITIAL_STATE } from './constants';

import * as Styled from './styled';

export default function UnitClassForm() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stayOnPage, setStayOnPage] = useState(false);

  const { isLoading = false, unitOptions = [] } = useSelector(
    (state) => state.unitClass || {},
  );

  const unitClass = useSelector((state) =>
    state.unitClass?.unitClasses?.find((c) => String(c.id) === String(id)),
  );

  const unitSelectOptions = useMemo(
    () => unitOptions.map((unit) => ({ value: unit.id, label: unit.name })),
    [unitOptions],
  );

  useEffect(() => {
    dispatch(actions.getUnitOptionsRequest());
  }, [dispatch]);

  useEffect(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const animationFrame = requestAnimationFrame(() => {
        const firstErrorInput = document.querySelector('.has-error');
        if (firstErrorInput) {
          firstErrorInput.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          firstErrorInput.focus({ preventScroll: true });
        }
      });
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [errors]);

  useEffect(() => {
    if (isSubmitting && !isLoading) {
      if (!id && stayOnPage) {
        setForm(INITIAL_STATE);
        setErrors({});
      }
      setIsSubmitting(false);
    }
  }, [isLoading, isSubmitting, id, stayOnPage]);

  useEffect(() => {
    if (!id) return;
    if (!unitClass) {
      dispatch(actions.getUnitClassesRequest(id));
      return;
    }

    setForm({
      unit_id: unitClass.unit_id || '',
      name: unitClass.name || '',
      grade_level: unitClass.grade_level || '',
      room_number: unitClass.room_number || '',
      shift: unitClass.shift || '',
      school_year: unitClass.school_year || '',
      max_students: unitClass.max_students ?? '',
      status: unitClass.status || UNIT_CLASS_STATUS.ACTIVE,
    });
  }, [id, unitClass, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const { unit_id, name, grade_level, room_number, shift, school_year } =
      form;
    const maxStudents = Number(form.max_students);

    if (!unit_id) newErrors.unit_id = 'Select a unit';
    if (name.length < 1 || name.length > 20)
      newErrors.name = 'Name must be between 1 and 20 characters';
    if (!grade_level) newErrors.grade_level = 'Grade level is required';
    if (!room_number) newErrors.room_number = 'Room number is required';
    if (!shift) newErrors.shift = 'Shift is required';
    if (!school_year) newErrors.school_year = 'School year is required';
    if (!Number.isInteger(maxStudents) || maxStudents < 1)
      newErrors.max_students = 'Must be at least 1';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    const payload = {
      ...form,
      max_students: maxStudents,
      shouldLeave: !stayOnPage,
    };
    dispatch(
      id
        ? actions.updateUnitClassRequest({ id, ...payload })
        : actions.createUnitClassRequest(payload),
    );
  };

  return (
    <Styled.PageContainer>
      <Loading isLoading={isLoading} />
      <Styled.HeaderContent>
        <h1>{id ? 'Edit Class' : 'New Class'}</h1>
      </Styled.HeaderContent>

      <Styled.Form onSubmit={handleSubmit}>
        <Styled.Section>
          <Styled.SectionTitle>Class Information</Styled.SectionTitle>
          <Styled.InputGroup>
            <Styled.ValidatedSelect
              label="Unit"
              name="unit_id"
              value={form.unit_id}
              onChange={handleChange}
              error={errors.unit_id}
              array={unitSelectOptions}
            />
            <Styled.ValidatedInput
              label="Class Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="3A"
            />
          </Styled.InputGroup>
          <Styled.InputGroup>
            <Styled.ValidatedInput
              label="Grade Level"
              name="grade_level"
              value={form.grade_level}
              onChange={handleChange}
              error={errors.grade_level}
            />
            <Styled.ValidatedInput
              label="Room Number"
              name="room_number"
              value={form.room_number}
              onChange={handleChange}
              error={errors.room_number}
            />
          </Styled.InputGroup>
          <Styled.InputGroup>
            <Styled.ValidatedSelect
              label="Shift"
              name="shift"
              value={form.shift}
              onChange={handleChange}
              error={errors.shift}
              array={SHIFTS}
            />
            <Styled.ValidatedInput
              label="School Year"
              name="school_year"
              value={form.school_year}
              onChange={handleChange}
              error={errors.school_year}
              placeholder="2026"
            />
            <Styled.ValidatedInput
              label="Max Students"
              type="number"
              name="max_students"
              value={form.max_students}
              onChange={handleChange}
              error={errors.max_students}
            />
          </Styled.InputGroup>
          {id && (
            <Styled.InputGroup>
              <Styled.ValidatedSelect
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                array={UNIT_CLASS_STATUS_OPTIONS}
              />
            </Styled.InputGroup>
          )}
        </Styled.Section>

        <Styled.ActionsContainer>
          {!id && (
            <Styled.PersistenceToggle>
              <input
                type="checkbox"
                id="stayOnPage"
                checked={stayOnPage}
                onChange={() => setStayOnPage(!stayOnPage)}
              />
              <span className="checkmark" />
              <label htmlFor="stayOnPage">Create another after saving</label>
            </Styled.PersistenceToggle>
          )}
          <Styled.PrimaryButton type="submit" disabled={isLoading}>
            {id ? 'Update Class' : 'Save Class'}
          </Styled.PrimaryButton>
        </Styled.ActionsContainer>
      </Styled.Form>
    </Styled.PageContainer>
  );
}
