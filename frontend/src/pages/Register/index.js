import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { isEmail } from "validator";

import { Container, Form, Title } from "./styled";
import Loading from '../../components/Loading';
import * as actions from '../../store/modules/auth/actions.js';

export default function Register() {
  const dispatch = useDispatch();

  const id = useSelector(state => state.auth.user.id);
  const storedName = useSelector(state => state.auth.user.name);
  const storedEmail = useSelector(state => state.auth.user.email);
  const isLoading = useSelector(state => state.auth.isLoading);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  useEffect(() => {
    if (!id) return;
    setName(storedName);
    setEmail(storedEmail);
  }, [id, storedName, storedEmail]);

  async function handleSubmit(e) {
    e.preventDefault();
    let formErrors = false;

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('Invalid email');
    }
    if (!id && (password.length < 6 || password.length > 50)) {
      formErrors = true;
      toast.error('Password must be between 6 and 50 characters');
    }

    if (formErrors) return;

    dispatch(actions.registerRequest({ id, name, email, password }));
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Title>{id ? 'Edit account' : 'Create account'}</Title>

      <Form onSubmit={handleSubmit}>

        <label htmlFor="email">
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email"
            readOnly={!emailFocus}
            onFocus={() => setEmailFocus(true)}
          />
        </label>

        <label htmlFor="password">
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={id ? "Leave empty to keep current password" : "Your password"}
            readOnly={!passwordFocus}
            onFocus={() => setPasswordFocus(true)}
          />
        </label>

        <button type="submit"> {id ? 'Save Changes' : 'Create Account'} </button>
      </Form>
    </Container>
  );
}
