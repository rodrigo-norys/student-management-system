export const getAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return null;

  const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, '');
  return `${baseUrl}/images/${avatarUrl}`;
};

// Resolve a URL do avatar de aluno (arquivos ficam sob a pasta students/).
export const getStudentAvatarUrl = (avatarUrl) =>
  avatarUrl ? getAvatarUrl(`students/${avatarUrl}`) : null;
