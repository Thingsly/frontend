import { request } from '../request';

export const fetchThemeSetting = async () => {
  const data = await request.get<Api.GeneralSetting.Theme | null>('/logo');
  return data;
};

export const editThemeSetting = async (params: any) => {
  const data = await request.put<Api.BaseApi.Data>('/logo', params);
  return data;
};

export const fetchDataClearList = async (params: any) => {
  const data = await request.get<Api.GeneralSetting.DataClear | null>(
    '/datapolicy',
    {
      params
    }
  );
  return data;
};

export const editDataClear = async (params: any) => {
  const data = await request.put<Api.BaseApi.Data>('/datapolicy', params);
  return data;
};

export const dictQuery = async (params: any) => {
  return await request.get<Api.BaseApi.Data | any>('dict/enum', { params });
};

export const getFunction = async () => {
  return await request.get<Api.BaseApi.Data | any>('/sys_function');
};

export const editFunction = async (param: { function_id: string }) => {
  return await request.put<Api.BaseApi.Data | any>(
    `/sys_function/${param.function_id}`
  );
};
