import { useMutation, useQuery } from '@tanstack/react-query'
import { momentoApi } from '@/api/client'
import type { PortsLoginRequest, PortsLogoutRequest, PortsRefreshRequest, PortsRegisterRequest, PortsForgotPasswordRequest, PortsResetPasswordRequest, PortsVerifyEmailRequest } from '@/api/Api'

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: PortsLoginRequest) => {
      const response = await momentoApi.api.authLoginCreate(credentials)
      return response.data
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: PortsRegisterRequest) => {
      const response = await momentoApi.api.authRegisterCreate(data)
      return response.data
    },
  })
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (data: PortsVerifyEmailRequest) => {
      const response = await momentoApi.api.authVerifyEmailCreate(data)
      return response.data
    },
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: async ({ refresh_token }: PortsLogoutRequest) => {
      await momentoApi.api.authLogoutCreate({ refresh_token })
    },
  })
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: async ({ refresh_token }: PortsRefreshRequest) => {
      const response = await momentoApi.api.authRefreshCreate({ refresh_token })
      return response.data
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (data: PortsForgotPasswordRequest) => {
      const response = await momentoApi.api.authForgotPasswordCreate(data)
      return response.data
    },
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: PortsResetPasswordRequest) => {
      const response = await momentoApi.api.authResetPasswordCreate(data)
      return response.data
    },
  })
}

export function useValidateResetToken(token: string) {
  return useQuery({
    queryKey: ['validateResetToken', token],
    queryFn: async () => {
      const response = await momentoApi.api.authResetPasswordValidateList({ token })
      return response.data
    },
    enabled: !!token,
  })
}