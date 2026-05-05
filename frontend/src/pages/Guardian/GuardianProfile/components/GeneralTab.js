import { FaUser, FaEnvelope, FaIdCard, FaPhone } from 'react-icons/fa';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import * as Styled from '../styled.js';

export default function GeneralTab({ guardian }) {
  return (
    <>
      <Styled.InfoGroup>
        <div>
          <Styled.Label>
            <FaUser /> Full Name
          </Styled.Label>
          <Styled.Value>
            {guardian.name} {guardian.last_name}
          </Styled.Value>
        </div>
        <div>
          <Styled.Label>
            <FaPhone /> Primary Phone
          </Styled.Label>
          <Styled.Value>{guardian.phone || 'Not informed'}</Styled.Value>
        </div>
      </Styled.InfoGroup>

      <Styled.InfoGroup>
        <div>
          <Styled.Label>
            <FaEnvelope /> Email Address
          </Styled.Label>
          <Styled.Value>{guardian.email}</Styled.Value>
        </div>
        <div>
          <Styled.Label>
            <FaIdCard /> CPF
          </Styled.Label>
          <Styled.Value>{cpfValidator.format(guardian.cpf)}</Styled.Value>
        </div>
      </Styled.InfoGroup>
    </>
  );
}
