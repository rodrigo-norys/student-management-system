import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaIdCard, FaMapMarkerAlt } from 'react-icons/fa';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import { TabContent, InfoGroup, Label, Value } from '../styled.js';

export default function GeneralTab() {
  const { id } = useParams();

  const student = useSelector(state =>
    state.student.students.find(student => String(student.id) === String(id))
  );

  if (!student) return <p>Loading student data...</p>;

  const sortedAddresses = student.addresses
    ? [...student.addresses].sort((a, b) => a.id - b.id)
    : [];

  const address = sortedAddresses[0] || {};

  return (
    <TabContent>
      <h3><FaUser /> Personal Information</h3>

      <InfoGroup>
        <div>
          <Label>Full Name</Label>
          <Value>{student.name} {student.last_name}</Value>
        </div>
        <div>
          <Label>Registration Number</Label>
          <Value>{student.registration_number}</Value>
        </div>
      </InfoGroup>

      <InfoGroup>
        <div>
          <Label><FaEnvelope /> Email</Label>
          <Value>{student.email}</Value>
        </div>
        <div>
          <Label><FaIdCard /> CPF</Label>
          <Value>{cpfValidator.format(student.cpf)}</Value>
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
        <p>No address registered for this student.</p>
      )}
    </TabContent>
  );
}
