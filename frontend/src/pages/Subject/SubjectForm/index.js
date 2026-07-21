import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Loading from 'components/Loading';

import * as actions from 'store/modules/subject/actions';

import { SUBJECT_STATUS, SUBJECT_STATUS_OPTIONS } from '../constants';
import { INITIAL_STATE } from './constants';

import * as Styled from './styled';

export default function SubjectForm() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stayOnPage, setStayOnPage] = useState(false);

  const { isLoading = false } = useSelector((state) => state.subject || {});

  const subject = useSelector((state) =>
    state.subject?.subjects?.find((s) => String(s.id) === String(id)),
  );

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
    if (!subject) {
      dispatch(actions.getSubjectsRequest(id));
      return;
    }

    setForm({
      name: subject.name || '',
      code: subject.code || '',
      description: subject.description || '',
      knowledge_area: subject.knowledge_area || '',
      is_elective: Boolean(subject.is_elective),
      status: subject.status || SUBJECT_STATUS.ACTIVE,
    });
  }, [id, subject, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const { name, code } = form;

    if (name.length < 3 || name.length > 50)
      newErrors.name = 'Name must be between 3 and 50 characters';
    if (code.length < 1 || code.length > 10)
      newErrors.code = 'Code must be between 1 and 10 characters';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    const payload = { ...form, shouldLeave: !stayOnPage };
    dispatch(
      id
        ? actions.updateSubjectRequest({ id, ...payload })
        : actions.createSubjectRequest(payload),
    );
  };

  return (
    <Styled.PageContainer>
      <Loading isLoading={isLoading} />
      <Styled.HeaderContent>
        <h1>{id ? 'Edit Subject' : 'New Subject'}</h1>
      </Styled.HeaderContent>

      <Styled.Form onSubmit={handleSubmit}>
        <Styled.Section>
          <Styled.SectionTitle>General Information</Styled.SectionTitle>
          <Styled.InputGroup>
            <Styled.ValidatedInput
              label="Subject Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Styled.ValidatedInput
              label="Code"
              name="code"
              value={form.code}
              onChange={handleChange}
              error={errors.code}
            />
          </Styled.InputGroup>
          <Styled.InputGroup>
            <Styled.ValidatedInput
              label="Knowledge Area"
              name="knowledge_area"
              value={form.knowledge_area}
              onChange={handleChange}
            />
            {id && (
              <Styled.ValidatedSelect
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                array={SUBJECT_STATUS_OPTIONS}
              />
            )}
          </Styled.InputGroup>
          <Styled.InputGroup>
            <Styled.ValidatedTextarea
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </Styled.InputGroup>
          <Styled.CheckboxField
            id="is_elective"
            label="Elective subject"
            checked={form.is_elective}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, is_elective: e.target.checked }))
            }
          />
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
            {id ? 'Update Subject' : 'Save Subject'}
          </Styled.PrimaryButton>
        </Styled.ActionsContainer>
      </Styled.Form>
    </Styled.PageContainer>
  );
}
