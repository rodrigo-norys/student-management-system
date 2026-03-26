import React from 'react';
import { FaMapMarkerAlt, FaCity, FaRoad } from 'react-icons/fa';
import { TabContent, AddressCard, AddressGrid, Label, Value } from '../styled';

export default function AddressTab({ staffMember }) {
  if (!staffMember) return null;

  const addressList = staffMember.addresses || [];

  return (
    <TabContent>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <FaMapMarkerAlt color="#3f51b5" /> Registered Addresses
      </h2>

      {addressList.length > 0 ? (
        <AddressGrid>
          {addressList.map((address, index) => (
            <AddressCard key={address.id}>
              <div className="card-header">
                <h3>Address {index + 1}</h3>
              </div>

              <div className="card-body">
                <div>
                  <Label><FaRoad /> Street Address</Label>
                  <Value>{address.street}, {address.number}</Value>
                </div>

                {address.complement && (
                  <div>
                    <Label>Complement</Label>
                    <Value>{address.complement}</Value>
                  </div>
                )}

                <div>
                  <Label><FaCity /> Neighborhood / City</Label>
                  <Value>{address.neighborhood} - {address.city} / {address.state}</Value>
                </div>

                <div>
                  <Label>Zip Code</Label>
                  <Value>{address.zip_code}</Value>
                </div>
              </div>
            </AddressCard>
          ))}
        </AddressGrid>
      ) : (
        <p>No addresses registered for this staff member.</p>
      )}
    </TabContent>
  );
}
