import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import axios from 'services/axios';
import Loading from 'components/Loading';

import { Container } from 'styles/GlobalStyles';
import { SetupWrapper, Form, Title, PasswordRules, InputContainer } from './styled';

export default function SetupPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasErrors = false;

    if (password.length < 6 || password.length > 50) {
      hasErrors = true;
      toast.error('Password must be between 6 and 50 characters');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/;

    if (!passwordRegex.test(password)) {
      hasErrors = true;
      toast.error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    } else if (password !== confirmPassword) {
      hasErrors = true;
      toast.error('Passwords do not match');
    }

    if (hasErrors) return;

    try {
      setIsLoading(true);
      await axios.put('/users/setup-password', { password });

      toast.success('Password updated successfully');
      navigate('/');
    } catch (error) {
      const errors = get(error, 'response.data.errors', []);
      const status = get(error, 'response.status', 0);

      if (status === 401) {
        toast.error('Session expired or unauthorized. Please login again.');
        navigate('/login');
      } else if (errors.length > 0) {
        errors.forEach(err => toast.error(err));
      } else {
        toast.error('Unknown error updating password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SetupWrapper>
      <Container>
        <Loading isLoading={isLoading} />
        <Title>Setup New Password</Title>

        <Form onSubmit={handleSubmit}>

          <InputContainer>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
            />
            {showPassword ? (
              <FaEyeSlash size={18} onClick={() => setShowPassword(false)} />
            ) : (
              <FaEye size={18} onClick={() => setShowPassword(true)} />
            )}
          </InputContainer>

          <InputContainer>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
            {showConfirmPassword ? (
              <FaEyeSlash size={18} onClick={() => setShowConfirmPassword(false)} />
            ) : (
              <FaEye size={18} onClick={() => setShowConfirmPassword(true)} />
            )}
          </InputContainer>

          <PasswordRules>
            <li>Minimum 6 and maximum 50 characters</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one number</li>
            <li>At least one special character (@$!%*?&#)</li>
          </PasswordRules>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Password'}
          </button>
        </Form>
      </Container>
    </SetupWrapper>
  );
}
