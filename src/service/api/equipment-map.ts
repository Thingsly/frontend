import { request } from '../request';

export const spacesList = async (params: any): Promise<any> => {
  return await request.get<Api.BaseApi.Data>(
    'http://103.124.93.210:9999/api/v1/irrigation/spaces',
    { params }
  );
};

export const areasList = async (params: any): Promise<any> => {
  return await request.get<Api.BaseApi.Data>(
    'http://103.124.93.210:9999/api/v1/irrigation/districts',
    { params }
  );
};

export const areaDetail = async (id: any): Promise<any> => {
  return await request.get<Api.BaseApi.Data>(
    `http://103.124.93.210:9999/api/v1/irrigation/districts/${id}`
  );
};

export const apaceDetail = async (id: any): Promise<any> => {
  return await request.get<Api.BaseApi.Data>(
    `http://103.124.93.210:9999/api/v1/irrigation/spaces/${id}`
  );
};

export const areaData = async (id: any): Promise<any> => {
  return await request.get<Api.BaseApi.Data>(
    `http://103.124.93.210:9999/api/v1/irrigation/districts/${id}`
  );
};

// export const editSpaces = async (id: any) => {
//   const data = await request.put<any>(
//     `http://103.124.93.210:9999/api/v1/irrigation/spaces/${id}`,
//   );
//   return data;
// };
export const editSpaces = async (params: any) => {
  return await request.put<Api.BaseApi.Data>(
    `http://103.124.93.210:9999/api/v1/irrigation/spaces/${params.id}`,
    params
  );
};

export const addSpace = async (data: any): Promise<any> => {
  return await request.post<Api.BaseApi.Data>(
    'http://103.124.93.210:9999/api/v1/irrigation/spaces',
    data
  );
};

export const addArea = async (data: any): Promise<any> => {
  return await request.post<Api.BaseApi.Data>(
    'http://103.124.93.210:9999/api/v1/irrigation/districts',
    data
  );
};

export const deleteArea = async (id: any): Promise<any> => {
  return await request.delete<Api.BaseApi.Data>(
    `http://103.124.93.210:9999/api/v1/irrigation/districts/${id}`
  );
};

export const spacesData = async (params: any): Promise<any> => {
  return await request.get(
    'http://103.124.93.210:9999/api/v1/irrigation/devices/spaces',
    { params }
  );
};

export const sumData = async (params: any): Promise<any> => {
  return await request.get(
    'http://103.124.93.210:9999/api/v1/board/tenant/device/info',
    { params }
  );
};

// export const editArea = async (id: any) => {
//   const data = await request.put<any>(
//     `http://103.124.93.210:9999/api/v1/irrigation/districts/${id}`,
//   );
//   return data;
// };

export const editArea = async (params: any) => {
  const data = await request.put<Api.BaseApi.Data>(
    `http://103.124.93.210:9999/api/v1/irrigation/districts/${params.spaces_id}`
  );
  return data;
};
