export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Mínimo 6 caracteres
  return password.length >= 6;
};

export const validateTaskTitle = (title: string): boolean => {
  return title.trim().length > 0 && title.length <= 100;
};
