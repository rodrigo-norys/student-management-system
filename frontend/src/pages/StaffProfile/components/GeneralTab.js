import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaBriefcase, FaPhone } from 'react-icons/fa';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import { TabContent, InfoGroup, Label, Value } from '../styled.js';

export default function GeneralTab() {
  const { id } = useParams();

  const staffMember = useSelector(state =>
    state.staff.staff.find(item => String(item.id) === String(id))
  );

  if (!staffMember) return <p>Loading staff member data...</p>;

  const sortedAddresses = staffMember.addresses
    ? [...staffMember.addresses].sort((a, b) => a.id - b.id)
    : [];

  const address = sortedAddresses[0] || {};

  return (
    <TabContent>
      <h3><FaUser /> Personal & Professional Information</h3>
      <InfoGroup>
        <div>
          <Label>Full Name</Label>
          <Value>{staffMember.full_name}</Value>
        </div>
        <div>
          <Label><FaBriefcase /> Job Title</Label>
          <Value>{staffMember.job_title}</Value>
        </div>
      </InfoGroup>

      <InfoGroup>
        <div>
          <Label><FaEnvelope /> Institutional Email</Label>
          <Value>{staffMember.email}</Value>
        </div>
        <div>
          <Label>Personal Email</Label>
          <Value>{staffMember.personal_email}</Value>
        </div>
      </InfoGroup>

      <InfoGroup>
        <div>
          <Label><FaIdCard /> CPF</Label>
          <Value>{cpfValidator.format(staffMember.cpf)}</Value>
        </div>
        <div>
          <Label><FaPhone /> Phone</Label>
          <Value>{staffMember.phone}</Value>
        </div>
      </InfoGroup>

      <hr />

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
        <p>No address registered for this staff member.</p>
      )}
    </TabContent>
  );
}
