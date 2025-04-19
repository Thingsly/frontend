import { request } from '../request';

export const addWarningMessage = async (params: any): Promise<any> => {
  const data = await request.post<Api.BaseApi.Data>('/alarm/config', params);
  return data;
};

export const warningMessageList = async (params: any): Promise<any> => {
  const data = await request.get<Api.UserManagement.Data | null>(
    '/alarm/config',
    {
      params
    }
  );
  return data;
};

export const editInfo = async (params: any): Promise<any> => {
  const data = await request.put<Api.BaseApi.Data>('/alarm/config', params);
  return data;
};

export const editInfoText = async (params: any): Promise<any> => {
  const data = await request.put<Api.BaseApi.Data>('/alarm/config', params);
  return data;
};

export const delInfo = async (id: string): Promise<any> => {
  const data = await request.delete<Api.BaseApi.Data>(`/alarm/config/${id}`);
  return data;
};

export const infoList = async (params: any): Promise<any> => {
  const data = await request.get<Api.UserManagement.Data | null>(
    '/alarm/info',
    {
      params
    }
  );
  return data;
};

export const alarmHistory = async (params: any): Promise<any> => {
  const data = await request.get<Api.UserManagement.Data | null>(
    '/alarm/info/history',
    {
      params
    }
  );
  return data;
};

export const processingOperation = async (params: any): Promise<any> => {
  const data = await request.put<Api.BaseApi.Data>('/alarm/info', params);
  return data;
};

export const batchProcessing = async (params: any): Promise<any> => {
  const data = await request.put<Api.BaseApi.Data>('/alarm/info/batch', params);
  return data;
};
