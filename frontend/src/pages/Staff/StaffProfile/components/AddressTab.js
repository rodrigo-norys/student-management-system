import { FaCity, FaRoad, FaFingerprint } from 'react-icons/fa';
import * as Styled from '../styled';

export default function AddressTab({ staff }) {
  const addressList = staff.addresses || [];

  return (
    <Styled.AddressGrid>
      {addressList.length > 0 ? (
        addressList.map((address, index) => (
          <Styled.InfoCard key={address.id}>
            <Styled.InfoCardHeader>
              <h3>Location #{index + 1}</h3>
            </Styled.InfoCardHeader>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
            >
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
            </div>
          </Styled.InfoCard>
        ))
      ) : (
        <Styled.EmptyMessage>
          No addresses registered for this staff member.
        </Styled.EmptyMessage>
      )}
    </Styled.AddressGrid>
  );
}
