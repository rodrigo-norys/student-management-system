import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { isEmail } from 'validator';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import * as actions from '../../store/modules/student/actions.js';
import Loading from '../../components/Loading';
import ValidatedInput from '../../components/Form/ValidatedInput.js';
import ValidatedSelect from '../../components/Form/ValidatedSelect.js';
import ValidatedTextarea from '../../components/Form/ValidatedTextarea.js';
import {
  Container, Title, Form, ProfilePicture, ActionsContainer, InputGroup,
  SectionTitle, Divider, HeaderContent, ViewProfileButton, CenteredWrapper,
  AddressesWrapper, AddressCard, MedicalNotesWrapper, AddAddressButton, AddressSectionWrapper,
  CenteredSectionTitle, AddressCardTitle, RemoveAddressButton
} from './styled';

const UFs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const emptyAddress = {
  id: null, zip_code: '', street: '', number: '',
  complement: '', neighborhood: '', city: '', state: ''
};

const initialState = {
  name: '', last_name: '', email: '', registration_number: '', cpf: '',
  birth_date: '', avatar_url: '', blood_type: '', medical_notes: '',
  addresses: [{ ...emptyAddress }]
};

const maskCEP = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};

export default function StudentForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  const [activeAddressIndex, setActiveAddressIndex] = useState(null);
  const [errors, setErrors] = useState({});

  const { isLoading = false, addressSuggestion = null } = useSelector(state => state.student || {});
  const student = useSelector(state =>
    state.student?.students?.find(stud => String(stud.id) === String(id))
  );
  useEffect(() => {
    if (!id) return;

    if (!student) {
      dispatch(actions.getStudentsRequest(id));
      return;
    }

    let addressList = student.addresses && student.addresses.length > 0
      ? [...student.addresses]
      : [{ ...emptyAddress }];
    addressList.sort((a, b) => {
      if (!a.id) return 1;
      if (!b.id) return -1;
      return a.id - b.id;
    });

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
      addresses: addressList
    });
  }, [id, student, dispatch]);

  useEffect(() => {
    if (addressSuggestion && activeAddressIndex !== null) {
      setForm(prev => {
        const updatedAddresses = [...prev.addresses];
        updatedAddresses[activeAddressIndex] = {
          ...updatedAddresses[activeAddressIndex],
          street: addressSuggestion.street || updatedAddresses[activeAddressIndex].street,
          neighborhood: addressSuggestion.neighborhood || updatedAddresses[activeAddressIndex].neighborhood,
          city: addressSuggestion.city || updatedAddresses[activeAddressIndex].city,
          state: addressSuggestion.state || updatedAddresses[activeAddressIndex].state,
        };
        return { ...prev, addresses: updatedAddresses };
      });
      setActiveAddressIndex(null);
    }
  }, [addressSuggestion, activeAddressIndex]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cpf') value = value.replace(/\D/g, '');

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;

    setForm(prev => {
      const updatedAddresses = [...prev.addresses];

      updatedAddresses[index] = {
        ...updatedAddresses[index],
        [name]: value
      };
      return {
        ...prev,
        addresses: updatedAddresses
      };
    });
  };

  const handleCepChange = (index, e) => {
    const value = e.target.value;
    const cleanValue = value.replace(/\D/g, '');

    setForm(prev => {
      const updatedAddresses = [...prev.addresses];
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        zip_code: maskCEP(value)
      };
      return {
        ...prev,
        addresses: updatedAddresses
      };
    });

    if (cleanValue.length === 8) {
      setActiveAddressIndex(index);
      dispatch(actions.getCepRequest(cleanValue));
    }
  };

  const addAddress = () => {
    if (form.addresses.length < 3) {
      setForm(prev => ({
        ...prev,
        addresses:
          [
            ...prev.addresses,
            { ...emptyAddress }
          ]
      }));
    }
  };

  const removeAddress = (indexToRemove) => {
    setForm(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const shouldLeave = e.nativeEvent.submitter?.name === 'leave';
    const shouldStay = e.nativeEvent.submitter?.name === 'stay';

    const { name, last_name, email, registration_number, cpf, birth_date } = form;

    if (name.length < 3 || name.length > 50) newErrors.name = 'Name must be between 3 and 50 characters';
    if (last_name.length < 3 || last_name.length > 100) newErrors.last_name = 'Last name must be between 3 and 100 characters';
    if (!isEmail(email)) newErrors.email = 'Invalid email address';
    if (!registration_number) newErrors.registration_number = 'Registration number is required';
    if (!cpfValidator.isValid(cpf)) newErrors.cpf = 'Invalid CPF format or algorithm';
    if (!birth_date) newErrors.birth_date = 'Please provide a birth date';

    form.addresses.forEach((address, index) => {
      if (address.zip_code.replace(/\D/g, '').length !== 8) newErrors[`address_${index}_zip_code`] = 'Invalid CEP';
      if (address.street.length < 3) newErrors[`address_${index}_street`] = 'Street must have at least 3 characters';
      if (!address.number) newErrors[`address_${index}_number`] = 'Number is required';
      if (address.neighborhood.length < 2) newErrors[`address_${index}_neighborhood`] = 'Neighborhood is required';
      if (address.city.length < 2) newErrors[`address_${index}_city`] = 'City is required';
      if (address.state.length !== 2) newErrors[`address_${index}_state`] = 'State must be 2 characters';
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    (id)
      ? dispatch(actions.updateStudentRequest({ id, ...form, shouldLeave, shouldStay }))
      : dispatch(actions.createStudentRequest({ ...form, shouldLeave, shouldStay }));
  };

  const mainPhoto = `${process.env.REACT_APP_API_URL}/images/students/${form.avatar_url}`;

  const renderButtons = id
    ? <button type="submit" name="leave" disabled={isLoading}>Update</button>
    : <>
      <button type="submit" name="stay" disabled={isLoading}>Save & New</button>
      <button type="submit" name="leave" disabled={isLoading}>Save & Finish</button>
    </>;

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Form onSubmit={handleSubmit}>
        <CenteredWrapper>
          <HeaderContent>
            <Title>{id ? 'Edit Student' : 'Create Student'}</Title>
            {id && (
              <ViewProfileButton type="button" onClick={() => navigate(`/student/${id}/`)}>
                <FaUserCircle size={18} /> View Profile
              </ViewProfileButton>
            )}
          </HeaderContent>

          {id && (
            <ProfilePicture>
              {form.avatar_url
                ? <img src={mainPhoto} alt={form.name} />
                : <FaUserCircle size={150} color="#ddd" />
              }
              <Link to={`/avatar/students/${id}`}>
                <FaEdit size={20} />
              </Link>
            </ProfilePicture>
          )}

          <SectionTitle>Personal Data</SectionTitle>

          <InputGroup>
            <ValidatedInput
              label='First Name' type='text' name='name' value={form.name} onChange={handleChange}
              maxLength='50' placeholder='Ex: Rodrigo' error={errors.name}
            />
            <ValidatedInput
              label='Last Name' type='text' name='last_name' value={form.last_name} onChange={handleChange}
              maxLength='100' placeholder='Ex: Norys' error={errors.last_name}
            />
          </InputGroup>

          <ValidatedInput
            label='Email Address' type='email' name='email' value={form.email} onChange={handleChange}
            maxLength='150' placeholder='rodrigo@example.com' error={errors.email}
          />

          <InputGroup>
            <ValidatedInput
              label='Registration' type='text' name='registration_number' value={form.registration_number}
              onChange={handleChange} maxLength='20' error={errors.registration_number}
            />
            <ValidatedInput
              label='CPF' type='text' name='cpf' value={cpfValidator.format(form.cpf)} onChange={handleChange}
              maxLength='14' placeholder='000.000.000-00' error={errors.cpf}
            />
          </InputGroup>

          <InputGroup>
            <ValidatedInput
              label='Birth Date' type='date' name='birth_date' value={form.birth_date}
              onChange={handleChange} maxLength='10' error={errors.birth_date}
            />
            <ValidatedSelect
              label='Blood Types' name='blood_type' value={form.blood_type} onChange={handleChange}
              array={bloodTypes} error={errors.blood_type}
            />
          </InputGroup>

          <MedicalNotesWrapper>
            <ValidatedTextarea
              label='Medical Notes' name='medical_notes' value={form.medical_notes} onChange={handleChange}
              maxLength='255' error={errors.medical_notes}
            />
          </MedicalNotesWrapper>
        </CenteredWrapper>

        <Divider />

        <AddressSectionWrapper>
          <CenteredSectionTitle>Address Details</CenteredSectionTitle>
        </AddressSectionWrapper>

        <AddressesWrapper>
          {form.addresses.map((address, index) => (
            <AddressCard key={index}>

              {form.addresses.length > 1 && (
                <RemoveAddressButton
                  type='button' onClick={() => removeAddress(index)}
                  title='Remove Address'> X
                </RemoveAddressButton>
              )}

              <AddressCardTitle>Address {index + 1}</AddressCardTitle>

              <InputGroup>
                <ValidatedInput
                  label='Zip Code' type='text' name='zip_code' value={address.zip_code} onChange={(e) => handleCepChange(index, e)}
                  maxLength='9' placeholder='00000-000' error={errors[`address_${index}_zip_code`]}
                />
                <ValidatedInput
                  label='Street' type='text' name='street' value={address.street} onChange={(e) => handleAddressChange(index, e)}
                  maxLength='100' error={errors[`address_${index}_street`]}
                />
              </InputGroup>

              <InputGroup>
                <ValidatedInput
                  label='Number' type='text' name='number' value={address.number} onChange={(e) => handleAddressChange(index, e)}
                  maxLength='10' error={errors[`address_${index}_number`]}
                />
                <ValidatedInput
                  label='Complement' type='text' name='complement' value={address.complement} onChange={(e) => handleAddressChange(index, e)}
                  maxLength='100' error={errors[`address_${index}complement`]}
                />
              </InputGroup>

              <InputGroup>
                <ValidatedInput
                  label='Neighborhood' type='text' name='neighborhood' value={address.neighborhood} onChange={(e) => handleAddressChange(index, e)}
                  maxLength='100' error={errors[`address_${index}_neighborhood`]}
                />

                <ValidatedInput
                  label='City' type='text' name='city' value={address.city} onChange={(e) => handleAddressChange(index, e)}
                  maxLength='100' error={errors[`address_${index}_city`]}
                />

                <ValidatedSelect
                  label='UF' name='state' value={address.state} onChange={(e) => handleAddressChange(index, e)}
                  array={UFs} error={errors[`address_${index}_state`]}
                />
              </InputGroup>
            </AddressCard>
          ))}
        </AddressesWrapper>

        {form.addresses.length < 3 && (
          <AddAddressButton type="button" onClick={addAddress}>
            + Add another address
          </AddAddressButton>
        )}

        <CenteredWrapper>
          <ActionsContainer>
            {renderButtons}
          </ActionsContainer>
        </CenteredWrapper>

      </Form>
    </Container>
  );
}
