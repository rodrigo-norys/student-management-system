import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';

import * as actions from '../../store/modules/auth/actions';
import { Container } from '../../styles/GlobalStyles';
import { LoginWrapper, Form, Title } from './styled';
import Loading from '../../components/Loading';

export default function Login() {
  const dispatch = useDispatch();
  const { isLoading = false } = useSelector((state) => state.auth || {});

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasErrors = false;

    if (!isEmail(email)) {
      hasErrors = true;
      toast.error('Invalid email');
    }

    if (password.length < 6 || password.length > 50) {
      hasErrors = true;
      toast.error('Invalid password');
    }

    if (hasErrors) return;

    dispatch(actions.loginRequest({ email, password }));
  };

  return (
    <LoginWrapper>
      <Container>
        <Loading isLoading={isLoading} />
        <Title>Login</Title>

        <Form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </Form>
      </Container>
    </LoginWrapper>
  );
}
