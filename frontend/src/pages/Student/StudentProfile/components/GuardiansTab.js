import { FaUserShield, FaPhone, FaEnvelope } from 'react-icons/fa';
import * as Styled from '../styled';

export default function GuardiansTab({ student }) {
  const guardianList = student.guardians || [];

  return (
    <Styled.AddressGrid>
      {guardianList.length > 0 ? (
        guardianList.map((guardian, index) => (
          <Styled.ProfileAddressCard key={guardian.id}>
            <Styled.ProfileAddressCardHeader>
              <h3>Guardian #{index + 1}</h3>
            </Styled.ProfileAddressCardHeader>

            <Styled.StackedFields>
              <div>
                <Styled.Label>
                  <FaUserShield /> Full Name
                </Styled.Label>
                <Styled.Value>
                  {guardian.name} {guardian.last_name}
                </Styled.Value>
              </div>

              <div>
                <Styled.Label>
                  <FaPhone /> Phone
                </Styled.Label>
                <Styled.Value>{guardian.phone || 'N/A'}</Styled.Value>
              </div>

              {guardian.email && (
                <div>
                  <Styled.Label>
                    <FaEnvelope /> Email
                  </Styled.Label>
                  <Styled.Value>{guardian.email}</Styled.Value>
                </div>
              )}
            </Styled.StackedFields>
          </Styled.ProfileAddressCard>
        ))
      ) : (
        <Styled.EmptyStateText>
          No guardians registered for this student.
        </Styled.EmptyStateText>
      )}
    </Styled.AddressGrid>
  );
}
