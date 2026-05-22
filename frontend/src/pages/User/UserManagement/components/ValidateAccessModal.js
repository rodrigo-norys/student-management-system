import React, { useState, useEffect } from 'react';
import { FaTimes, FaUserCheck, FaSyncAlt } from 'react-icons/fa';
import { isEmail } from 'validator';
import * as Styled from '../styled';

export default function ValidateAccessModal({
  isOpen,
  onClose,
  target,
  accessLevels = [],
  onSave
}) {
  const [accessLevelId, setAccessLevelId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [accessError, setAccessError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const generatePassword = () => {
    const tempPassword = Math.random().toString(36).slice(-8) + 'X9@';
    setPassword(tempPassword);
    if (passwordError) setPasswordError('');
  };

  useEffect(() => {
    if (target) {
      setAccessLevelId('');
      setEmail(target?.email || '');
      setEmailError('');
      setAccessError('');
      setPasswordError('');
      generatePassword();
    }
  }, [target]);

  if (!isOpen || !target) return null;

  const handleBackendError = (errorMessage) => {
    if (errorMessage.toLowerCase().includes('email')) {
      setEmailError(errorMessage);
    } else if (errorMessage.toLowerCase().includes('access')) {
      setAccessError(errorMessage);
    } else {
      alert(errorMessage);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {
      email:
        (!email?.trim() && 'Email is required.') ||
        (!isEmail(email) && 'Please enter a valid email address.') ||
        '',

      access:
        (!accessLevelId && 'Access level is required.') ||
        '',

      password:
        ((!password || password.length < 6) && 'Password must be at least 6 characters.') ||
        ''
    };

    setEmailError(errors.email);
    setAccessError(errors.access);
    setPasswordError(errors.password);

    const isValid = !Object.values(errors).some(Boolean);

    isValid && onSave(target, accessLevelId, email, password, handleBackendError);
  };

  return (
    <Styled.ModalBackdrop onClick={onClose}>
      <Styled.ModalCard onClick={(e) => e.stopPropagation()}>
        <Styled.ModalHeader>
          <h2>Validate Pending Access</h2>
          <button type="button" onClick={onClose} aria-label="Close modal">
            <FaTimes size={18} />
          </button>
        </Styled.ModalHeader>

        <Styled.ModalBody onSubmit={handleSubmit}>
          <Styled.ModalAvatarContainer>
            {target.avatar_url ? (
              <img
                src={target.avatar_url}
                alt={target.name || 'Target profile'}
              />
            ) : (
              <FaUserCheck />
            )}
          </Styled.ModalAvatarContainer>

          <Styled.StaticInfo>
            <span>Target Name</span>
            <strong>{target.displayName}</strong>
          </Styled.StaticInfo>

          <Styled.StaticInfo>
            <span>Entity Type</span>
            <strong style={{ textTransform: 'uppercase' }}>{target.type}</strong>
          </Styled.StaticInfo>

          <Styled.FormGroup>
            <label htmlFor="email">User Email</label>

            <Styled.Input
              type="email"
              id="email"
              value={email}
              $hasError={!!emailError}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
            />
            {emailError && <Styled.ErrorMessage>{emailError}</Styled.ErrorMessage>}
          </Styled.FormGroup>

          <Styled.FormGroup>
            <label htmlFor="password">Temporary Password</label>
            <Styled.PasswordInputWrapper>
              <Styled.Input
                type="text"
                id="password"
                value={password}
                $hasError={!!passwordError}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
              />
              <Styled.IconButton
                type="button"
                onClick={generatePassword}
                aria-label="Generate new password"
                title="Generate new password"
              >
                <FaSyncAlt />
              </Styled.IconButton>
            </Styled.PasswordInputWrapper>
            {passwordError && <Styled.ErrorMessage>{passwordError}</Styled.ErrorMessage>}
          </Styled.FormGroup>

          <Styled.FormGroup>
            <label htmlFor="access_level_id">Assign Access Level</label>
            <Styled.Select
              name="access_level_id"
              id="access_level_id"
              value={accessLevelId}
              $hasError={!!accessError}
              onChange={(e) => {
                setAccessLevelId(e.target.value);
                if (accessError) setAccessError('');
              }}
            >
              <option value="" disabled>Select a role...</option>
              {accessLevels.map((level) => (
                <option key={`validate-role-${level.id}`} value={level.id}>
                  {level.name}
                </option>
              ))}
            </Styled.Select>
            {accessError && <Styled.ErrorMessage>{accessError}</Styled.ErrorMessage>}
          </Styled.FormGroup>

          <Styled.ModalFooter>
            <Styled.CancelButton type="button" onClick={onClose}>
              Cancel
            </Styled.CancelButton>
            <Styled.SaveButton type="submit">
              Confirm Access
            </Styled.SaveButton>
          </Styled.ModalFooter>
        </Styled.ModalBody>
      </Styled.ModalCard>
    </Styled.ModalBackdrop>
  );
}
