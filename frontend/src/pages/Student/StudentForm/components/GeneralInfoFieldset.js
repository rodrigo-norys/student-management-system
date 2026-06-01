import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import * as Styled from '../styled';

export default function GeneralInfoFieldset({ form, errors, onChange }) {
  return (
    <Styled.Section>
      <Styled.SectionTitle>General Information</Styled.SectionTitle>
      <Styled.InputGroup>
        <Styled.ValidatedInput
          label="First Name"
          name="name"
          value={form.name}
          onChange={onChange}
          error={errors.name}
        />
        <Styled.ValidatedInput
          label="Last Name"
          name="last_name"
          value={form.last_name}
          onChange={onChange}
          error={errors.last_name}
        />
      </Styled.InputGroup>
      <Styled.InputGroup>
        <Styled.ValidatedInput
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          error={errors.email}
        />
        <Styled.ValidatedInput
          label="Registration"
          name="registration_number"
          value={form.registration_number}
          placeholder="Auto-generated"
          readOnly
        />
      </Styled.InputGroup>
      <Styled.InputGroup>
        <Styled.ValidatedInput
          label="CPF"
          name="cpf"
          value={cpfValidator.format(form.cpf)}
          onChange={onChange}
          error={errors.cpf}
        />
        <Styled.ValidatedInput
          label="Birth Date"
          type="date"
          name="birth_date"
          value={form.birth_date}
          onChange={onChange}
          error={errors.birth_date}
        />
      </Styled.InputGroup>
    </Styled.Section>
  );
}
