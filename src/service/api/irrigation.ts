import type { AxiosInstance } from 'axios';
import { request } from '../request';

export default class Irrigation {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  getData(name: string) {
    this.http.get('');
    return name;
  }
}

export const getIrrigationSpaces = async () => {
  return await request.get<any>('irrigation/spaces');
};

export const getIrrigationDistricts = async (params: any) => {
  return await request.get<any>('irrigation/districts', { params });
};

export const getIrrigationDiveces = async (params: { id: string }) => {
  return await request.get<any>(`irrigation/districts/device/${params.id}`);
};

export const addTimeIrrigation = async (params: any) => {
  return await request.post<any>(`irrigation/scheduled`, params);
};

export const editTimeIrrigation = async (params: any) => {
  return await request.put<any>(`irrigation/scheduled`, params);
};

export const getIrrigationTimeList = async (params: any) => {
  return await request.get<any>(`irrigation/scheduled`, { params });
};

export const irrigationTimeDistribute = async (
  id: string,
  params: { status: 2 | 3 }
) => {
  return await request.get<any>(`/irrigation/scheduled/execute/${id}`, {
    params
  });
};

export const irrigationTimeCancle = async (params: {
  id: string;
  status: 2 | 3;
}) => {
  return await request.put<any>(`/irrigation/scheduled/cancel/${params.id}`, {
    params
  });
};

export const irrigationTimeDel = async (id: string) => {
  return await request.delete<any>(`/irrigation/scheduled/${id}`);
};

export const irrigationTimeHistorys = async (params: any) => {
  return await request.get<any>(`/irrigation/scheduled/historys`, { params });
};

export const irrigationRotationDeviceList = async () => {
  return await request.get<any>(`/irrigation/districts/device/get`, {
    params: { page: 1, page_size: 100 }
  } as any);
};

export const addIrrigationRotation = async (params: any) => {
  return await request.post<any>(`/irrigation/rotation`, params);
};

export const editIrrigationRotation = async (params: any) => {
  return await request.put<any>(`/irrigation/rotation`, params);
};

export const irrigationRotationList = async (params: any) => {
  return await request.get<any>(`/irrigation/rotation`, { params });
};

export const irrigationRotationExecute = async (params: any) => {
  return await request.put<any>(`/irrigation/rotation/execute/${params.id}`, {
    status: params.stauts
  });
};

export const irrigationRotationCancel = async (params: any) => {
  return await request.put<any>(`/irrigation/rotation/cancel/${params.id}`);
};

export const irrigationRotationDel = async (params: any) => {
  return await request.delete<any>(`/irrigation/rotation/${params}`);
};

export const irrigationRotationHistorys = async (params: any) => {
  return await request.get<any>(`/irrigation/rotation/historys`, { params });
};

export const irrigationRotationHistorysDetail = async (params: any) => {
  return await request.get<any>(`irrigation/rotation/result/${params.id}`, {
    params
  });
};

export const irrigationRotationDetail = async (id: any) => {
  return await request.get<any>(`/irrigation/rotation/${id}`);
};

export const addIrrigationGroup = async (params: any) => {
  return await request.post<any>(`/irrigation/group`, params);
};

export const getIrrigationGroupList = async (params: any) => {
  return await request.get<any>(`/irrigation/group`, { params });
};

export const irrigationGroupDeviceList = async (params: any) => {
  return await request.get<any>(`/irrigation/districts/device/get`, { params });
};

export const irrigationGroupDeviceDetail = async (id: any) => {
  return await request.get<any>(`/irrigation/group/${id}`);
};

export const irrigationGroupDeviceTypes = async () => {
  return await request.get<any>('/dict/enum', {
    params: { dict_code: 'PRODUCT_TYPE' }
  });
};

export const irrigationGroupExcute = async (id: string) => {
  return await request.get<any>(`irrigation/group/execute/${id}`, {
    params: { status: 3 }
  });
};

export const irrigationGroupCancle = async (id: string) => {
  return await request.put<any>(`/irrigation/group/cancel/${id}`, {
    id,
    status: 3
  });
};

export const irrigationGroupDel = async (id: string) => {
  return await request.delete<any>(`/irrigation/group/${id}`);
};

export const irrigationGroupHistorys = async (params: any) => {
  return await request.get<any>(`/irrigation/group/historys`, { params });
};

export const irrigationGroupHistoryDetail = async (params: any) => {
  return await request.get<any>(`/irrigation/group/result`, { params });
};
