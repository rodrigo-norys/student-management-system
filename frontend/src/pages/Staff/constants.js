export const STAFF_IMAGE_BASE_URL = `${process.env.REACT_APP_API_URL}/images/staff`;

export const getStaffImageUrl = (avatarUrl) => {
  if (!avatarUrl) return null;
  const baseUrl = STAFF_IMAGE_BASE_URL.endsWith('/')
    ? STAFF_IMAGE_BASE_URL
    : `${STAFF_IMAGE_BASE_URL}/`;
  return `${baseUrl}${avatarUrl}`;
};

export const STAFF_STATUS_OPTIONS = Object.freeze([
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on_leave', label: 'On Leave' },
]);
