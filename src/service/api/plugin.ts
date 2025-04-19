import { request } from '../request';

export const getServices = async (params: any) => {
  return await request.get<Panel.Data>('/service/list', { params });
};

export const registerService = async (params: any) => {
  return await request.post<Panel.Data>('/service', params);
};

export const putRegisterService = async (params: any) => {
  return await request.put<Panel.Data>('/service', params);
};

export const delRegisterService = async (id: any) => {
  return await request.delete<Panel.Data>(`/service/${id}`);
};

export const getServiceAccess = async (params: any) => {
  return await request.get<Panel.Data>('/service/access/list', { params });
};

export const getServiceAccessForm = async (params: any) => {
  return await request.get<Panel.Data>('/service/access/voucher/form', {
    params
  });
};

export const delServiceAccess = async (id: any) => {
  return await request.delete<Panel.Data>(`/service/access/${id}`);
};

export const createServiceDrop = async (params: any) => {
  return await request.post<Panel.Data>('/service/access', params);
};

export const putServiceDrop = async (params: any) => {
  return await request.put<Panel.Data>('/service/access', params);
};

export const getServiceListDrop = async (params: any) => {
  return await request.get<Panel.Data>('/service/access/device/list', {
    params
  });
};

export const getSelectServiceMenuList = async (params: any) => {
  return await request.get<Panel.Data>('/device_config/menu', {
    params
  });
};

export const batchAddServiceMenuList = async (params: any) => {
  return await request.post<Panel.Data>('/device/service/access/batch', params);
};

// export const putServiceMenuDrop = async (params: any) => {
//   return await request.put<Panel.Data>("/service/access", params);
// };
