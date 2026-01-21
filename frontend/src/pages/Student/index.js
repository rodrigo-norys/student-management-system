import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserCircle, FaEdit } from 'react-icons/fa';

import PropTypes from 'prop-types';
import { isEmail } from 'validator';
import * as actions from '../../store/modules/student/actions.js';

import Loading from '../../components/Loading';

import { Container } from '../../styles/GlobalStyles';
import { Form, ActionsContainer, ProfilePicture, Title } from './styled';

export default function Student() {
  const [name, setName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  let [age, setAge] = useState('');
  let [weight, setWeight] = useState('');
  let [height, setHeight] = useState('');

  const dispatch = useDispatch();
  const { id } = useParams();
  const isLoading = useSelector(state => state.student.isLoading);
  const student = useSelector(state =>
    state.student.students.find(student => String(student.id) === String(id))
  );
  const studentPhoto = student?.Photos?.[0]?.url || '';

  useEffect(() => {
    if (!student) {
      dispatch(actions.getStudentsRequest());
    }
  }, [id, student, dispatch]);

  useEffect(() => {
    if (student) {
      setName(student.name);
      setLastName(student.last_name);
      setEmail(student.email);
      setAge(student.age);
      setWeight(student.weight);
      setHeight(student.height);
    }
  }, [student]);


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

    dispatch(actions.createStudentRequest({ id, name, last_name, email, age, weight, height, shouldRedirect }
    ));
  }

  // SUBMITTERS
  const foundStudent = id ?
    <>
      <button type='submit' name='stay'>Update & Stay</button>
      <button type='submit' name='leave'>Update & List</button>
    </> :
    <>
      <button type='submit' name='stay'>Create & Stay</button>
      <button type='submit' name='leave'>Create & List</button>
    </>

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>{id ? 'Edit Student' : 'Create Student'}</Title>
      <ProfilePicture>

        {studentPhoto ? (
          <img src={studentPhoto} alt="Student Photo" />
        ) : (
          <FaUserCircle size={180} />
        )}

        <Link to={`/photos/${id}`}>
          <FaEdit size={16} />
        </Link>
      </ProfilePicture>
      <Form onSubmit={handleSubmit}>
        <input type='text' value={name} onChange={e => setName(e.target.value)} placeholder='Name' />
        <input type='text' value={last_name} onChange={e => setLastName(e.target.value)} placeholder='Surname' />
        <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' />
        <input type='number' value={age} onChange={e => setAge(e.target.value)} placeholder='Age' />
        <input type='number' value={weight} onChange={e => setWeight(e.target.value)} placeholder='Weight (Use "." instead "," for decimal numbers)' />
        <input type='number' value={height} onChange={e => setHeight(e.target.value)} placeholder='Height (Use "." instead "," for decimal numbers)' />
        <ActionsContainer>
          {foundStudent}
        </ActionsContainer>
      </Form>
    </Container>
  );
};

Student.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
