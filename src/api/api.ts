import { Auth, Events, Health } from "./"
import type { RequestParams } from "./http-client"

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

export const api = {
  auth: new Auth({
    baseUrl: API_BASE_URL,
  }),
  events: new Events({
    baseUrl: API_BASE_URL,
    securityWorker,
  }),
  health: new Health({
    baseUrl: API_BASE_URL,
  }),
}

export type Api = typeof api