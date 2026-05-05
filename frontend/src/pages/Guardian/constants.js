export const GUARDIAN_IMAGE_BASE_URL = `${process.env.REACT_APP_API_URL}/images/guardians`;

export const getGuardianImageUrl = (avatarUrl) => {
  if (!avatarUrl) return null;
  const baseUrl = GUARDIAN_IMAGE_BASE_URL.endsWith('/')
    ? GUARDIAN_IMAGE_BASE_URL
    : `${GUARDIAN_IMAGE_BASE_URL}/`;
  return `${baseUrl}${avatarUrl}`;
};
