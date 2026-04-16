import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { isEmail } from 'validator';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import Loading from '../../components/Loading';
import ValidatedInput from '../../components/Form/ValidatedInput.js';
import ValidatedSelect from '../../components/Form/ValidatedSelect.js';

import * as actions from '../../store/modules/guardian/actions.js';

import {
  Container, Title, Form, ProfilePicture, ActionsContainer, InputGroup,
  SectionTitle, Divider, HeaderContent, ViewProfileButton, CenteredWrapper,
  AddressesWrapper, AddressCard, AddAddressButton, AddressSectionWrapper,
  CenteredSectionTitle, AddressCardTitle, RemoveAddressButton
} from './styled';

const UFs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

const emptyAddress = {
  id: null, zip_code: '', street: '', number: '',
  complement: '', neighborhood: '', city: '', state: ''
};

const initialState = {
  name: '', last_name: '', email: '', cpf: '', phone: '',
  avatar_url: '', addresses: [{ ...emptyAddress }]
};

const maskCEP = (value) => {
  return value.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").replace(/(-\d{3})\d+?$/, "$1");
};

export default function GuardianForm() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  const [activeAddressIndex, setActiveAddressIndex] = useState(null);
  const [errors, setErrors] = useState({});

  const { isLoading = false, addressSuggestion = null } = useSelector(state => state.guardian || {});
  const guardian = useSelector(state =>
    state.guardian?.guardians?.find(guardian => String(guardian.id) === String(id))
  );

  useEffect(() => {
    if (!id) return;
    if (!guardian) {
      dispatch(actions.getGuardiansRequest(id));
      return;
    }

    const addressList = guardian.addresses?.length > 0
      ? [...guardian.addresses].sort((a, b) => a.id - b.id)
      : [{ ...emptyAddress }];

    setForm({
      name: guardian.name || '',
      last_name: guardian.last_name || '',
      email: guardian.email || '',
      cpf: guardian.cpf || '',
      phone: guardian.phone || '',
      avatar_url: guardian.avatar_url || '',
      addresses: addressList
    });
  }, [id, guardian, dispatch]);

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
        addresses: [
          ...prev.addresses,
          { ...emptyAddress }
        ]
      }));
    }
  };

  const removeAddress = (indexToRemove) => {
    setForm(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== indexToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const shouldLeave = e.nativeEvent.submitter?.name === 'leave';
    const { name, last_name, email, cpf, phone } = form;

    if (name.length < 3 || name.length > 50) newErrors.name = 'Invalid name';
    if (last_name.length < 3 || last_name.length > 50) newErrors.last_name = 'Invalid last name';
    if (!isEmail(email)) newErrors.email = 'Invalid email';
    if (!cpfValidator.isValid(cpf)) newErrors.cpf = 'Invalid CPF';
    if (phone.length < 10) newErrors.phone = 'Invalid phone number';

    form.addresses.forEach((addr, i) => {
      if (addr.zip_code.replace(/\D/g, '').length !== 8) newErrors[`address_${i}_zip_code`] = 'Invalid CEP';
      if (!addr.street || !addr.number || !addr.neighborhood) newErrors[`address_${i}_required`] = 'Check address fields';
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    id
      ? dispatch(actions.updateGuardianRequest({ id, ...form, shouldLeave }))
      : dispatch(actions.createGuardianRequest({ ...form, shouldLeave }));
  };

  const mainPhoto = `${process.env.REACT_APP_API_URL}/images/guardians/${form.avatar_url}`;

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Form onSubmit={handleSubmit}>
        <CenteredWrapper>
          <HeaderContent>
            <Title>{id ? 'Edit Guardian' : 'Create Guardian'}</Title>
            {id && (
              <ViewProfileButton type="button" onClick={() => navigate(`/guardian/${id}/`)}>
                <FaUserCircle size={18} /> View Profile
              </ViewProfileButton>
            )}
          </HeaderContent>

          {id && (
            <ProfilePicture>
              {form.avatar_url
                ? <img src={mainPhoto} alt={form.name} />
                : <FaUserCircle size={150} color="#ddd" />}
              <Link to={`/avatar/guardians/${id}`}><FaEdit size={20} /></Link>
            </ProfilePicture>
          )}

          <SectionTitle>Personal Data</SectionTitle>
          <InputGroup>
            <ValidatedInput label='First Name' name='name' value={form.name} onChange={handleChange} error={errors.name} />
            <ValidatedInput label='Last Name' name='last_name' value={form.last_name} onChange={handleChange} error={errors.last_name} />
          </InputGroup>

          <ValidatedInput label='Email' type='email' name='email' value={form.email} onChange={handleChange} error={errors.email} />

          <InputGroup>
            <ValidatedInput label='CPF' name='cpf' value={cpfValidator.format(form.cpf)} onChange={handleChange} error={errors.cpf} />
            <ValidatedInput label='Phone' name='phone' value={form.phone} onChange={handleChange} error={errors.phone} placeholder="(00) 00000-0000" />
          </InputGroup>
        </CenteredWrapper>

        <Divider />
        <AddressSectionWrapper><CenteredSectionTitle>Addresses</CenteredSectionTitle></AddressSectionWrapper>

        <AddressesWrapper>
          {form.addresses.map((addr, index) => (
            <AddressCard key={index}>
              {form.addresses.length > 1 && (
                <RemoveAddressButton type='button' onClick={() => removeAddress(index)}>X</RemoveAddressButton>
              )}
              <AddressCardTitle>Address {index + 1}</AddressCardTitle>
              <InputGroup>
                <ValidatedInput label='Zip Code' name='zip_code' value={addr.zip_code} onChange={(e) => handleCepChange(index, e)} error={errors[`address_${index}_zip_code`]} />
                <ValidatedInput label='Street' name='street' value={addr.street} onChange={(e) => handleAddressChange(index, e)} />
              </InputGroup>
              <InputGroup>
                <ValidatedInput label='Number' name='number' value={addr.number} onChange={(e) => handleAddressChange(index, e)} />
                <ValidatedInput label='Complement' name='complement' value={addr.complement} onChange={(e) => handleAddressChange(index, e)} />
              </InputGroup>
              <InputGroup>
                <ValidatedInput label='Neighborhood' name='neighborhood' value={addr.neighborhood} onChange={(e) => handleAddressChange(index, e)} />
                <ValidatedInput label='City' name='city' value={addr.city} onChange={(e) => handleAddressChange(index, e)} />
                <ValidatedSelect label='UF' name='state' value={addr.state} onChange={(e) => handleAddressChange(index, e)} array={UFs} />
              </InputGroup>
            </AddressCard>
          ))}
        </AddressesWrapper>

        {form.addresses.length < 3 && (
          <AddAddressButton type="button" onClick={addAddress}>+ Add another address</AddAddressButton>
        )}

        <CenteredWrapper>
          <ActionsContainer>
            <button type="submit" name="leave" disabled={isLoading}>{id ? 'Update' : 'Save & Finish'}</button>
          </ActionsContainer>
        </CenteredWrapper>
      </Form>
    </Container>
  );
}
