import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { FaUserCircle, FaEdit, FaPlus } from 'react-icons/fa';
import { isEmail } from 'validator';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import Loading from 'components/Loading';
import ValidatedInput from 'components/Form/ValidatedInput';
import ValidatedSelect from 'components/Form/ValidatedSelect';
import ValidatedTextarea from 'components/Form/ValidatedTextarea';

import * as actions from 'store/modules/student/actions';

import { BRAZILIAN_STATES as UFs, EMPTY_ADDRESS } from 'constants/location';
import { BLOOD_TYPES } from 'constants/medical';
import { maskCEP } from 'utils/masks';

import { getStudentImageUrl } from '../constants';
import { INITIAL_STATE } from './constants';
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

  const mainPhoto = getStudentImageUrl(form.avatar_url);

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
        Object.entries(addressSuggestion).filter(([_, value]) => !!value)
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
    const newErrors = {};
    const { name, last_name, email, registration_number, cpf, birth_date } =
      form;

    if (name.length < 3 || name.length > 50)
      newErrors.name = 'Invalid name length';
    if (last_name.length < 3 || last_name.length > 100)
      newErrors.last_name = 'Invalid last name length';
    if (!isEmail(email)) newErrors.email = 'Invalid email';
    if (!registration_number) newErrors.registration_number = 'Required';
    if (!cpfValidator.isValid(cpf)) newErrors.cpf = 'Invalid CPF';
    if (!birth_date) newErrors.birth_date = 'Required';

    form.addresses.forEach((addr, idx) => {
      if (addr.zip_code.replace(/\D/g, '').length !== 8)
        newErrors[`address_${idx}_zip_code`] = 'Invalid CEP';
      if (addr.street.length < 3)
        newErrors[`address_${idx}_street`] = 'Min 3 chars';
      if (!addr.number) newErrors[`address_${idx}_number`] = 'Required';
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    const payload = { ...form, shouldStay: stayOnPage };

    dispatch(
      id
        ? actions.updateStudentRequest({ id, ...payload })
        : actions.createStudentRequest(payload),
    );
  };

  return (
    <Styled.Container>
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
          <Styled.Sidebar>
            <Styled.Section>
              <Styled.SectionTitle>Identity</Styled.SectionTitle>
              <Styled.ProfilePicture>
                {mainPhoto ? (
                  <img src={mainPhoto} alt={form.name} />
                ) : (
                  <FaUserCircle size={150} color="#323245" />
                )}
                <Link to={id ? `/avatar/students/${id}` : '#'}>
                  <FaEdit size={20} />
                </Link>
              </Styled.ProfilePicture>
              <Styled.InputGroup>
                <ValidatedSelect
                  label="Blood Type"
                  name="blood_type"
                  value={form.blood_type}
                  onChange={handleChange}
                  array={BLOOD_TYPES}
                  error={errors.blood_type}
                />
              </Styled.InputGroup>
              <Styled.MedicalNotesWrapper>
                <ValidatedTextarea
                  label="Medical Notes"
                  name="medical_notes"
                  value={form.medical_notes}
                  onChange={handleChange}
                  maxLength="255"
                  error={errors.medical_notes}
                />
              </Styled.MedicalNotesWrapper>
            </Styled.Section>
          </Styled.Sidebar>
          <Styled.MainContent>
            <Styled.Section>
              <Styled.SectionTitle>General Information</Styled.SectionTitle>
              <Styled.InputGroup>
                <ValidatedInput
                  label="First Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <ValidatedInput
                  label="Last Name"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  error={errors.last_name}
                />
              </Styled.InputGroup>
              <Styled.InputGroup>
                <ValidatedInput
                  label="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                <ValidatedInput
                  label="Registration"
                  name="registration_number"
                  value={form.registration_number}
                  onChange={handleChange}
                  error={errors.registration_number}
                />
              </Styled.InputGroup>
              <Styled.InputGroup>
                <ValidatedInput
                  label="CPF"
                  name="cpf"
                  value={cpfValidator.format(form.cpf)}
                  onChange={handleChange}
                  error={errors.cpf}
                />
                <ValidatedInput
                  label="Birth Date"
                  type="date"
                  name="birth_date"
                  value={form.birth_date}
                  onChange={handleChange}
                  error={errors.birth_date}
                />
              </Styled.InputGroup>
            </Styled.Section>
            <Styled.Section>
              <Styled.SectionTitle>Address Records</Styled.SectionTitle>
              <Styled.AddressesWrapper>
                {form.addresses.map((address, index) => (
                  <Styled.AddressCard key={index}>
                    <Styled.AddressCardHeader>
                      <h4>Address #{index + 1}</h4>
                      {form.addresses.length > 1 && (
                        <Styled.RemoveAddressButton
                          type="button"
                          onClick={() => removeAddress(index)}
                        >
                          Remove
                        </Styled.RemoveAddressButton>
                      )}
                    </Styled.AddressCardHeader>
                    <Styled.InputGroup>
                      <ValidatedInput
                        label="Zip Code"
                        name="zip_code"
                        value={address.zip_code}
                        onChange={(e) => handleCepChange(index, e)}
                        error={errors[`address_${index}_zip_code`]}
                      />
                      <ValidatedInput
                        label="Street"
                        name="street"
                        value={address.street}
                        onChange={(e) => handleAddressChange(index, e)}
                        error={errors[`address_${index}_street`]}
                      />
                    </Styled.InputGroup>
                    <Styled.InputGroup>
                      <ValidatedInput
                        label="Number"
                        name="number"
                        value={address.number}
                        onChange={(e) => handleAddressChange(index, e)}
                        error={errors[`address_${index}_number`]}
                      />
                      <ValidatedInput
                        label="Complement"
                        name="complement"
                        value={address.complement}
                        onChange={(e) => handleAddressChange(index, e)}
                      />
                    </Styled.InputGroup>
                    <Styled.InputGroup>
                      <ValidatedInput
                        label="Neighborhood"
                        name="neighborhood"
                        value={address.neighborhood}
                        onChange={(e) => handleAddressChange(index, e)}
                      />
                      <ValidatedInput
                        label="City"
                        name="city"
                        value={address.city}
                        onChange={(e) => handleAddressChange(index, e)}
                      />
                      <ValidatedSelect
                        label="UF"
                        name="state"
                        value={address.state}
                        onChange={(e) => handleAddressChange(index, e)}
                        array={UFs}
                      />
                    </Styled.InputGroup>
                  </Styled.AddressCard>
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
    </Styled.Container>
  );
}
