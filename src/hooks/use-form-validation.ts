import { z } from 'zod'

export function useFormValidation(schema: z.ZodObject<any>) {
  return (fieldName: string, value: unknown) => {
    const fieldSchema = schema.shape[fieldName]
    
    if (!fieldSchema) return undefined
    
    const result = fieldSchema.safeParse(value)
    return result.success ? undefined : result.error.issues[0].message
  }
}