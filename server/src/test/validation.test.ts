import { describe, it, expect } from 'vitest';
import { z } from 'zod';

/**
 * Unit tests for validation schemas
 * Tests the zod schemas used across the API
 */

// Common validation patterns used in the app
const VN_PHONE_REGEX = /^(\+84|0)(3|5|7|8|9)\d{8}$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])/;

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(PASSWORD_REGEX, 'Password must contain at least 1 uppercase letter and 1 number'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  phone: z
    .string()
    .regex(VN_PHONE_REGEX, 'Invalid Vietnamese phone number')
    .optional(),
});

describe('Validation Schemas', () => {
  describe('Register Schema', () => {
    it('should accept valid registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      };
      
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'Password123',
        name: 'Test User',
      };
      
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'weakpass', // no uppercase, no number
        name: 'Test User',
      };
      
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Pass1', // too short
        name: 'Test User',
      };
      
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept valid Vietnamese phone number', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
        phone: '0901234567',
      };
      
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept Vietnamese phone with +84 prefix', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
        phone: '+84901234567',
      };
      
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid phone number', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
        phone: '1234567890', // not Vietnamese format
      };
      
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
