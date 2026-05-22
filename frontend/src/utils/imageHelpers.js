export const getAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return null;
  
  const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, '');
  return `${baseUrl}/images/${avatarUrl}`;
};
