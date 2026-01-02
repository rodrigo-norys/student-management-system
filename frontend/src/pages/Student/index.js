import { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useDispatch, useSelector } from 'react-redux';

import { Container } from '../../styles/GlobalStyles';
import { Form, ActionsContainer } from './styled';
import * as actions from '../../store/modules/student/actions.js';

import Loading from '../../components/Loading';

export default function Student() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.student.isLoading);

  const [name, setName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  let [age, setAge] = useState('');
  let [weight, setWeight] = useState('');
  let [height, setHeight] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    let formErrors = false;

    const age2 = parseInt(age);
    age = age2;

    const weight2 = parseFloat(weight);
    weight = weight2;

    const height2 = parseFloat(height);
    height = height2;

    const shouldRedirect = e.nativeEvent.submitter.name === 'leave';

    const rules = [
      { condition: name.length < 3 || name.length > 50, message: 'Invalid name' },
      { condition: last_name.length < 3 || last_name.length > 50, message: 'Invalid surname' },
      { condition: !isEmail(email), message: 'Invalid email' },
      { condition: Number.isNaN(age) || (age < 5 || age > 80), message: 'Invalid age' },
      { condition: Number.isNaN(weight), message: 'Invalid weight' },
      { condition: Number.isNaN(height), message: 'Invalid height' },
    ]
    for (const rule of rules) {
      if (rule.condition) {
        formErrors = true;
        toast.error(rule.message);
      }
    }
    if (formErrors) return;

    dispatch(actions.createStudentRequest({ name, last_name, email, age, weight, height, shouldRedirect }
    ));
  }
  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>Student</h1>
      <Form onSubmit={handleSubmit}>
        <input type='text' value={name} onChange={e => setName(e.target.value)} placeholder='Name' />
        <input type='text' value={last_name} onChange={e => setLastName(e.target.value)} placeholder='Surname' />
        <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' />
        <input type='number' value={age} onChange={e => setAge(e.target.value)} placeholder='Age' />
        <input type='number' value={weight} onChange={e => setWeight(e.target.value)} placeholder='Weight (Use "." instead "," for decimal numbers)' />
        <input type='number' value={height} onChange={e => setHeight(e.target.value)} placeholder='Height (Use "." instead "," for decimal numbers)' />
        <ActionsContainer>
          <button type='submit' name='stay'>Create & Stay</button>
          <button type='submit' name='leave'>Create & List</button>
        </ActionsContainer>
      </Form>
    </Container>
  );
}
