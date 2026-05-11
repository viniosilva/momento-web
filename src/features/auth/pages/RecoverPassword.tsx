import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { useForm } from '@tanstack/react-form'
import type { SubmitEvent } from "react"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/components/ui/auth-layout"
import { EmailInput } from "@/components/ui/email-input"
import { forgotPasswordSchema } from "@/features/auth/schemas/reset-password"
import { useFormValidation } from "@/hooks/use-form-validation"
import { submitForm } from "@/lib/utils"
import { useForgotPassword } from "@/hooks/use-auth-query"
import { toast } from "sonner"

export function RecoverPassword() {
  const [isSuccess, setIsSuccess] = useState(false)
  const forgotPasswordMutation = useForgotPassword()

  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: async ({ value }) => {
      forgotPasswordMutation.mutate({ email: value.email }, {
        onSuccess: () => {
          setIsSuccess(true)
        },
        onError: (_err) => {
          toast.error("Failed to send recovery email. Please try again.")
        },
      })
    },
  })

  const validateField = useFormValidation(forgotPasswordSchema)

  if (isSuccess) {
    return (
      <AuthLayout subtitle="Recover your password">
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold">Email sent!</h3>
          <p className="mt-2 text-muted-foreground">
            If the email exists, you will receive password recovery instructions shortly.
          </p>
          <Link to="/sign-in" className="mt-6 block text-chart-5 hover:underline">
            Back to Sign in
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout subtitle="Recover your password">
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

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, _isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || forgotPasswordMutation.isPending}
              className="mt-6 w-full font-semibold hover:bg-primary/80 cursor-pointer"
            >
              {forgotPasswordMutation.isPending ? 'Sending...' : 'Send recovery email'}
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
