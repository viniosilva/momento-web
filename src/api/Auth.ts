
import type {
  NethttpErrorResponse,
  PortsLoginRequest,
  PortsLoginResponse,
  PortsLogoutRequest,
  PortsRefreshRequest,
  PortsRefreshResponse,
  PortsRegisterRequest,
  PortsRegisterResponse,
} from "./data-contracts"
import { ContentType, HttpClient } from "./http-client"
import type { RequestParams } from "./http-client"

export class Auth<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Authenticates a user and returns a JWT token and a refresh token
   *
   * @tags auth
   * @name AuthLoginCreate
   * @summary Login with email and password
   * @request POST:/api/auth/login
   */
  authLoginCreate = (request: PortsLoginRequest, params: RequestParams = {}) =>
    this.request<PortsLoginResponse, NethttpErrorResponse>({
      path: `/api/auth/login`,
      method: "POST",
      body: request,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Invalidates the refresh token to log out the user
   *
   * @tags auth
   * @name AuthLogoutCreate
   * @summary Logout user
   * @request POST:/api/auth/logout
   */
  authLogoutCreate = (
    request: PortsLogoutRequest,
    params: RequestParams = {},
  ) =>
    this.request<void, NethttpErrorResponse>({
      path: `/api/auth/logout`,
      method: "POST",
      body: request,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Exchanges a refresh token for a new JWT token and a new refresh token
   *
   * @tags auth
   * @name AuthRefreshCreate
   * @summary Refresh access token
   * @request POST:/api/auth/refresh
   */
  authRefreshCreate = (
    request: PortsRefreshRequest,
    params: RequestParams = {},
  ) =>
    this.request<PortsRefreshResponse, NethttpErrorResponse>({
      path: `/api/auth/refresh`,
      method: "POST",
      body: request,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Creates a new user account with email and password
   *
   * @tags auth
   * @name AuthRegisterCreate
   * @summary Register a new user
   * @request POST:/api/auth/register
   */
  authRegisterCreate = (
    request: PortsRegisterRequest,
    params: RequestParams = {},
  ) =>
    this.request<PortsRegisterResponse, NethttpErrorResponse>({
      path: `/api/auth/register`,
      method: "POST",
      body: request,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
