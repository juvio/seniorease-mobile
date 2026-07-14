export const validateEmail = (email: string): boolean => {
  return email.trim().includes('@');
};

export const PASSWORD_REQUIREMENTS_TEXT =
  'Senha deve ter no minimo 8 caracteres, com letra maiuscula, minuscula, numero e caractere especial.';

export const validatePassword = (password: string): boolean => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  return hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
};

export const validateTaskTitle = (title: string): boolean => {
  return title.trim().length > 0 && title.length <= 100;
};
