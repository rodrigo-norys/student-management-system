import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { FaUserCircle, FaEdit } from 'react-icons/fa';

import * as actions from '../../store/modules/student/actions.js';
import Loading from '../../components/Loading';
import { Container, Title, Form, ProfilePicture, ActionsContainer, InputGroup, SectionTitle, Divider } from './styled';

export default function Student() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- REDUX SELECTORS ---
  const isLoading = useSelector(state => state.student.isLoading);
  const student = useSelector(state =>
    state.student.students.find(stud => String(stud.id) === String(id))
  );
  const addressSuggestion = useSelector(state => state.student.addressSuggestion);

  // --- STUDENTS STATE ---
  const [name, setName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [registration_number, setRegistrationNumber] = useState('');
  const [cpf, setCpf] = useState('');
  const [birth_date, setBirthDate] = useState('');
  const [avatar_url, setAvatarUrl] = useState('');
  const [blood_type, setBloodType] = useState('');
  const [medical_notes, setMedicalNotes] = useState('');

  // --- ADDRESSES STATE ---
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [addressState, setAddressState] = useState('');

  useEffect(() => {
    if (!id) return;

    if (!student) {
      dispatch(actions.getStudentsRequest(id));
      return;
    }

    setName(student.name || '');
    setLastName(student.last_name || '');
    setEmail(student.email || '');
    setRegistrationNumber(student.registration_number || '');
    setCpf(student.cpf || '');
    setBirthDate(student.birth_date ? student.birth_date.split('T')[0] : '');
    setAvatarUrl(student.avatar_url || '');
    setBloodType(student.blood_type || '');
    setMedicalNotes(student.medical_notes || '');

    const addrList = student.addresses
    if (addrList && addrList.length > 0) {
      const address = addrList[0];
      setCep(address.zip_code || '');
      setStreet(address.street || '');
      setNumber(address.number || '');
      setComplement(address.complement || '');
      setNeighborhood(address.neighborhood || '');
      setCity(address.city || '');
      setAddressState(address.state || '');
    }
  }, [id, student, dispatch]);

  useEffect(() => {
    if (addressSuggestion) {
      setStreet(addressSuggestion.street || '');
      setNeighborhood(addressSuggestion.neighborhood || '');
      setCity(addressSuggestion.city || '');
      setAddressState(addressSuggestion.state || '');
    }
  }, [addressSuggestion]);

  // --- HANDLERS ---
  const handleCepChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCep(value);
    if (value.length === 8) {
      dispatch(actions.getCepRequest(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = false;

    const shouldLeave = e.nativeEvent.submitter?.name === 'leave';
    const shouldStay = e.nativeEvent.submitter?.name === 'stay';

    const rules = [
      { condition: name.length < 3 || name.length > 50, message: 'Name must be between 3 and 50 characters' },
      { condition: last_name.length < 3 || last_name.length > 100, message: 'Last name must be between 3 and 100 characters' },
      { condition: !isEmail(email), message: 'Invalid email address' },
      { condition: !registration_number, message: 'Registration number is required.' },
      { condition: cpf.replace(/\D/g, '').length !== 11, message: 'CPF must contain 11 digits' },
      { condition: !birth_date, message: 'Please provide a birth date' },

      { condition: cep.replace(/\D/g, '').length !== 8, message: 'Invalid CEP. Must contain 8 digits.' },
      { condition: street.length < 3, message: 'Street must have at least 3 characters.' },
      { condition: !number, message: 'House/Building number is required.' },
      { condition: neighborhood.length < 2, message: 'Neighborhood is required.' },
      { condition: city.length < 2, message: 'City is required.' },
      { condition: addressState.length !== 2, message: 'State (UF) must be 2 characters.' },
    ];

    rules.forEach(rule => {
      if (rule.condition) {
        formErrors = true;
        toast.error(rule.message);
      }
    });

    if (formErrors) return;

    dispatch(actions.createStudentRequest({
      id, name,last_name,email,registration_number,
      cpf,birth_date,avatar_url,blood_type,medical_notes,

      zip_code: cep,street,number,complement,
      neighborhood,city,state: addressState,

      shouldLeave,shouldStay
    }));
  };

  const mainPhoto = `${process.env.REACT_APP_API_URL}/images/${avatar_url}`;

  const bloodTypes = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];

  const UFs = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const renderButtons = id ? (
    <>
      <button type="submit">Update & Finish</button>
      <button type="submit" name="leave">Update & New</button>
      <button
        type="button"
        onClick={() => navigate(`/student/${id}/`)}
        style={{ background: '#666' }}
      >
        View Profile
      </button>
    </>
  ) : (
    <>
      <button type="submit" name="stay">Save & New</button>
      <button type="submit" name="leave">Save & Finish</button>
    </>
  );

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>{id ? 'Edit Student' : 'Create Student'}</Title>

      {id && (
        <ProfilePicture>
          {avatar_url ? (
            <img src={mainPhoto} alt={name} />
          ) : (
            <FaUserCircle size={150} color="#ddd" />
          )}
          <Link to={`/avatar/${id}`}>
            <FaEdit size={20} />
          </Link>
        </ProfilePicture>
      )}

      <Form onSubmit={handleSubmit}>
        <SectionTitle>Personal Data</SectionTitle>
        <InputGroup>
          <label>First Name
            <input type='text' value={name} onChange={e => setName(e.target.value)} placeholder='Ex: Rodrigo' />
          </label>
          <label>Last Name
            <input type='text' value={last_name} onChange={e => setLastName(e.target.value)} placeholder='Ex: Norys' />
          </label>
        </InputGroup>

        <label>Email Address
          <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='rodrigo@exemplo.com' />
        </label>

        <InputGroup>
          <label>Registration
            <input type='text' value={registration_number} onChange={e => setRegistrationNumber(e.target.value)} />
          </label>
          <label>CPF
            <input type='text' value={cpf} onChange={e => setCpf(e.target.value)} />
          </label>
        </InputGroup>

        <InputGroup>
          <label>Birth Date
            <input type='date' value={birth_date} onChange={e => setBirthDate(e.target.value)} />
          </label>

          <label>Blood Type
            <select value={blood_type} onChange={e => setBloodType(e.target.value)}>
              <option value="">Select</option>
              {bloodTypes.map(blood => (
                <option key={blood} value={blood}>{blood}</option>
              ))}
            </select>
          </label>
        </InputGroup>

        <label>Medical Notes
          <textarea value={medical_notes} onChange={e => setMedicalNotes(e.target.value)} />
        </label>

        <Divider />
        <SectionTitle>Address Details</SectionTitle>

        {/* ZIP CODE & STREET */}
        <InputGroup>
          <label style={{ flex: 1 }}>Zip Code
            <input type='text' value={cep} onChange={handleCepChange} maxLength="8" placeholder="00000000" />
          </label>
          <label style={{ flex: 3 }}>Street
            <input type='text' value={street} onChange={e => setStreet(e.target.value)} />
          </label>
        </InputGroup>

        {/* NUMBER & COMPLEMENT */}
        <InputGroup>
          <label style={{ flex: 1 }}>Number
            <input type='text' value={number} onChange={e => setNumber(e.target.value)} />
          </label>
          <label style={{ flex: 2 }}>Complement
            <input type='text' value={complement} onChange={e => setComplement(e.target.value)} />
          </label>
        </InputGroup>

        {/* NEIGHBOR, CITY & UF */}
        <InputGroup>
          <label style={{ flex: 2 }}>Neighborhood
            <input type='text' value={neighborhood} onChange={e => setNeighborhood(e.target.value)} />
          </label>

          <label style={{ flex: 2 }}>City
            <input type='text' value={city} onChange={e => setCity(e.target.value)} />
          </label>

          <label style={{ flex: 0.6 }}>UF
            <select value={addressState} onChange={e => setAddressState(e.target.value)}>
              <option value="">Select</option>
              {UFs.map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </label>
        </InputGroup>

        <ActionsContainer>
          {renderButtons}
        </ActionsContainer>
      </Form>
    </Container>
  );
}
