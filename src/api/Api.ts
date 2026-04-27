/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum DomainHealthStatusEnum {
  HealthStatusValueOk = "ok",
  HealthStatusValueError = "error",
}

export interface ListoptsPaginationResponse {
  /** @example 1 */
  page?: number;
  /** @example 10 */
  page_size?: number;
  /** @example 100 */
  total_count?: number;
  /** @example 5 */
  total_pages?: number;
}

export interface NethttpErrorResponse {
  /** @example "internal server error" */
  message?: string;
}

export interface PortsCreateEventRequest {
  /** @example "My important event content" */
  content?: string;
  /** @example "My event title" */
  title?: string;
}

export interface PortsEventResponse {
  /** @example "2026-02-08T10:30:00Z" */
  archived_at?: string;
  /** @example "My important event content" */
  content?: string;
  /** @example "2026-02-08T10:30:00Z" */
  created_at?: string;
  /** @example "507f1f77bcf86cd799439011" */
  id?: string;
  /** @example "507f1f77bcf86cd799439011" */
  owner_user_id?: string;
  /** @example "My event title" */
  title?: string;
  /** @example "2026-02-08T10:30:00Z" */
  updated_at?: string;
}

export interface PortsListEventsResponse {
  data?: PortsEventResponse[];
  pagination?: ListoptsPaginationResponse;
}

export interface PortsLoginRequest {
  /** @example "user@example.com" */
  email?: string;
  /** @example "ValidPass123!" */
  password?: string;
}

export interface PortsLoginResponse {
  /** @example "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..." */
  refresh_token?: string;
  /** @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." */
  token?: string;
}

export interface PortsLogoutRequest {
  /** @example "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..." */
  refresh_token?: string;
}

export interface PortsRefreshRequest {
  /** @example "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..." */
  refresh_token?: string;
}

export interface PortsRefreshResponse {
  /** @example "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..." */
  refresh_token?: string;
  /** @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." */
  token?: string;
}

export interface PortsRegisterRequest {
  /** @example "user@example.com" */
  email?: string;
  /** @example "ValidPass123!" */
  password?: string;
}

export interface PortsRegisterResponse {
  /** @example "user@example.com" */
  email?: string;
  /** @example "507f1f77bcf86cd799439011" */
  id?: string;
}

export interface PortsUpdateEventRequest {
  /** @example "My updated event content" */
  content?: string;
  /** @example "My updated event title" */
  title?: string;
}

export interface ResponseHealthResponse {
  /** @example "ok" */
  status?: DomainHealthStatusEnum;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Momento API
 * @version 1.0
 * @license Apache 2.0 (http://www.apache.org/licenses/LICENSE-2.0.html)
 * @termsOfService http://swagger.io/terms/
 * @contact API Support <support@momento.com>
 *
 * API documentation for Momento application
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Authenticates a user and returns a JWT token and a refresh token
     *
     * @tags auth
     * @name AuthLoginCreate
     * @summary Login with email and password
     * @request POST:/api/auth/login
     */
    authLoginCreate: (request: PortsLoginRequest, params: RequestParams = {}) =>
      this.request<PortsLoginResponse, NethttpErrorResponse>({
        path: `/api/auth/login`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Invalidates the refresh token to log out the user
     *
     * @tags auth
     * @name AuthLogoutCreate
     * @summary Logout user
     * @request POST:/api/auth/logout
     */
    authLogoutCreate: (
      request: PortsLogoutRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, NethttpErrorResponse>({
        path: `/api/auth/logout`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Exchanges a refresh token for a new JWT token and a new refresh token
     *
     * @tags auth
     * @name AuthRefreshCreate
     * @summary Refresh access token
     * @request POST:/api/auth/refresh
     */
    authRefreshCreate: (
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
      }),

    /**
     * @description Creates a new user account with email and password
     *
     * @tags auth
     * @name AuthRegisterCreate
     * @summary Register a new user
     * @request POST:/api/auth/register
     */
    authRegisterCreate: (
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
      }),

    /**
     * @description Archives a event belonging to the authenticated user
     *
     * @tags events
     * @name EventsArchivePartialUpdate
     * @summary Archive a event
     * @request PATCH:/api/events/{id}/archive
     * @secure
     */
    eventsArchivePartialUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, NethttpErrorResponse>({
        path: `/api/events/${id}/archive`,
        method: "PATCH",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Creates a new event associated with the authenticated user
     *
     * @tags events
     * @name EventsCreate
     * @summary Create a new event
     * @request POST:/api/events
     * @secure
     */
    eventsCreate: (
      request: PortsCreateEventRequest,
      params: RequestParams = {},
    ) =>
      this.request<PortsEventResponse, NethttpErrorResponse>({
        path: `/api/events`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes a event belonging to the authenticated user
     *
     * @tags events
     * @name EventsDelete
     * @summary Delete a event
     * @request DELETE:/api/events/{id}
     * @secure
     */
    eventsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, NethttpErrorResponse>({
        path: `/api/events/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves a specific event for the authenticated user by event ID
     *
     * @tags events
     * @name EventsDetail
     * @summary Retrieve a event by ID
     * @request GET:/api/events/{id}
     * @secure
     */
    eventsDetail: (id: string, params: RequestParams = {}) =>
      this.request<PortsEventResponse, NethttpErrorResponse>({
        path: `/api/events/${id}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a paginated list of events for the authenticated user with sorting options
     *
     * @tags events
     * @name EventsList
     * @summary List user events
     * @request GET:/api/events
     * @secure
     */
    eventsList: (
      query?: {
        /**
         * Page number (default: 1)
         * @default 1
         */
        page?: number;
        /**
         * Page size (default: 10, max: 100)
         * @default 10
         */
        page_size?: number;
        /**
         * Sort field: created_at, updated_at (default: created_at)
         * @default "created_at"
         */
        sort_by?: string;
        /**
         * Sort order: asc, desc (default: desc)
         * @default "desc"
         */
        sort_order?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PortsListEventsResponse, NethttpErrorResponse>({
        path: `/api/events`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the content of a event for the authenticated user
     *
     * @tags events
     * @name EventsPartialUpdate
     * @summary Update a event
     * @request PATCH:/api/events/{id}
     * @secure
     */
    eventsPartialUpdate: (
      id: string,
      request: PortsUpdateEventRequest,
      params: RequestParams = {},
    ) =>
      this.request<PortsEventResponse, NethttpErrorResponse>({
        path: `/api/events/${id}`,
        method: "PATCH",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Restores a event belonging to the authenticated user
     *
     * @tags events
     * @name EventsRestorePartialUpdate
     * @summary Restore a event
     * @request PATCH:/api/events/{id}/restore
     * @secure
     */
    eventsRestorePartialUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, NethttpErrorResponse>({
        path: `/api/events/${id}/restore`,
        method: "PATCH",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Returns the health status of the application and database connection
     *
     * @tags health
     * @name HealthcheckList
     * @summary Health check endpoint
     * @request GET:/api/healthcheck
     */
    healthcheckList: (params: RequestParams = {}) =>
      this.request<ResponseHealthResponse, ResponseHealthResponse>({
        path: `/api/healthcheck`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
