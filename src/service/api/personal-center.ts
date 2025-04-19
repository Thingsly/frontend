import { request } from '../request';

export const fetchUserInfo = async () => {
  return await request.get<Api.BaseApi.Data | any>('/board/user/info', {});
};

export const changeInformation = async (params: any): Promise<any> => {
  const data = await request.post<Api.BaseApi.Data>(
    '/board/user/update',
    params
  );
  return data;
};

export const passwordModification = async (params: any): Promise<any> => {
  const data = await request.post('/board/user/update/password', params);
  return data;
};

export const uploadFile = async (params: any): Promise<any> => {
  const data = await request.post<Api.BaseApi.Data>('/file/up', params);
  return data;
};
