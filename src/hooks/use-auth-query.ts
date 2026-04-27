import { useMutation } from '@tanstack/react-query'
import { momentoApi } from '@/api/client'
import type { PortsLoginRequest, PortsLogoutRequest, PortsRefreshRequest, PortsRegisterRequest } from '@/api/Api'

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