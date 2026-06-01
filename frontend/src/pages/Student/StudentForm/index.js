import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { FaUserCircle, FaPlus } from 'react-icons/fa';

import Loading from 'components/Loading';

import * as actions from 'store/modules/student/actions';

import { EMPTY_ADDRESS } from 'constants/location';
import { maskCEP } from 'utils/masks';
import { getStudentAvatarUrl } from 'utils/imageHelpers';

import { INITIAL_STATE } from './constants';
import { validateStudentForm } from './validation';

import IdentitySidebar from './components/IdentitySidebar';
import GeneralInfoFieldset from './components/GeneralInfoFieldset';
import AddressFieldset from './components/AddressFieldset';

import * as Styled from './styled';

export default function StudentForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [form, setForm] = useState(INITIAL_STATE);
  const [activeAddressIndex, setActiveAddressIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stayOnPage, setStayOnPage] = useState(false);

  const { isLoading = false, addressSuggestion = null } = useSelector(
    (state) => state.student || {},
  );

  const student = useSelector((state) =>
    state.student?.students?.find((s) => String(s.id) === String(id)),
  );

  const mainPhoto = getStudentAvatarUrl(form.avatar_url);

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
    if (!student) {
      dispatch(actions.getStudentsRequest(id));
      return;
    }
    let addressList =
      student.addresses && student.addresses.length > 0
        ? [...student.addresses]
        : [{ ...EMPTY_ADDRESS }];
    addressList.sort((a, b) => (a.id || Infinity) - (b.id || Infinity));
    setForm({
      name: student.name || '',
      last_name: student.last_name || '',
      email: student.email || '',
      registration_number: student.registration_number || '',
      cpf: student.cpf || '',
      birth_date: student.birth_date?.split('T')[0] || '',
      avatar_url: student.avatar_url || '',
      blood_type: student.blood_type || '',
      medical_notes: student.medical_notes || '',
      addresses: addressList,
    });
  }, [id, student, dispatch]);

  useEffect(() => {
    if (!addressSuggestion || activeAddressIndex === null) return;

    setForm((prev) => {
      const updatedAddresses = [...prev.addresses];
      const currentAddress = updatedAddresses[activeAddressIndex];

      const filteredSuggestion = Object.fromEntries(
        Object.entries(addressSuggestion).filter(([_, value]) => !!value),
      );

      updatedAddresses[activeAddressIndex] = {
        ...currentAddress,
        ...filteredSuggestion,
      };

      return { ...prev, addresses: updatedAddresses };
    });

    setActiveAddressIndex(null);
  }, [addressSuggestion, activeAddressIndex]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cpf') value = value.replace(/\D/g, '');
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updatedAddresses = [...prev.addresses];
      updatedAddresses[index] = { ...updatedAddresses[index], [name]: value };
      return { ...prev, addresses: updatedAddresses };
    });
  };

  const handleCepChange = (index, e) => {
    const value = e.target.value;
    const cleanValue = value.replace(/\D/g, '');
    setForm((prev) => {
      const updatedAddresses = [...prev.addresses];
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        zip_code: maskCEP(value),
      };
      return { ...prev, addresses: updatedAddresses };
    });
    if (cleanValue.length === 8) {
      setActiveAddressIndex(index);
      dispatch(actions.getCepRequest(cleanValue));
    }
  };

  const addAddress = () => {
    if (form.addresses.length < 3) {
      setForm((prev) => ({
        ...prev,
        addresses: [...prev.addresses, { ...EMPTY_ADDRESS }],
      }));
    }
  };

  const removeAddress = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateStudentForm(form);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    const { registration_number, avatar_url, ...formData } = form;
    const payload = { ...formData, shouldStay: stayOnPage };

    dispatch(
      id
        ? actions.updateStudentRequest({ id, ...payload })
        : actions.createStudentRequest(payload),
    );
  };

  return (
    <Styled.PageContainer>
      <Loading isLoading={isLoading} />
      <Styled.HeaderContent>
        <h1>{id ? 'Edit Student' : 'New Student'}</h1>
        {id && (
          <Styled.PrimaryButton as={Link} to={`/student/${id}`}>
            <FaUserCircle size={16} /> Profile View
          </Styled.PrimaryButton>
        )}
      </Styled.HeaderContent>
      <Styled.Form onSubmit={handleSubmit}>
        <Styled.FormGrid>
          <IdentitySidebar
            form={form}
            errors={errors}
            onChange={handleChange}
            mainPhoto={mainPhoto}
            studentId={id}
          />
          <Styled.MainContent>
            <GeneralInfoFieldset
              form={form}
              errors={errors}
              onChange={handleChange}
            />
            <Styled.Section>
              <Styled.SectionTitle>Address Records</Styled.SectionTitle>
              <Styled.AddressesWrapper>
                {form.addresses.map((address, index) => (
                  <AddressFieldset
                    key={index}
                    address={address}
                    index={index}
                    errors={errors}
                    onAddressChange={(e) => handleAddressChange(index, e)}
                    onCepChange={(e) => handleCepChange(index, e)}
                    onRemove={() => removeAddress(index)}
                    showRemove={form.addresses.length > 1}
                  />
                ))}
              </Styled.AddressesWrapper>
              {form.addresses.length < 3 && (
                <Styled.AddAddressButton type="button" onClick={addAddress}>
                  <FaPlus size={12} /> Add another address
                </Styled.AddAddressButton>
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
                  <label htmlFor="stayOnPage">
                    Create another after saving
                  </label>
                </Styled.PersistenceToggle>
              )}
              <Styled.PrimaryButton type="submit" disabled={isLoading}>
                {id ? 'Update Student' : 'Save Student'}
              </Styled.PrimaryButton>
            </Styled.ActionsContainer>
          </Styled.MainContent>
        </Styled.FormGrid>
      </Styled.Form>
    </Styled.PageContainer>
  );
}
