import { FaCity, FaRoad, FaFingerprint } from 'react-icons/fa';
import * as Styled from '../styled.js';

export default function AddressTab({ guardian }) {
  const addressList = guardian.addresses || [];

  return (
    <Styled.AddressGrid>
      {addressList.length > 0 ? (
        addressList.map((address, index) => (
          <Styled.AddressCard key={address.id}>
            <Styled.AddressCardHeader>
              <h3>Location #{index + 1}</h3>
            </Styled.AddressCardHeader>
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
          </Styled.AddressCard>
        ))
      ) : (
        <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
          No addresses registered for this guardian.
        </p>
      )}
    </Styled.AddressGrid>
  );
}
