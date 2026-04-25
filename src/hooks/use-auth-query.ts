import { useMutation } from '@tanstack/react-query'
import type { PortsLoginRequest, PortsLogoutRequest, PortsRefreshRequest, PortsRegisterRequest } from '@/api'
import { api } from '@/api/api'

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: PortsLoginRequest) => {
      const response = await api.auth.authLoginCreate(credentials)
      return response.data
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: PortsRegisterRequest) => {
      const response = await api.auth.authRegisterCreate(data)
      return response.data
    },
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: async ({ refresh_token }: PortsLogoutRequest) => {
      await api.auth.authLogoutCreate({ refresh_token })
    },
  })
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: async ({ refresh_token }: PortsRefreshRequest) => {
      const response = await api.auth.authRefreshCreate({ refresh_token })
      return response.data
    },
  })
}