import { Link, useRouter } from "@tanstack/react-router"
import { useForm } from '@tanstack/react-form'
import type { SubmitEvent } from "react"
import type { SignUpFormValues } from "@/features/auth/schemas/sign-up.schema"
import { Button } from "@/components/ui/button"
import { AuthDivider } from "@/features/auth/components/auth-divider"
import { AuthLayout } from "@/features/auth/components/auth-layout"
import { EmailInput } from "@/features/auth/components/email-input"
import { PasswordInput } from "@/features/auth/components/password-input"
import { SocialLoginButtons } from "@/features/auth/components/social-login-buttons"
import { toast } from "sonner"
import { signUpSchema } from "@/features/auth/schemas/sign-up.schema"
import { useFormValidation } from "@/hooks/use-form-validation"
import { submitForm } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

export function SignUp() {
  const router = useRouter()
  const { register } = useAuth()
  const form = useForm({
    defaultValues: { email: '', password: '' } as SignUpFormValues,
    onSubmit: async ({ value }) => {
      try {
        await register({ email: value.email, password: value.password })
        toast.success('Registration successful! A verification email has been sent to your address. Please check your inbox.')
        router.navigate({ to: '/sign-in' })
      } catch (error) {
        console.error('Registration failed:', error)
        toast.error('Registration failed. Please try again.')
      }
    },
  })

  const validateField = useFormValidation(signUpSchema)

  return (
    <AuthLayout subtitle="Create your account">
      <form className="mt-4 flex flex-col w-full" onSubmit={(e: SubmitEvent<HTMLFormElement>) => submitForm(e, form)}>
        <div>
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => validateField('email', value),
            }}
            children={(field) => <EmailInput field={field} />}
          />
        </div>

        <div>
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => validateField('password', value),
            }}
            children={(field) => <PasswordInput field={field} />}
          />
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit} className="mt-6 w-full font-semibold hover:bg-primary/80 cursor-pointer">
              {isSubmitting ? '...' : 'Sign up'}
            </Button>
          )}
        />
      </form>

      <AuthDivider />

      <SocialLoginButtons />

      <p className="mt-4">
        Already have an account? <Link to="/sign-in" className="text-chart-5 hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
