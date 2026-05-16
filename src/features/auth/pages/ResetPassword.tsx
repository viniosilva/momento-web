import { useState, useEffect } from "react"
import { Link, useNavigate, useSearch } from "@tanstack/react-router"
import { useForm } from '@tanstack/react-form'
import type { SubmitEvent } from "react"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/features/auth/components/auth-layout"
import { PasswordInput } from "@/features/auth/components/password-input"
import { resetPasswordFormSchema } from "@/features/auth/schemas/reset-password"
import { useFormValidation } from "@/hooks/use-form-validation"
import { submitForm } from "@/lib/utils"
import { useResetPassword, useValidateResetToken } from "@/hooks/use-auth-query"
import { toast } from "sonner"

export function ResetPassword() {
  const { token } = useSearch({ from: '/reset-password' })
  const navigate = useNavigate()
  const [isSuccess, setIsSuccess] = useState(false)

  const { data: tokenValid, isLoading: isValidating, isError: tokenError } = useValidateResetToken(token || '')
  const resetPasswordMutation = useResetPassword()

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate({ to: "/sign-in" })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, navigate])

  const form = useForm({
    defaultValues: { password: '' },
    onSubmit: async ({ value }) => {
      if (!token) return

      const validationResult = resetPasswordFormSchema.safeParse({
        token,
        password: value.password,
      })

      if (!validationResult.success) {
        toast.error(validationResult.error.issues[0].message)
        return
      }

      resetPasswordMutation.mutate(
        { token, password: value.password },
        {
          onSuccess: () => {
            setIsSuccess(true)
            toast.success("Password reset successful! Redirecting to sign in...")
          },
          onError: () => {
            toast.error("Failed to reset password. Please try again.")
          },
        },
      )
    },
  })

  const validateField = useFormValidation(resetPasswordFormSchema)

  if (isValidating) {
    return (
      <AuthLayout subtitle="Reset Your Password">
        <div className="mt-4 text-center">
          <p className="text-muted-foreground">Validating token...</p>
        </div>
      </AuthLayout>
    )
  }

  if (tokenError || !tokenValid?.valid) {
    return (
      <AuthLayout subtitle="Reset Your Password">
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold text-destructive">Invalid or Expired Token</h3>
          <p className="mt-2 text-muted-foreground">
            This reset link is invalid or has expired.
          </p>
          <Link to="/recover-password" className="mt-6 block text-chart-5 hover:underline">
            Request a new reset link
          </Link>
        </div>
      </AuthLayout>
    )
  }

  if (isSuccess) {
    return (
      <AuthLayout subtitle="Reset Your Password">
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold text-green-600">Password Reset Successful!</h3>
          <p className="mt-2 text-muted-foreground">
            Your password has been reset. Redirecting to sign in...
          </p>
          <Link to="/sign-in" className="mt-6 block text-chart-5 hover:underline">
            Sign in now
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout subtitle="Reset Your Password">
      <form className="mt-4 flex flex-col w-full" onSubmit={(e: SubmitEvent<HTMLFormElement>) => submitForm(e, form)}>
        <div>
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => validateField('password', value),
            }}
            children={(field) => <PasswordInput field={field} label="New password" />}
          />
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit]) => (
            <Button
              type="submit"
              disabled={!canSubmit || resetPasswordMutation.isPending}
              className="mt-6 w-full font-semibold hover:bg-primary/80 cursor-pointer"
            >
              {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
            </Button>
          )}
        />
      </form>

      <p className="mt-4">
        Remember your password? <Link to="/sign-in" className="text-chart-5 hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
