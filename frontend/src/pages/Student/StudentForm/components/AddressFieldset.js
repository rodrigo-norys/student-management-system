import { BRAZILIAN_STATES as UFs } from 'constants/location';

import * as Styled from '../styled';

export default function AddressFieldset({
  address,
  index,
  errors,
  onAddressChange,
  onCepChange,
  onRemove,
  showRemove,
}) {
  return (
    <Styled.AddressCard>
      <Styled.AddressCardHeader>
        <h4>Address #{index + 1}</h4>
        {showRemove && (
          <Styled.RemoveAddressButton type="button" onClick={onRemove}>
            Remove
          </Styled.RemoveAddressButton>
        )}
      </Styled.AddressCardHeader>
      <Styled.InputGroup>
        <Styled.ValidatedInput
          label="Zip Code"
          name="zip_code"
          value={address.zip_code}
          onChange={onCepChange}
          error={errors[`address_${index}_zip_code`]}
        />
        <Styled.ValidatedInput
          label="Street"
          name="street"
          value={address.street}
          onChange={onAddressChange}
          error={errors[`address_${index}_street`]}
        />
      </Styled.InputGroup>
      <Styled.InputGroup>
        <Styled.ValidatedInput
          label="Number"
          name="number"
          value={address.number}
          onChange={onAddressChange}
          error={errors[`address_${index}_number`]}
        />
        <Styled.ValidatedInput
          label="Complement"
          name="complement"
          value={address.complement}
          onChange={onAddressChange}
        />
      </Styled.InputGroup>
      <Styled.InputGroup>
        <Styled.ValidatedInput
          label="Neighborhood"
          name="neighborhood"
          value={address.neighborhood}
          onChange={onAddressChange}
        />
        <Styled.ValidatedInput
          label="City"
          name="city"
          value={address.city}
          onChange={onAddressChange}
        />
        <Styled.ValidatedSelect
          label="UF"
          name="state"
          value={address.state}
          onChange={onAddressChange}
          array={UFs}
        />
      </Styled.InputGroup>
    </Styled.AddressCard>
  );
}
