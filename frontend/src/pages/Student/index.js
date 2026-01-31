import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { FaUserCircle, FaEdit } from 'react-icons/fa';

import * as actions from '../../store/modules/student/actions.js';

import Loading from '../../components/Loading';

import { Container, Title, Form, ProfilePicture, ActionsContainer, InputGroup } from './styled';

export default function Student() {
  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.student.isLoading);

  const student = useSelector(state =>
    state.student.students.find(stud => String(stud.id) === String(id))
  );

  const [photo, setPhoto] = useState('');
  const [name, setName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');


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

      const photoData = get(student, 'Photos', '');
      if (photoData) {
        setPhoto(get(photoData, '[0].url', ''));
      }
    }
  }, [student]);

  function handleSubmit(e) {
    e.preventDefault();
    let formErrors = false;

    const shouldLeave = e.nativeEvent.submitter.name === 'leave';
    const shouldStay = e.nativeEvent.submitter.name === 'stay';

    const rules = [
      { condition: name.length < 3 || name.length > 20, message: 'Invalid name' },
      { condition: last_name.length < 3 || last_name.length > 30, message: 'Invalid surname' },
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

    dispatch(actions.createStudentRequest({ id,  name, last_name, email, age, weight, height, shouldLeave, shouldStay, navigate }
    ));
  }

  // SUBMITTERS
  const foundStudent = id ?
    <>
      <button type='submit'>Update & Stay</button>
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

      {id ? (
        <ProfilePicture>
          {photo ? (
            <img src={photo} alt="" />
          ) : (
            <FaUserCircle size={150} color="#ddd" />
          )}

          <Link to={`/photos/${id}`}>
            <FaEdit size={20} />
          </Link>
        </ProfilePicture>
      ) : ''}

      <Form onSubmit={handleSubmit}>

        <label>
          First Name
          <input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='José'
          />
        </label>

        <label>
          Last Name
          <input
            type='text'
            value={last_name}
            onChange={e => setLastName(e.target.value)}
            placeholder='Silva'
          />
        </label>

        <label>
          Email Address
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='jose@example.com'
          />
        </label>

        <InputGroup>
          <label>
            Age
            <input
              type='number'
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder='25'
            />
          </label>

          <label>
            Weight (kg)
            <input
              type='number'
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder='80.5'
            />
          </label>

          <label>
            Height (m)
            <input
              type='number'
              value={height}
              onChange={e => setHeight(e.target.value)}
              placeholder='1.75'
            />
          </label>
        </InputGroup>

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
