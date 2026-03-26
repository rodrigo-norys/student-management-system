import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { isEmail } from 'validator';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import * as actions from '../../store/modules/staff/actions.js';
import Loading from '../../components/Loading/index.js';

import {
  Container, Title, Form, ProfilePicture, ActionsContainer, InputGroup,
  SectionTitle, Divider, HeaderContent, ViewProfileButton, CenteredWrapper,
  AddressesWrapper, AddressCard, AddAddressButton, AddressSectionWrapper,
  CenteredSectionTitle, AddressCardTitle, RemoveAddressButton
} from './styled.js';

const UFs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

const emptyAddress = {
  id: null, zip_code: '', street: '', number: '',
  complement: '', neighborhood: '', city: '', state: ''
};

const initialState = {
  full_name: '', email: '', personal_email: '', cpf: '', birth_date: '',
  phone: '', job_title: '', hiring_date: '', status: 'active', avatar_url: '',
  addresses: [{ ...emptyAddress }]
};

const maskCEP = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};

const maskPhone = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2");
};

export default function StaffForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  const [activeAddressIndex, setActiveAddressIndex] = useState(null);

  const { isLoading = false, addressSuggestion = null, staff = [] } = useSelector(state => state.staff || {});

  const staffMember = staff.find(member => String(member.id) === String(id));

  useEffect(() => {
    if (!id) return;

    if (!staffMember) {
      dispatch(actions.getStaffRequest());
      return;
    }

    const addressList = staffMember.addresses && staffMember.addresses.length > 0
      ? [...staffMember.addresses]
      : [{ ...emptyAddress }];

    addressList.sort((a, b) => {
      if (!a.id) return 1;
      if (!b.id) return -1;
      return a.id - b.id;
    });

    setForm({
      full_name: staffMember.full_name || '',
      email: staffMember.email || '',
      personal_email: staffMember.personal_email || '',
      cpf: staffMember.cpf || '',
      birth_date: staffMember.birth_date?.split('T')[0] || '',
      phone: staffMember.phone || '',
      job_title: staffMember.job_title || '',
      hiring_date: staffMember.hiring_date?.split('T')[0] || '',
      status: staffMember.status || 'active',
      avatar_url: staffMember.avatar_url || '',
      addresses: addressList
    });
  }, [id, staffMember, dispatch]);

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
    if (name === 'phone') value = maskPhone(value);

    setForm(prev => ({ ...prev, [name]: value }));
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
      addresses: prev.addresses.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = false;

    const shouldLeave = e.nativeEvent.submitter?.name === 'leave';
    const shouldStay = e.nativeEvent.submitter?.name === 'stay';

    const { full_name, email, personal_email, cpf, birth_date, phone, job_title, hiring_date } = form;

    const staffRules = [
      { condition: full_name.length < 3 || full_name.length > 150, message: 'Full name must be between 3 and 150 characters.' },
      { condition: !isEmail(email), message: 'Invalid institutional email address.' },
      { condition: !isEmail(personal_email), message: 'Invalid personal email address.' },
      { condition: !cpfValidator.isValid(cpf), message: 'Invalid CPF format.' },
      { condition: !birth_date, message: 'Please provide a birth date.' },
      { condition: phone.replace(/\D/g, '').length < 10, message: 'Invalid phone number.' },
      { condition: job_title.length < 3, message: 'Job title is required.' },
      { condition: !hiring_date, message: 'Please provide a hiring date.' },
    ];

    staffRules.forEach(rule => {
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
        { condition: !address.number, message: `Address ${addrNum}: Number is required.` },
        { condition: address.neighborhood.length < 2, message: `Address ${addrNum}: Neighborhood is required.` },
        { condition: address.city.length < 2, message: `Address ${addrNum}: City is required.` },
        { condition: address.state.length !== 2, message: `Address ${addrNum}: State (UF) is required.` },
      ];

      addressRules.forEach(rule => {
        if (rule.condition) {
          formErrors = true;
          toast.error(rule.message);
        }
      });
    });

    if (formErrors) return;

    const dataToSubmit = {
      ...form,
      phone: phone.replace(/\D/g, '')
    };

    if (id) {
      dispatch(actions.updateStaffRequest({ id, ...dataToSubmit, shouldLeave, shouldStay }));
    } else {
      dispatch(actions.createStaffRequest({ ...dataToSubmit, shouldLeave, shouldStay }));
    }
  };

  const mainPhoto = `${process.env.REACT_APP_API_URL}/images/staff/${form.avatar_url}`;

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
            <Title>{id ? 'Edit Staff Member' : 'Create Staff Member'}</Title>
            {id && (
              <ViewProfileButton type="button" onClick={() => navigate(`/staff/${id}/`)}>
                <FaUserCircle size={18} /> View Profile
              </ViewProfileButton>
            )}
          </HeaderContent>

          {id && (
            <ProfilePicture>
              {form.avatar_url ? (
                <img src={mainPhoto} alt={form.full_name} />
              ) : (
                <FaUserCircle size={150} color="#ddd" />
              )}
              <Link to={`/avatar/staff/${id}`}>
                <FaEdit size={20} />
              </Link>
            </ProfilePicture>
          )}

          <SectionTitle>Professional & Personal Data</SectionTitle>

          <label>Full Name
            <input type='text' name='full_name' value={form.full_name} onChange={handleChange} maxLength="150" placeholder='Ex: Rodrigo Norys' />
          </label>

          <InputGroup>
            <label>Inst. Email
              <input type='email' name='email' value={form.email} onChange={handleChange} maxLength="150" placeholder='rodrigo@school.com' />
            </label>
            <label>Personal Email
              <input type='email' name='personal_email' value={form.personal_email} onChange={handleChange} maxLength="100" placeholder='rodrigo@gmail.com' />
            </label>
          </InputGroup>

          <InputGroup>
            <label>CPF
              <input type='text' name='cpf' value={cpfValidator.format(form.cpf)} onChange={handleChange} maxLength="14" placeholder='000.000.000-00' />
            </label>
            <label>Phone
              <input type='text' name='phone' value={form.phone} onChange={handleChange} maxLength="15" placeholder='(00) 00000-0000' />
            </label>
          </InputGroup>

          <InputGroup>
            <label>Birth Date
              <input type='date' name='birth_date' value={form.birth_date} onChange={handleChange} />
            </label>
            <label>Hiring Date
              <input type='date' name='hiring_date' value={form.hiring_date} onChange={handleChange} />
            </label>
          </InputGroup>

          <InputGroup>
            <label>Job Title
              <input type='text' name='job_title' value={form.job_title} onChange={handleChange} maxLength="100" placeholder='Ex: Math Teacher' />
            </label>
            <label>Status
              <select name='status' value={form.status} onChange={handleChange}>
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
                <option value='on_leave'>On Leave</option>
              </select>
            </label>
          </InputGroup>

        </CenteredWrapper>

        <Divider />

        <AddressSectionWrapper>
          <CenteredSectionTitle>Address Details</CenteredSectionTitle>
        </AddressSectionWrapper>

        <AddressesWrapper>
          {form.addresses.map((address, index) => (
            <AddressCard key={index}>
              {form.addresses.length > 1 && (
                <RemoveAddressButton type="button" onClick={() => removeAddress(index)} title="Remove Address"> X </RemoveAddressButton>
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
