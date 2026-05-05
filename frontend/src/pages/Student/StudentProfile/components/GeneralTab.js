import { FaUser, FaEnvelope, FaIdCard } from 'react-icons/fa';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import * as Styled from '../styled';

export default function GeneralTab({ student }) {
  return (
    <>
      <Styled.InfoGroup>
        <div>
          <Styled.Label>
            <FaUser /> Full Name
          </Styled.Label>
          <Styled.Value>
            {student.name} {student.last_name}
          </Styled.Value>
        </div>
        <div>
          <Styled.Label>Registration Number</Styled.Label>
          <Styled.Value>{student.registration_number}</Styled.Value>
        </div>
      </Styled.InfoGroup>

      <Styled.InfoGroup>
        <div>
          <Styled.Label>
            <FaEnvelope /> Email Address
          </Styled.Label>
          <Styled.Value>{student.email}</Styled.Value>
        </div>
        <div>
          <Styled.Label>
            <FaIdCard /> CPF
          </Styled.Label>
          <Styled.Value>{cpfValidator.format(student.cpf)}</Styled.Value>
        </div>
      </Styled.InfoGroup>
    </>
  );
}
