import { createFileRoute, Link } from "@tanstack/react-router"
import { useForm } from '@tanstack/react-form'
import { Button } from "@/components/ui/button"
import { AuthDivider } from "@/components/ui/auth-divider"
import { AuthLayout } from "@/components/ui/auth-layout"
import { EmailInput } from "@/components/ui/email-input"
import { PasswordInput } from "@/components/ui/password-input"
import { SocialLoginButtons } from "@/components/ui/social-login-buttons"
import { signUpSchema, type SignUpFormValues } from "@/schemas/sign-up.schema"
import { useFormValidation } from "@/hooks/use-form-validation"

export const Route = createFileRoute("/sign-up")({ component: SignUp })

function SignUp() {
  const form = useForm({
    defaultValues: { email: '', password: '' } as SignUpFormValues,
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  const validateField = useFormValidation(signUpSchema)

  return (
    <AuthLayout subtitle="Create your account">
      <form className="mt-4 flex flex-col w-full">
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

export default SignUp