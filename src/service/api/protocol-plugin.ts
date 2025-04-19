import { request } from '../request';

export const fetchProtocolPluginList = async (params: any) => {
  const data = await request.get<Api.ApiApplyManagement.Data | null>(
    '/protocol_plugin',
    {
      params
    }
  );
  return data;
};

export const addProtocolPlugin = async (params: any) => {
  const data = await request.post<Api.BaseApi.Data>('/protocol_plugin', params);
  return data;
};

export const editProtocolPlugin = async (params: any) => {
  const data = await request.put<Api.BaseApi.Data>('/protocol_plugin', params);
  return data;
};

export const delProtocolPlugin = async (id: string) => {
  const data = await request.delete<Api.BaseApi.Data>(`/protocol_plugin/${id}`);
  return data;
};
