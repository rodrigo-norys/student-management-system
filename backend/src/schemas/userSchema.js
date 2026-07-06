// @ts-check
import * as yup from 'yup';

export const userValidationSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be at most 50 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    )
    .required('Password is required'),
});
