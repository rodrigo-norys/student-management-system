import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { isEmail } from 'validator';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import * as actions from '../../store/modules/student/actions.js';
import Loading from '../../components/Loading';
import {
  Container, Title, Form, ProfilePicture, ActionsContainer, InputGroup,
  SectionTitle, Divider, HeaderContent, ViewProfileButton, CenteredWrapper,
  AddressesWrapper, AddressCard, AddAddressButton, AddressSectionWrapper,
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

export default function Student() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  const [activeAddressIndex, setActiveAddressIndex] = useState(null);

  // Selectors
  const { isLoading = false, addressSuggestion = null } = useSelector(state => state.student || {});
  const student = useSelector(state =>
    state.student?.students?.find(stud => String(stud.id) === String(id))
  );

  // --- EFFECTS --- \\
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

  // --- HANDLERS --- \\
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
      updatedAddresses[index] = { ...updatedAddresses[index], [name]: value };
      return { ...prev, addresses: updatedAddresses };
    });
  };

  const handleCepChange = (index, e) => {
    const value = e.target.value;
    const cleanValue = value.replace(/\D/g, '');

    setForm(prev => {
      const updatedAddresses = [...prev.addresses];
      updatedAddresses[index] = { ...updatedAddresses[index], zip_code: maskCEP(value) };
      return { ...prev, addresses: updatedAddresses };
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
        addresses: [...prev.addresses, { ...emptyAddress }]
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
    let formErrors = false;

    const shouldLeave = e.nativeEvent.submitter?.name === 'leave';
    const shouldStay = e.nativeEvent.submitter?.name === 'stay';

    const { name, last_name, email, registration_number, cpf, birth_date } = form;

    const personalRules = [
      { condition: name.length < 3 || name.length > 50, message: 'Name must be between 3 and 50 characters' },
      { condition: last_name.length < 3 || last_name.length > 100, message: 'Last name must be between 3 and 100 characters' },
      { condition: !isEmail(email), message: 'Invalid email address' },
      { condition: !registration_number, message: 'Registration number is required.' },
      { condition: !cpfValidator.isValid(cpf), message: 'Invalid CPF format or algorithm.' },
      { condition: !birth_date, message: 'Please provide a birth date' },
    ];

    personalRules.forEach(rule => {
      if (rule.condition) {
        formErrors = true;
        toast.error(rule.message);
      }
    });

    form.addresses.forEach((address, index) => {
      const addrNum = index + 1;
      const addressRules = [
        { condition: address.zip_code.replace(/\D/g, '').length !== 8, message: `Address ${addrNum}: Invalid CEP.` },
        { condition: address.street.length < 3, message: `Address ${addrNum}: Street must have at least 3 characters.` },
        { condition: !address.number, message: `Address ${addrNum}: House/Building number is required.` },
        { condition: address.neighborhood.length < 2, message: `Address ${addrNum}: Neighborhood is required.` },
        { condition: address.city.length < 2, message: `Address ${addrNum}: City is required.` },
        { condition: address.state.length !== 2, message: `Address ${addrNum}: State (UF) must be 2 characters.` },
      ];

      addressRules.forEach(rule => {
        if (rule.condition) {
          formErrors = true;
          toast.error(rule.message);
        }
      });
    });

    if (formErrors) return;

    dispatch(actions.createStudentRequest({ id, ...form, shouldLeave, shouldStay }));
  };

  const mainPhoto = `${process.env.REACT_APP_API_URL}/images/${form.avatar_url}`;

  const renderButtons = id ? (
    <>
      <button type="submit" disabled={isLoading}>Update & Finish</button>
      <button type="submit" name="leave" disabled={isLoading}>Update & New</button>
    </>
  ) : (
    <>
      <button type="submit" name="stay" disabled={isLoading}>Save & New</button>
      <button type="submit" name="leave" disabled={isLoading}>Save & Finish</button>
    </>
  );

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
              {form.avatar_url ? (
                <img src={mainPhoto} alt={form.name} />
              ) : (
                <FaUserCircle size={150} color="#ddd" />
              )}
              <Link to={`/avatar/${id}`}>
                <FaEdit size={20} />
              </Link>
            </ProfilePicture>
          )}

          <SectionTitle>Personal Data</SectionTitle>

          <InputGroup>
            <label>First Name
              <input type='text' name='name' value={form.name} onChange={handleChange} maxLength="50" placeholder='Ex: Rodrigo' />
            </label>
            <label>Last Name
              <input type='text' name='last_name' value={form.last_name} onChange={handleChange} maxLength="100" placeholder='Ex: Norys' />
            </label>
          </InputGroup>

          <label>Email Address
            <input type='email' name='email' value={form.email} onChange={handleChange} maxLength="150" placeholder='rodrigo@example.com' />
          </label>

          <InputGroup>
            <label>Registration
              <input type='text' name='registration_number' value={form.registration_number} onChange={handleChange} maxLength="20" />
            </label>
            <label>CPF
              <input type='text' name='cpf' value={cpfValidator.format(form.cpf)} onChange={handleChange} maxLength="14" placeholder='000.000.000-00' />
            </label>
          </InputGroup>

          <InputGroup>
            <label>Birth Date
              <input type='date' name='birth_date' value={form.birth_date} onChange={handleChange} maxLength="10" />
            </label>
            <label>Blood Type
              <select name='blood_type' value={form.blood_type} onChange={handleChange}>
                <option value=''>Select</option>
                {bloodTypes.map(blood => (
                  <option key={blood} value={blood}>{blood}</option>
                ))}
              </select>
            </label>
          </InputGroup>

          <label>Medical Notes
            <textarea name='medical_notes' value={form.medical_notes} onChange={handleChange} maxLength="255" />
          </label>
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
                  type="button"
                  onClick={() => removeAddress(index)}
                  title="Remove Address"> X
                </RemoveAddressButton>
              )}

              <AddressCardTitle>Address {index + 1}</AddressCardTitle>

              <InputGroup>
                <label style={{ flex: 1 }}>Zip Code
                  <input type='text' name='zip_code' value={address.zip_code} onChange={(e) => handleCepChange(index, e)} maxLength="9" placeholder="00000-000" />
                </label>
                <label style={{ flex: 3 }}>Street
                  <input type='text' name='street' value={address.street} onChange={(e) => handleAddressChange(index, e)} maxLength="100" />
                </label>
              </InputGroup>

              <InputGroup>
                <label style={{ flex: 1 }}>Number
                  <input type='text' name='number' value={address.number} onChange={(e) => handleAddressChange(index, e)} maxLength="10" />
                </label>
                <label style={{ flex: 2 }}>Complement
                  <input type='text' name='complement' value={address.complement} onChange={(e) => handleAddressChange(index, e)} maxLength="100" />
                </label>
              </InputGroup>

              <InputGroup>
                <label style={{ flex: 2 }}>Neighborhood
                  <input type='text' name='neighborhood' value={address.neighborhood} onChange={(e) => handleAddressChange(index, e)} maxLength="100" />
                </label>
                <label style={{ flex: 2 }}>City
                  <input type='text' name='city' value={address.city} onChange={(e) => handleAddressChange(index, e)} maxLength="100" />
                </label>
                <label style={{ flex: 0.6 }}>UF
                  <select name='state' value={address.state} onChange={(e) => handleAddressChange(index, e)}>
                    <option value="">Select</option>
                    {UFs.map(uf => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </label>
              </InputGroup>

            </AddressCard>
          ))}
        </AddressesWrapper>

        {form.addresses.length < 3 && (
          <AddAddressButton type="button" onClick={addAddress}>
            + Add another address
          </AddAddressButton>
        )}

        <ActionsContainer>
          {renderButtons}
        </ActionsContainer>

      </Form>
    </Container>
  );
}
