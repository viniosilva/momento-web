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

import type { ResponseHealthResponse } from "./data-contracts";
import { ContentType, HttpClient } from "./http-client";
import type { RequestParams } from "./http-client";

export class Health<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Returns the health status of the application and database connection
   *
   * @tags health
   * @name HealthcheckList
   * @summary Health check endpoint
   * @request GET:/api/healthcheck
   */
  healthcheckList = (params: RequestParams = {}) =>
    this.request<ResponseHealthResponse, ResponseHealthResponse>({
      path: `/api/healthcheck`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
