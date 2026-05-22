import React, { useState, useEffect } from 'react';
import { FaTimes, FaUserCircle } from 'react-icons/fa';
import * as Styled from '../styled';
import { getAvatarUrl } from 'utils/imageHelpers';

export default function EditUserModal({
  isOpen,
  onClose,
  user,
  accessLevels,
  onSave,
}) {
  const [formData, setFormData] = useState({
    access_level_id: '',
    is_active: true,
    is_temporary: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        access_level_id: user.access_level?.id || user.access_level_id || '',
        is_active: user.is_active ?? true,
        is_temporary: user.is_temporary ?? false,
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user.id, formData);
  };

  return (
    <Styled.ModalBackdrop onClick={onClose}>
      <Styled.ModalCard onClick={(e) => e.stopPropagation()}>
        <Styled.ModalHeader>
          <h2>Edit User Profile</h2>
          <button type="button" onClick={onClose}>
            <FaTimes size={18} />
          </button>
        </Styled.ModalHeader>

        <Styled.ModalBody onSubmit={handleSubmit}>
          <Styled.ModalAvatarContainer>
            {user.avatar_url ? (
              <img src={getAvatarUrl(user.avatar_url)} alt={user.email} />
            ) : (
              <FaUserCircle />
            )}
          </Styled.ModalAvatarContainer>

          <Styled.StaticInfo>
            <span>User Email</span>
            <strong>{user.email}</strong>
          </Styled.StaticInfo>

          <Styled.FormGroup>
            <label htmlFor="access_level_id">Access Level</label>
            <select
              name="access_level_id"
              id="access_level_id"
              value={formData.access_level_id}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a role...
              </option>
              {accessLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </Styled.FormGroup>

          <Styled.FormGroup>
            <label htmlFor="is_active">Account Status</label>
            <Styled.ToggleSwitch>
              <input
                type="checkbox"
                name="is_active"
                id="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              <span className="slider" />
              <span className="label-text">
                {formData.is_active
                  ? 'Active (Can login)'
                  : 'Inactive (Suspended)'}
              </span>
            </Styled.ToggleSwitch>
          </Styled.FormGroup>

          <Styled.FormGroup>
            <label htmlFor="is_temporary">Password Reset State</label>
            <Styled.ToggleSwitch>
              <input
                type="checkbox"
                name="is_temporary"
                id="is_temporary"
                checked={formData.is_temporary}
                onChange={handleChange}
              />
              <span className="slider" />
              <span className="label-text">
                {formData.is_temporary
                  ? 'Temporary (Requires change on login)'
                  : 'Standard Account'}
              </span>
            </Styled.ToggleSwitch>
          </Styled.FormGroup>

          <Styled.ModalFooter>
            <Styled.CancelButton type="button" onClick={onClose}>
              Cancel
            </Styled.CancelButton>
            <Styled.SaveButton type="submit">Save Changes</Styled.SaveButton>
          </Styled.ModalFooter>
        </Styled.ModalBody>
      </Styled.ModalCard>
    </Styled.ModalBackdrop>
  );
}
