import { describe, expect, it } from '@jest/globals';
import { validateEmail, validatePassword, validateTaskTitle } from './validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    it('should validate email containing @', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user@domain.co.uk')).toBe(true);
      expect(validateEmail('user@')).toBe(true);
      expect(validateEmail('@domain.com')).toBe(true);
    });

    it('should reject email without @', () => {
      expect(validateEmail('invalid.email')).toBe(false);
      expect(validateEmail('userdomain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      expect(validatePassword('Senha@123')).toBe(true);
      expect(validatePassword('Abcd!1234')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(validatePassword('123')).toBe(false);
      expect(validatePassword('password')).toBe(false);
      expect(validatePassword('SENHA123')).toBe(false);
      expect(validatePassword('senha123')).toBe(false);
      expect(validatePassword('Senha123')).toBe(false);
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
