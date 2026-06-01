import { isEmail } from 'validator';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

// Valida o formulário do aluno e retorna um objeto de erros por campo.
// Erros de endereço são chaveados como `address_${index}_${field}`.
export function validateStudentForm(form) {
  const errors = {};
  const { name, last_name, email, cpf, birth_date } = form;

  if (name.length < 3 || name.length > 50) errors.name = 'Invalid name length';
  if (last_name.length < 3 || last_name.length > 100)
    errors.last_name = 'Invalid last name length';
  if (!isEmail(email)) errors.email = 'Invalid email';
  if (!cpfValidator.isValid(cpf)) errors.cpf = 'Invalid CPF';
  if (!birth_date) errors.birth_date = 'Required';

  form.addresses.forEach((addr, idx) => {
    if (addr.zip_code.replace(/\D/g, '').length !== 8)
      errors[`address_${idx}_zip_code`] = 'Invalid CEP';
    if (addr.street.length < 3) errors[`address_${idx}_street`] = 'Min 3 chars';
    if (!addr.number) errors[`address_${idx}_number`] = 'Required';
  });

  return errors;
}
