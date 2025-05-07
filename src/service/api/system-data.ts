import { request } from '../request';
// Remove the incorrect import, as DeviceData is defined locally
// import type { DeviceData } from '@/views/device/utils/types';

export interface TelemetryItem {
  key: string;
  label: string | null;
  unit: string | null;
  value: any;
}

export interface DeviceData {
  device_id: string;
  device_name: string;
  is_online: number;
  last_push_time: string;
  telemetry_data: TelemetryItem[];
}

export interface ApiLatestTelemetryResponse {
  data: DeviceData[] | null;
  error: string | object | null;
}

// Reintroduce the interface for the expected API response structure
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface TenantMonthData {
  mon: number;
  num: number;
}

interface TenantBoardData {
  user_total: number;
  user_added_yesterday: number;
  user_added_month: number;
  user_list_month: TenantMonthData[];
}

export const totalNumber = async () => {
  const data = await request.get<Api.BaseApi.Data | null>('/board/device');
  return data;
};

export const sumData = async (): Promise<any> => {
  return await request.get<any>('/board/tenant/device/info');
};

export const tenantNum = async (): Promise<any> => {
  return await request.get<any>('/telemetry/datas/msg/count');
};

export const tenant = async () => {
  const data = await request.get<Api.BaseApi.Data | null>('/board/tenant');
  return data;
};

export const addTemplat = async (params: any): Promise<any> => {
  const data = await request.post('/device/template', params);
  return data;
};

export const putTemplat = async (params: any) => {
  const data = await request.put<any>(`/device/template`, params);
  return data;
};

export const getTemplat = async (id: any) => {
  const data = await request.get<any>(`/device/template/detail/${id}`);
  return data;
};

export const telemetryApi = async (params: any) => {
  const data = await request.get<Api.BaseApi.Data | null>('/device/model/telemetry', { params });
  return data;
};

export const telemetryLatestApi = async (id: any) => {
  const data = await request.get<Api.BaseApi.Data | null>(`/telemetry/datas/current/${id}`);
  return data;
};

export const getLatestTelemetryData = async () => {

    const data = await request.get<any>(`/device/telemetry/latest`);
    return data
};

export const attributesApi = async (params: any) => {
  const data = await request.get<Api.BaseApi.Data | null>('/device/model/attributes', { params });
  return data;
};

export const eventsApi = async (params: any) => {
  const data = await request.get<Api.BaseApi.Data | null>('/device/model/events', { params });
  return data;
};

export const commandsApi = async (params: any) => {
  const data = await request.get<Api.BaseApi.Data | null>('/device/model/commands', { params });
  return data;
};

export const addTelemetry = async (params: any): Promise<any> => {
  const data = await request.post('/device/model/telemetry', params);
  return data;
};

export const delTelemetry = async (id: string) => {
  const data = await request.delete<Api.BaseApi.Data>(`/device/model/telemetry/${id}`);
  return data;
};

export const delAttributes = async (id: string) => {
  const data = await request.delete<Api.BaseApi.Data>(`/device/model/attributes/${id}`);
  return data;
};

export const delEvents = async (id: string) => {
  const data = await request.delete<Api.BaseApi.Data>(`/device/model/events/${id}`);
  return data;
};

export const delCommands = async (id: string) => {
  const data = await request.delete<Api.BaseApi.Data>(`/device/model/commands/${id}`);
  return data;
};

export const putTelemetry = async (params: any): Promise<any> => {
  const data = await request.put('/device/model/telemetry', params);
  return data;
};

export const addAttributes = async (params: any): Promise<any> => {
  const data = await request.post('/device/model/attributes', params);
  return data;
};

export const putAttributes = async (params: any): Promise<any> => {
  const data = await request.put('/device/model/attributes', params);
  return data;
};

export const addEvents = async (params: any): Promise<any> => {
  const data = await request.post('/device/model/events', params);
  return data;
};

export const putEvents = async (params: any): Promise<any> => {
  const data = await request.put('/device/model/events', params);
  return data;
};

export const addCommands = async (params: any): Promise<any> => {
  const data = await request.post('/device/model/commands', params);
  return data;
};

export const putCommands = async (params: any): Promise<any> => {
  const data = await request.put('/device/model/commands', params);
  return data;
};

export const deviceCustomCommandsList = async (params: any): Promise<any> => {
  const data = await request.get('/device/model/custom/commands', { params });
  return data;
};

export const deviceCustomCommandsDel = async (paramsId: any): Promise<any> => {
  const data = await request.delete(`/device/model/custom/commands/${paramsId}`);
  return data;
};

export const deviceCustomCommandsAdd = async (params: any): Promise<any> => {
  const data = await request.post('/device/model/custom/commands', params);
  return data;
};

export const deviceCustomCommandsPut = async (params: any): Promise<any> => {
  const data = await request.put('/device/model/custom/commands', params);
  return data;
};

export const deviceCustomControlList = async (params: any): Promise<any> => {
  const data = await request.get('/device/model/custom/control', { params });
  return data;
};

export const deviceCustomControlDel = async (paramsId: any): Promise<any> => {
  const data = await request.delete(`/device/model/custom/control/${paramsId}`);
  return data;
};

export const deviceCustomControlAdd = async (params: any): Promise<any> => {
  const data = await request.post('/device/model/custom/control', params);
  return data;
};

export const deviceCustomControlPut = async (params: any): Promise<any> => {
  const data = await request.put('/device/model/custom/control', params);
  return data;
};

export const getOnlineDeviceTrend = async () => {
  const data = await request.get<Api.BaseApi.Data | null>('/board/trend');
  return data;
};

export const getAlarmCount = async () => {
  const data = await request.get<Api.BaseApi.Data | null>('/alarm/device/counts');
  return data;
};

export const getSystemMetricsCurrent = async (params?: any): Promise<any> => {
  // Assuming the endpoint returns a generic structure or the exact structure is unknown
  const data = await request.get<any>('/system/metrics/current', { params });
  return data;
};

export const getSystemMetricsHistory = async (params?: any): Promise<any> => {
  console.log('Fetching system metrics history with params:', params);
  try {
    const data = await request.get<any>('/system/metrics/history', { params });
    console.log('Raw response from /system/metrics/history:', data); // Log raw response
    return data;
  } catch (error) {
    console.error('Error fetching system metrics history:', error);
    throw error; // Re-throw the error after logging
  }
};