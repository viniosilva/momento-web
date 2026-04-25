import { Link, createFileRoute, useRouter } from "@tanstack/react-router"
import { useForm } from '@tanstack/react-form'
import type { SubmitEvent } from "react"
import type { SignInFormValues } from "@/schemas/sign-in.schema"
import { Button } from "@/components/ui/button"
import { AuthDivider } from "@/components/ui/auth-divider"
import { AuthLayout } from "@/components/ui/auth-layout"
import { EmailInput } from "@/components/ui/email-input"
import { PasswordInput } from "@/components/ui/password-input"
import { RememberMeCheckbox } from "@/components/ui/remember-me-checkbox"
import { SocialLoginButtons } from "@/components/ui/social-login-buttons"
import { signInSchema } from "@/schemas/sign-in.schema"
import { useFormValidation } from "@/hooks/use-form-validation"
import { submitForm } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

export const Route = createFileRoute("/sign-in")({ component: SignIn })

function SignIn() {
  const router = useRouter()
  const { login } = useAuth()
  const form = useForm({
    defaultValues: { email: '', password: '', rememberMe: false } as SignInFormValues,
    onSubmit: async ({ value }) => {
      try {
        await login({ email: value.email, password: value.password })
        router.navigate({ to: '/momentos' })
      } catch (error) {
        console.error('Login failed:', error)
      }
    },
  })

  const validateField = useFormValidation(signInSchema)

  return (
    <AuthLayout subtitle="Sign in to continue">
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

        <div className="flex items-center justify-between">
          <form.Field
            name="rememberMe"
            validators={{
              onChange: ({ value }) => validateField('rememberMe', value),
            }}
            children={(field) => <RememberMeCheckbox field={field} />}
          />

          <Link to="/recover-password" className="text-chart-5 hover:underline">Forgot password?</Link>
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit} className="mt-6 w-full font-semibold hover:bg-primary/80 cursor-pointer">
              {isSubmitting ? '...' : 'Sign in'}
            </Button>
          )}
        />
      </form>

      <AuthDivider />

      <SocialLoginButtons />

      <p className="mt-4">
        Don't have an account? <Link to="/sign-up" className="text-chart-5 hover:underline">Sign up</Link>
      </p>
    </AuthLayout>
  )
}

export default SignIn