import { describe, expect, it } from 'vitest'
import { forgotPasswordSchema, resetPasswordFormSchema } from './reset-password'

describe('resetPasswordFormSchema', () => {
  it('validates correct data', () => {
    const data = {
      token: 'valid-token',
      password: 'Password1!',
    }

    const result = resetPasswordFormSchema.safeParse(data)

    expect(result.success).toBe(true)
  })

  it('fails with short password', () => {
    const data = {
      token: 'valid-token',
      password: 'P1!',
    }

    const result = resetPasswordFormSchema.safeParse(data)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must be at least 6 characters')
    }
  })

  it('fails without uppercase letter', () => {
    const data = {
      token: 'valid-token',
      password: 'password1!',
    }

    const result = resetPasswordFormSchema.safeParse(data)

    expect(result.success).toBe(false)
  })

  it('fails without lowercase letter', () => {
    const data = {
      token: 'valid-token',
      password: 'PASSWORD1!',
    }

    const result = resetPasswordFormSchema.safeParse(data)

    expect(result.success).toBe(false)
  })

  it('fails without number', () => {
    const data = {
      token: 'valid-token',
      password: 'Password!',
    }

    const result = resetPasswordFormSchema.safeParse(data)

    expect(result.success).toBe(false)
  })

  it('fails without symbol', () => {
    const data = {
      token: 'valid-token',
      password: 'Password1',
    }

    const result = resetPasswordFormSchema.safeParse(data)

    expect(result.success).toBe(false)
  })

  it('fails with empty token', () => {
    const data = {
      token: '',
      password: 'Password1!',
    }

    const result = resetPasswordFormSchema.safeParse(data)

    expect(result.success).toBe(false)
  })

  it('fails without token field', () => {
    const data = {
      password: 'Password1!',
    }

    const result = resetPasswordFormSchema.safeParse(data)

    expect(result.success).toBe(false)
  })
})

describe('forgotPasswordSchema', () => {
  it('validates correct email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'test@example.com' })

    expect(result.success).toBe(true)
  })

  it('fails with invalid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'invalid-email' })

    expect(result.success).toBe(false)
  })
})


