import { validateEmail, validatePassword, validateTaskTitle } from '../../../shared/utils/validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    it('should validate correct email format', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email format', () => {
      expect(validateEmail('invalid.email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate password with minimum 6 characters', () => {
      expect(validatePassword('123456')).toBe(true);
      expect(validatePassword('password')).toBe(true);
    });

    it('should reject password with less than 6 characters', () => {
      expect(validatePassword('123')).toBe(false);
      expect(validatePassword('pass')).toBe(false);
    });
  });

  describe('validateTaskTitle', () => {
    it('should validate non-empty task title', () => {
      expect(validateTaskTitle('My Task')).toBe(true);
      expect(validateTaskTitle('A')).toBe(true);
    });

    it('should reject empty task title', () => {
      expect(validateTaskTitle('')).toBe(false);
      expect(validateTaskTitle('   ')).toBe(false);
    });

    it('should respect maximum length', () => {
      const longTitle = 'a'.repeat(101);
      expect(validateTaskTitle(longTitle)).toBe(false);

      const maxTitle = 'a'.repeat(100);
      expect(validateTaskTitle(maxTitle)).toBe(true);
    });
  });
});
