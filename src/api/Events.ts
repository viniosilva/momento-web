
import type {
  NethttpErrorResponse,
  PortsCreateEventRequest,
  PortsEventResponse,
  PortsListEventsResponse,
  PortsUpdateEventRequest,
} from "./data-contracts"
import { ContentType, HttpClient } from "./http-client"
import type { RequestParams } from "./http-client"

export class Events<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Archives a event belonging to the authenticated user
   *
   * @tags events
   * @name EventsArchivePartialUpdate
   * @summary Archive a event
   * @request PATCH:/api/events/{id}/archive
   * @secure
   */
  eventsArchivePartialUpdate = (id: string, params: RequestParams = {}) =>
    this.request<PortsEventResponse, NethttpErrorResponse>({
      path: `/api/events/${id}/archive`,
      method: "PATCH",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Creates a new event associated with the authenticated user
   *
   * @tags events
   * @name EventsCreate
   * @summary Create a new event
   * @request POST:/api/events
   * @secure
   */
  eventsCreate = (
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
    });
  /**
   * @description Deletes a event belonging to the authenticated user
   *
   * @tags events
   * @name EventsDelete
   * @summary Delete a event
   * @request DELETE:/api/events/{id}
   * @secure
   */
  eventsDelete = (id: string, params: RequestParams = {}) =>
    this.request<void, NethttpErrorResponse>({
      path: `/api/events/${id}`,
      method: "DELETE",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Retrieves a specific event for the authenticated user by event ID
   *
   * @tags events
   * @name EventsDetail
   * @summary Retrieve a event by ID
   * @request GET:/api/events/{id}
   * @secure
   */
  eventsDetail = (id: string, params: RequestParams = {}) =>
    this.request<PortsEventResponse, NethttpErrorResponse>({
      path: `/api/events/${id}`,
      method: "GET",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Retrieves a paginated list of events for the authenticated user with sorting options
   *
   * @tags events
   * @name EventsList
   * @summary List user events
   * @request GET:/api/events
   * @secure
   */
  eventsList = (
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
    });
  /**
   * @description Updates the content of a event for the authenticated user
   *
   * @tags events
   * @name EventsPartialUpdate
   * @summary Update a event
   * @request PATCH:/api/events/{id}
   * @secure
   */
  eventsPartialUpdate = (
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
    });
  /**
   * @description Restores a event belonging to the authenticated user
   *
   * @tags events
   * @name EventsRestorePartialUpdate
   * @summary Restore a event
   * @request PATCH:/api/events/{id}/restore
   * @secure
   */
  eventsRestorePartialUpdate = (id: string, params: RequestParams = {}) =>
    this.request<PortsEventResponse, NethttpErrorResponse>({
      path: `/api/events/${id}/restore`,
      method: "PATCH",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
