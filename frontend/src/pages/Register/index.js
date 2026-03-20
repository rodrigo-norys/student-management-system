import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { isEmail } from "validator";

import * as actions from '../../store/modules/auth/actions.js';
import * as studentActions from '../../store/modules/student/actions.js';
import { Container, Form, Title } from "./styled";
import Loading from '../../components/Loading';

export default function UserManager() {
  const dispatch = useDispatch();

  const { students = [] } = useSelector(state => state.student || {});
  const { isLoading = false } = useSelector(state => state.auth || {});

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [targetUserId, setTargetUserId] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessLevel, setAccessLevel] = useState('5');

  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  // Busca inicial dos estudantes
  useEffect(() => {
    dispatch(studentActions.getStudentsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedStudentId) {
      setTargetUserId(null);
      setEmail('');
      setAccessLevel('5');
      setPassword('');
      return;
    }

    const student = students.find(stud => String(stud.id) === String(selectedStudentId));

    if (student?.user) {
      setTargetUserId(student.user.id);
      setEmail(student.email);
      setAccessLevel(String(student.user.access_level_id));
    } else {
      setTargetUserId(null);
      setEmail('');
      setAccessLevel('5');
    }

    setPassword('');
  }, [selectedStudentId, students]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validations = [
      { condition: !selectedStudentId, message: 'Please select a person first!' },
      { condition: !isEmail(email), message: 'Invalid email' },
      { condition: !targetUserId && (password.length < 6 || password.length > 50), message: 'Password must be between 6 and 50 characters' },
      { condition: !accessLevel, message: 'Please select an access level' },
    ];

    const error = validations.find(rule => rule.condition);

    if (error) {
      toast.error(error.message);
      return;
    }

    dispatch(actions.registerRequest({
      id: targetUserId,
      email,
      password,
      student_id: selectedStudentId,
      access_level_id: Number(accessLevel),
    }));
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Title>Access Management</Title>

      <Form onSubmit={handleSubmit}>
        <label htmlFor="personSelect">
          Select Student
          <select
            id="personSelect"
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
          >
            <option value="">-- Select a student --</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} {student.last_name}
              </option>
            ))}
          </select>
        </label>

        {selectedStudentId && (
          <>
            <div style={{ margin: '15px 0', color: '#666', fontSize: '14px' }}>
              <strong>Status:</strong> {targetUserId ? '🟢 Edit Mode' : '🔵 Creation Mode'}
            </div>

            <label htmlFor="accessLevel">
              Access Level
              <select
                id="accessLevel"
                value={accessLevel}
                onChange={e => setAccessLevel(e.target.value)}
              >
                <option value="1">1 - Full Access (System Owner)</option>
                <option value="2">2 - Technical Admin (IT Support)</option>
                <option value="3">3 - Finance Admin (Billing/Payments)</option>
                <option value="4">4 - Academic Admin (Pedagogical)</option>
                <option value="5">5 - Basic Access (Read-only)</option>
              </select>
            </label>

            <label htmlFor="email">
              Email
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Access email"
                readOnly={!emailFocus}
                onFocus={() => setEmailFocus(true)}
              />
            </label>

            <label htmlFor="password">
              Password
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={targetUserId ? "Keep empty to remain the same" : "Create password"}
                readOnly={!passwordFocus}
                onFocus={() => setPasswordFocus(true)}
              />
            </label>

            <button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Processing...'
                : (targetUserId ? 'Update Access' : 'Create Access')
              }
            </button>
          </>
        )}
      </Form>
    </Container>
  );
}
