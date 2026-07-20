import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { isEmail } from 'validator';
import { cnpj as cnpjValidator } from 'cpf-cnpj-validator';

import Loading from 'components/Loading';

import * as actions from 'store/modules/unit/actions';

import { BRAZILIAN_STATES as UFs } from 'constants/location';
import { maskCEP, maskPhone } from 'utils/masks';

import { UNIT_STATUS, UNIT_STATUS_OPTIONS } from '../constants';
import { INITIAL_STATE } from './constants';

import * as Styled from './styled';

export default function UnitForm() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stayOnPage, setStayOnPage] = useState(false);

  const { isLoading = false } = useSelector((state) => state.unit || {});

  const unit = useSelector((state) =>
    state.unit?.units?.find((u) => String(u.id) === String(id)),
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
    if (!unit) {
      dispatch(actions.getUnitsRequest(id));
      return;
    }

    setForm({
      name: unit.name || '',
      cnpj: unit.cnpj || '',
      email: unit.email || '',
      phone: unit.phone || '',
      status: unit.status || UNIT_STATUS.ACTIVE,
      address: { ...INITIAL_STATE.address, ...(unit.address || {}) },
    });
  }, [id, unit, dispatch]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cnpj') value = value.replace(/\D/g, '');
    if (name === 'phone') value = maskPhone(value);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleCepChange = (e) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, zip_code: maskCEP(e.target.value) },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const { name, cnpj, email, phone, address } = form;

    if (name.length < 3 || name.length > 50)
      newErrors.name = 'Name must be between 3 and 50 characters';
    if (!cnpjValidator.isValid(cnpj)) newErrors.cnpj = 'Invalid CNPJ';
    if (!isEmail(email)) newErrors.email = 'Invalid email';
    if (phone.replace(/\D/g, '').length < 10)
      newErrors.phone = 'Invalid phone number';

    if (address.zip_code.replace(/\D/g, '').length !== 8)
      newErrors.address_zip_code = 'Invalid CEP';
    if (address.street.length < 3) newErrors.address_street = 'Min 3 chars';
    if (!address.number) newErrors.address_number = 'Required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    const payload = { ...form, shouldLeave: !stayOnPage };
    dispatch(
      id
        ? actions.updateUnitRequest({ id, ...payload })
        : actions.createUnitRequest(payload),
    );
  };

  return (
    <Styled.PageContainer>
      <Loading isLoading={isLoading} />
      <Styled.HeaderContent>
        <h1>{id ? 'Edit Unit' : 'New Unit'}</h1>
      </Styled.HeaderContent>

      <Styled.Form onSubmit={handleSubmit}>
        <Styled.Section>
          <Styled.SectionTitle>General Information</Styled.SectionTitle>
          <Styled.InputGroup>
            <Styled.ValidatedInput
              label="Unit Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Styled.ValidatedInput
              label="CNPJ"
              name="cnpj"
              value={form.cnpj ? cnpjValidator.format(form.cnpj) : ''}
              onChange={handleChange}
              error={errors.cnpj}
              placeholder="00.000.000/0000-00"
            />
          </Styled.InputGroup>
          <Styled.InputGroup>
            <Styled.ValidatedInput
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Styled.ValidatedInput
              label="Contact Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="(00) 00000-0000"
            />
          </Styled.InputGroup>
          {id && (
            <Styled.InputGroup>
              <Styled.ValidatedSelect
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                array={UNIT_STATUS_OPTIONS}
              />
            </Styled.InputGroup>
          )}
        </Styled.Section>

        <Styled.Section>
          <Styled.SectionTitle>Address</Styled.SectionTitle>
          <Styled.InputGroup>
            <Styled.ValidatedInput
              label="Zip Code"
              name="zip_code"
              value={form.address.zip_code}
              onChange={handleCepChange}
              error={errors.address_zip_code}
            />
            <Styled.ValidatedInput
              label="Street"
              name="street"
              value={form.address.street}
              onChange={handleAddressChange}
              error={errors.address_street}
            />
          </Styled.InputGroup>
          <Styled.InputGroup>
            <Styled.ValidatedInput
              label="Number"
              name="number"
              value={form.address.number}
              onChange={handleAddressChange}
              error={errors.address_number}
            />
            <Styled.ValidatedInput
              label="Complement"
              name="complement"
              value={form.address.complement}
              onChange={handleAddressChange}
            />
          </Styled.InputGroup>
          <Styled.InputGroup>
            <Styled.ValidatedInput
              label="Neighborhood"
              name="neighborhood"
              value={form.address.neighborhood}
              onChange={handleAddressChange}
            />
            <Styled.ValidatedInput
              label="City"
              name="city"
              value={form.address.city}
              onChange={handleAddressChange}
            />
            <Styled.ValidatedSelect
              label="UF"
              name="state"
              value={form.address.state}
              onChange={handleAddressChange}
              array={UFs}
            />
          </Styled.InputGroup>
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
            {id ? 'Update Unit' : 'Save Unit'}
          </Styled.PrimaryButton>
        </Styled.ActionsContainer>
      </Styled.Form>
    </Styled.PageContainer>
  );
}
