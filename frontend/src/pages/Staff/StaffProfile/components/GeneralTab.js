import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaBriefcase,
  FaPhone,
} from 'react-icons/fa';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import * as Styled from '../styled';

export default function GeneralTab({ staff }) {
  return (
    <>
      <Styled.InfoGroup>
        <div>
          <Styled.Label>
            <FaUser /> Full Name
          </Styled.Label>
          <Styled.Value>{staff.full_name}</Styled.Value>
        </div>
        <div>
          <Styled.Label>
            <FaBriefcase /> Job Title
          </Styled.Label>
          <Styled.Value>{staff.job_title}</Styled.Value>
        </div>
      </Styled.InfoGroup>

      <Styled.InfoGroup>
        <div>
          <Styled.Label>
            <FaEnvelope /> Institutional Email
          </Styled.Label>
          <Styled.Value>{staff.email}</Styled.Value>
        </div>
        <div>
          <Styled.Label>Personal Email</Styled.Label>
          <Styled.Value>{staff.personal_email || 'N/A'}</Styled.Value>
        </div>
      </Styled.InfoGroup>

      <Styled.InfoGroup>
        <div>
          <Styled.Label>
            <FaIdCard /> CPF
          </Styled.Label>
          <Styled.Value>{cpfValidator.format(staff.cpf)}</Styled.Value>
        </div>
        <div>
          <Styled.Label>
            <FaPhone /> Phone Number
          </Styled.Label>
          <Styled.Value>{staff.phone}</Styled.Value>
        </div>
      </Styled.InfoGroup>
    </>
  );
}
