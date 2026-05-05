export const STUDENT_IMAGE_BASE_URL = `${process.env.REACT_APP_API_URL}/images/students`;

export const getStudentImageUrl = (avatarUrl) => {
  if (!avatarUrl) return null;
  const baseUrl = STUDENT_IMAGE_BASE_URL.endsWith('/')
    ? STUDENT_IMAGE_BASE_URL
    : `${STUDENT_IMAGE_BASE_URL}/`;
  return `${baseUrl}${avatarUrl}`;
};
