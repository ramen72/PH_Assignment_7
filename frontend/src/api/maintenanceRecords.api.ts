
import apiClient from "@/lib/apiClient";
import type {
  MaintenanceRecordFilterParams,
  MaintenanceRecordPayload,
  UpdateMaintenanceRecordPayload,
} from "@/types";

const BASE_URL = "/maintenanceRecords";

/**
 * Build query string from filter parameters.
 */
const buildQueryString = (
  params: MaintenanceRecordFilterParams = {},
): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
};

/**
 * Get all maintenance records.
 * Supports search, status filtering, sorting and pagination.
 */
export const getAllMaintenanceRecords = (
  params: MaintenanceRecordFilterParams = {},
) => {
  return apiClient(
    `${BASE_URL}${buildQueryString(params)}`,
    {
      method: "GET",
    },
  );
};

/**
 * Get a single maintenance record by ID.
 */
export const getSingleMaintenanceRecord = (id: string) => {
  return apiClient(`${BASE_URL}/${id}`, {
    method: "GET",
  });
};

/**
 * Create a maintenance record.
 */
export const createMaintenanceRecord = (
  payload: MaintenanceRecordPayload,
) => {
  return apiClient(BASE_URL, {
    method: "POST",
    body: payload,
  });
};

/**
 * Update an existing maintenance record.
 */
export const updateMaintenanceRecord = (
  id: string,
  payload: UpdateMaintenanceRecordPayload,
) => {
  return apiClient(`${BASE_URL}/${id}`, {
    method: "PATCH",
    body: payload,
  });
};

/**
 * Delete a maintenance record.
 */
export const deleteMaintenanceRecord = (id: string) => {
  return apiClient(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};