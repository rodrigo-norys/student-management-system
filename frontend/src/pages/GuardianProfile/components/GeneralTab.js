import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { TabContent, InfoGroup, Label, Value } from '../styled.js';

export default function GeneralTab() {
  const { id } = useParams();
  const guardian = useSelector(state =>
    state.guardian.guardians.find(g => String(g.id) === String(id))
  );

  if (!guardian) return <p>Loading guardian data...</p>;

  const sortedAddresses = guardian.addresses
    ? [...guardian.addresses].sort((a, b) => a.id - b.id)
    : [];
  const address = sortedAddresses[0] || {};

  return (
    <TabContent>
      <h3><FaUser /> Personal Information</h3>
      <InfoGroup>
        <div>
          <Label>Full Name</Label>
          <Value>{guardian.name} {guardian.last_name}</Value>
        </div>
        <div>
          <Label><FaPhone /> Phone</Label>
          <Value>{guardian.phone || 'Not informed'}</Value>
        </div>
      </InfoGroup>
      <InfoGroup>
        <div>
          <Label><FaEnvelope /> Email</Label>
          <Value>{guardian.email}</Value>
        </div>
        <div>
          <Label><FaIdCard /> CPF</Label>
          <Value>{cpfValidator.format(guardian.cpf)}</Value>
        </div>
      </InfoGroup>

      <h3><FaMapMarkerAlt /> Primary Address</h3>
      {sortedAddresses.length > 0 ? (
        <InfoGroup>
          <div>
            <Label>Street</Label>
            <Value>{address.street}, {address.number}</Value>
          </div>
          <div>
            <Label>Neighborhood</Label>
            <Value>{address.neighborhood}</Value>
          </div>
          <div>
            <Label>City/State</Label>
            <Value>{address.city} - {address.state}</Value>
          </div>
        </InfoGroup>
      ) : (
        <p className="no-data">No address registered for this guardian.</p>
      )}
    </TabContent>
  );
}
