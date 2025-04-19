import { request } from '../request';

export const deviceListAll = async (params: any) => {
  return await request.get<any>('/device/tenant/list', { params });
};

export const deviceConfigAll = async (params: any) => {
  return await request.get<any>('/device_config/menu', { params });
};

export const deviceMetricsConditionMenu = async (params: any) => {
  return await request.get<any>(`/device/metrics/condition/menu`, { params });
};

export const configMetricsConditionMenu = async (params: any) => {
  return await request.get<any>(`/device_config/metrics/condition/menu`, {
    params
  });
};

export const deviceMetricsMenu = async (params: any) => {
  return await request.get<any>(`/device/metrics/menu`, { params });
};

export const deviceConfigMetricsMenu = async (params: any) => {
  return await request.get<any>(`/device_config/metrics/menu`, { params });
};

export const sceneAdd = async (params: any) => {
  return await request.post<any>(`/scene`, params);
};

export const sceneEdit = async (params: any) => {
  return await request.put<any>(`/scene`, params);
};

export const sceneGet = async (params: any) => {
  return await request.get<any>(`/scene`, { params });
};

export const sceneDel = async (id: any) => {
  return await request.delete<any>(`/scene/${id}`);
};

export const sceneInfo = async (id: any) => {
  return await request.get<any>(`/scene/detail/${id}`);
};

export const sceneLog = async (params: any) => {
  return await request.get<any>(`/scene/log`, { params });
};

export const sceneActive = async (id: any) => {
  return await request.post<any>(`/scene/active/${id}`);
};

export const sceneAutomationsAdd = async (params: any) => {
  return await request.post<any>(`/scene_automations`, params);
};

export const sceneAutomationsEdit = async (params: any) => {
  return await request.put<any>(`/scene_automations`, params);
};

export const sceneAutomationsGet = async (params: any) => {
  return await request.get<any>(`/scene_automations/list`, { params });
};

export const sceneAutomationsDel = async (id: any) => {
  return await request.delete<any>(`/scene_automations/${id}`);
};

export const sceneAutomationsInfo = async (id: any) => {
  return await request.get<any>(`/scene_automations/detail/${id}`);
};

export const sceneAutomationsLog = async (params: any) => {
  return await request.get<any>(`/scene_automations/log`, { params });
};

export const sceneAutomationsSwitch = async (id: any) => {
  return await request.post<any>(`/scene_automations/switch/${id}`);
};
