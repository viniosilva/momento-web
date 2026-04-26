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
  /** @example "2026-02-08T10:30:00Z" */
  archived_at?: string;
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
