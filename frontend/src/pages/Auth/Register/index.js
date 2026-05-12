import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { isEmail } from 'validator';

import Loading from 'components/Loading';
import * as actions from 'store/modules/auth/actions.js';
import axios from 'services/axios';
import {
  Container, Form, Title, SearchArea, SearchResultList, SearchItem,
  PersonInfo, Badge, SelectedPersonCard, StatusIndicator, Section
} from './styled';

export default function UserManager() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessLevel, setAccessLevel] = useState('5');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axios.get('/users/search-targets', {
          params: { searchTerm },
        });
        setSearchResults(response.data);
      } catch (error) {
        toast.error('Error fetching search results.');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
    setSearchTerm('');
    setSearchResults([]);
    setEmail(person.email || '');
    setAccessLevel(person.user ? String(person.user.access_level_id) : '5');
    setPassword('');
  };

  const handleReset = () => {
    setSelectedPerson(null);
    setSearchTerm('');
    setSearchResults([]);
    setEmail('');
    setPassword('');
    setAccessLevel('5');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validations = [
      { condition: !selectedPerson, message: 'Please select a person first.' },
      { condition: !isEmail(email), message: 'Invalid email address.' },
      { condition: !selectedPerson?.user && password.length < 8, message: 'New users require a password (min 8 chars).' },
      { condition: !accessLevel, message: 'Access level is required.' },
    ];

    const errorValidation = validations.find((validation) => validation.condition);
    if (errorValidation) {
      toast.error(errorValidation.message);
      return;
    }

    dispatch(
      actions.registerRequest({
        id: selectedPerson.user?.id || null,
        email,
        password,
        [`${selectedPerson.type}_id`]: selectedPerson.id,
        access_level_id: Number(accessLevel),
      })
    );
  };

  return (
    <Container>
      <Loading isLoading={isLoading || isSearching} />
      <Section>
        <Title>Access Management</Title>

        {!selectedPerson ? (
          <SearchArea>
            <input
              type="text"
              placeholder="Search by name, email or CPF..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            {searchResults.length > 0 && (
              <SearchResultList>
                {searchResults.map((person) => (
                  <SearchItem key={`${person.type}-${person.id}`} onClick={() => handleSelectPerson(person)}>
                    <PersonInfo>
                      <strong>{person.displayName}</strong>
                      <span>{person.cpf}</span>
                    </PersonInfo>
                    <Badge $type={person.type}>{person.type}</Badge>
                  </SearchItem>
                ))}
              </SearchResultList>
            )}
          </SearchArea>
        ) : (
          <SelectedPersonCard>
            <PersonInfo>
              <strong>{selectedPerson.displayName}</strong>
              <span>{selectedPerson.type.toUpperCase()} | CPF: {selectedPerson.cpf}</span>
            </PersonInfo>
            <button type="button" onClick={handleReset}>Change</button>
          </SelectedPersonCard>
        )}

        {selectedPerson && (
          <Form onSubmit={handleSubmit}>
            <StatusIndicator $isEdit={!!selectedPerson.user}>
              {selectedPerson.user ? 'Editing existing account' : 'Creating new access'}
            </StatusIndicator>

            <label htmlFor="accessLevel">
              System Privileges
              <select
                id="accessLevel"
                value={accessLevel}
                onChange={(event) => setAccessLevel(event.target.value)}
              >
                <option value="1">Level 1 - Owner / IT Full</option>
                <option value="2">Level 2 - Technical Admin</option>
                <option value="3">Level 3 - Finance / Billing</option>
                <option value="4">Level 4 - Academic / Pedagogical</option>
                <option value="5">Level 5 - Basic / Viewer</option>
              </select>
            </label>

            <label htmlFor="email">
              Access Email
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
              />
            </label>

            <label htmlFor="password">
              {selectedPerson.user ? 'Update Password (Optional)' : 'Security Password'}
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={selectedPerson.user ? 'Leave blank to keep current' : 'Min 8 characters'}
                autoComplete="new-password"
              />
            </label>

            <button type="submit" disabled={isLoading}>
              {selectedPerson.user ? 'Save Changes' : 'Confirm Registration'}
            </button>
          </Form>
        )}
      </Section>
    </Container>
  );
}
