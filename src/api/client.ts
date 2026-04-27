import { Api, type RequestParams } from "@/api/Api"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://momentonow.com"

const securityWorker = (
  _securityData: unknown,
): RequestParams | void => {
  const token = localStorage.getItem("momento_token")
  if (!token) return {}

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export const momentoApi = new Api({
  baseUrl: API_BASE_URL,  
  securityWorker,
})
