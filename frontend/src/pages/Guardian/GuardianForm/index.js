import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { FaUserCircle, FaEdit, FaPlus } from 'react-icons/fa';
import { isEmail } from 'validator';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import Loading from 'components/Loading';
import { ValidatedInput, ValidatedSelect } from 'components/ui';

import * as actions from 'store/modules/guardian/actions';

import { BRAZILIAN_STATES as UFs, EMPTY_ADDRESS } from 'constants/location';
import { maskCEP, maskPhone } from 'utils/masks';

import { getGuardianImageUrl } from '../constants';
import { INITIAL_STATE } from './constants';

import * as Styled from './styled';
import { PageContainer } from 'components/ui';

export default function GuardianForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [form, setForm] = useState(INITIAL_STATE);
  const [activeAddressIndex, setActiveAddressIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stayOnPage, setStayOnPage] = useState(false);

  const { isLoading = false, addressSuggestion = null } = useSelector(
    (state) => state.guardian || {},
  );

  const guardian = useSelector((state) =>
    state.guardian?.guardians?.find((g) => String(g.id) === String(id)),
  );

  const mainPhoto = getGuardianImageUrl(form.avatar_url);

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
    if (!guardian) {
      dispatch(actions.getGuardiansRequest(id));
      return;
    }

    let addressList =
      guardian.addresses && guardian.addresses.length > 0
        ? [...guardian.addresses]
        : [{ ...EMPTY_ADDRESS }];

    addressList.sort((a, b) => (a.id || Infinity) - (b.id || Infinity));

    setForm({
      name: guardian.name || '',
      last_name: guardian.last_name || '',
      email: guardian.email || '',
      cpf: guardian.cpf || '',
      phone: guardian.phone || '',
      avatar_url: guardian.avatar_url || '',
      addresses: addressList,
    });
  }, [id, guardian, dispatch]);

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
    if (name === 'phone') value = maskPhone(value);
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
    const { name, last_name, email, cpf, phone } = form;

    if (name.length < 3 || name.length > 50)
      newErrors.name = 'Invalid name length';
    if (last_name.length < 3 || last_name.length > 50)
      newErrors.last_name = 'Invalid last name length';
    if (!isEmail(email)) newErrors.email = 'Invalid email';
    if (!cpfValidator.isValid(cpf)) newErrors.cpf = 'Invalid CPF';
    if (phone.replace(/\D/g, '').length < 10)
      newErrors.phone = 'Invalid phone number';

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
    const payload = { ...form, shouldLeave: !stayOnPage };
    dispatch(
      id
        ? actions.updateGuardianRequest({ id, ...payload })
        : actions.createGuardianRequest(payload),
    );
  };

  return (
    <PageContainer>
      <Loading isLoading={isLoading} />
      <Styled.HeaderContent>
        <h1>{id ? 'Edit Guardian' : 'New Guardian'}</h1>
        {id && (
          <Styled.PrimaryButton as={Link} to={`/guardian/${id}`}>
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
                {form.avatar_url ? (
                  <img src={mainPhoto} alt={form.name} />
                ) : (
                  <FaUserCircle size={150} color="#323245" />
                )}
                <Link to={id ? `/avatar/guardians/${id}` : '#'}>
                  <FaEdit size={20} />
                </Link>
              </Styled.ProfilePicture>
              <Styled.InputGroup>
                <ValidatedInput
                  label="Contact Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="(00) 00000-0000"
                />
              </Styled.InputGroup>
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
                  label="Email Address"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                <ValidatedInput
                  label="CPF"
                  name="cpf"
                  value={cpfValidator.format(form.cpf)}
                  onChange={handleChange}
                  error={errors.cpf}
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
                {id ? 'Update Guardian' : 'Save Guardian'}
              </Styled.PrimaryButton>
            </Styled.ActionsContainer>
          </Styled.MainContent>
        </Styled.FormGrid>
      </Styled.Form>
    </PageContainer>
  );
}
