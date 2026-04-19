import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { useFormValidation } from './use-form-validation'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

describe('useFormValidation', () => {
  it('returns undefined when field is valid', () => {
    const validate = useFormValidation(schema)
    
    const result = validate('email', 'test@example.com')
    
    expect(result).toBeUndefined()
  })

  it('returns error message when field is invalid', () => {
    const validate = useFormValidation(schema)
    
    const result = validate('email', 'invalid-email')
    
    expect(result).toBe('Invalid email')
  })

  it('returns undefined when field does not exist in schema', () => {
    const validate = useFormValidation(schema)
    
    const result = validate('unknown', 'value')
    
    expect(result).toBeUndefined()
  })

  it('validates password field correctly', () => {
    const validate = useFormValidation(schema)
    
    expect(validate('password', '12345')).toBe('Password must be at least 6 characters')
    expect(validate('password', '123456')).toBeUndefined()
  })
})