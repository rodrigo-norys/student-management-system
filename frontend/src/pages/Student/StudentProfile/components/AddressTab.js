import { FaCity, FaRoad, FaFingerprint } from 'react-icons/fa';
import * as Styled from '../styled';

export default function AddressTab({ student }) {
  const addressList = student.addresses || [];

  return (
    <Styled.AddressGrid>
      {addressList.length > 0 ? (
        addressList.map((address, index) => (
          <Styled.ProfileAddressCard key={address.id}>
            <Styled.ProfileAddressCardHeader>
              <h3>Location #{index + 1}</h3>
            </Styled.ProfileAddressCardHeader>

            <Styled.StackedFields>
              <div>
                <Styled.Label>
                  <FaRoad /> Street & Number
                </Styled.Label>
                <Styled.Value>
                  {address.street}, {address.number}
                </Styled.Value>
              </div>

              {address.complement && (
                <div>
                  <Styled.Label>Complement</Styled.Label>
                  <Styled.Value>{address.complement}</Styled.Value>
                </div>
              )}

              <div>
                <Styled.Label>
                  <FaCity /> Neighborhood / City
                </Styled.Label>
                <Styled.Value>
                  {address.neighborhood} - {address.city} / {address.state}
                </Styled.Value>
              </div>

              <div>
                <Styled.Label>
                  <FaFingerprint /> Zip Code
                </Styled.Label>
                <Styled.Value>{address.zip_code}</Styled.Value>
              </div>
            </Styled.StackedFields>
          </Styled.ProfileAddressCard>
        ))
      ) : (
        <Styled.EmptyStateText>
          No addresses registered for this student.
        </Styled.EmptyStateText>
      )}
    </Styled.AddressGrid>
  );
}
