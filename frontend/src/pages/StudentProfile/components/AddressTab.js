import React from 'react';
import { FaMapMarkerAlt, FaCity, FaRoad } from 'react-icons/fa';
import { TabContent, AddressCard, AddressGrid, Label, Value } from '../styled';

export default function AddressTab({ student }) {
  if (!student) return null;

  const addressList = student.addresses || [];

  return (
    <TabContent>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <FaMapMarkerAlt color="#3f51b5" /> Registered Addresses
      </h2>

      {addressList.length > 0 ? (
        <AddressGrid>
          {addressList.map((addr, index) => (
            <AddressCard key={addr.id}>
              <div className="card-header">
                <h3>Address {index + 1}</h3>
              </div>

              <div className="card-body">
                <div>
                  <Label><FaRoad /> Street Address</Label>
                  <Value>{addr.street}, {addr.number}</Value>
                </div>

                {addr.complement && (
                  <div>
                    <Label>Complement</Label>
                    <Value>{addr.complement}</Value>
                  </div>
                )}

                <div>
                  <Label><FaCity /> Neighborhood / City</Label>
                  <Value>{addr.neighborhood} - {addr.city} / {addr.state}</Value>
                </div>

                <div>
                  <Label>Zip Code</Label>
                  <Value>{addr.zip_code}</Value>
                </div>
              </div>
            </AddressCard>
          ))}
        </AddressGrid>
      ) : (
        <p>No addresses registered for this student.</p>
      )}
    </TabContent>
  );
}
