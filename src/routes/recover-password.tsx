import { Link, createFileRoute } from "@tanstack/react-router"
import { useForm } from '@tanstack/react-form'
import type { SubmitEvent } from "react"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/components/ui/auth-layout"
import { EmailInput } from "@/components/ui/email-input"
import { signInSchema } from "@/schemas/sign-in.schema"
import { useFormValidation } from "@/hooks/use-form-validation"
import { submitForm } from "@/lib/utils"


export const Route = createFileRoute("/recover-password")({ component: RecoverPassword })

function RecoverPassword() {
  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  const validateField = useFormValidation(signInSchema)

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
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit} className="mt-6 w-full font-semibold hover:bg-primary/80 cursor-pointer">
              {isSubmitting ? '...' : 'Send recovery email'}
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

export default RecoverPassword