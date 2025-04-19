import type { AxiosInstance } from 'axios';
import { request } from '../request';

export default class Device {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  getData(name: string) {
    this.http.get('');
    return name;
  }
}

export const getDeviceGroup = async (params: any) => {
  return await request.get<any>('/device/group', { params });
};

export const deviceDictProtocolService = async (params: any) => {
  return await request.get<DeviceManagement.TreeStructure | any>(
    '/dict/protocol/service',
    params
  );
};

export const deviceDictProtocolServiceFirstLevel = async (params: any) => {
  return await request.get<DeviceManagement.ProtocolAndService | any>(
    '/service/plugin/select',
    params
  );
};

export const deviceDictProtocolServiceSecondLevel = async (params: any) => {
  return await request.get<DeviceManagement.ServiceList | any>(
    '/service/access/list',
    params
  );
};

export const deviceGroupTree = async (params: any) => {
  return await request.get<DeviceManagement.TreeStructure | any>(
    '/device/group/tree',
    params
  );
};

export const deviceGroup = async (params: {
  id: string;
  parent_id: string;
  name: string;
  description: string;
}) => {
  return await request.post<Api.BaseApi.Data>('/device/group', params);
};

export const putDeviceGroup = async (params: {
  id: string;
  parent_id: string;
  name: string;
  description: string;
}) => {
  return await request.put<Api.BaseApi.Data>('/device/group', params);
};

export const putDeviceActive = async (params: any) => {
  return await request.put<Api.BaseApi.Data>('/device/active', params);
};

export const deleteDeviceGroup = async (params: { id: string }) => {
  return await request.delete<Api.BaseApi.Data>(`/device/group/${params.id}`);
};

export const deviceGroupDetail = async (params: any) => {
  return await request.get<DeviceManagement.DetailData>(
    `/device/group/detail/${params.id}`
  );
};

export const deviceList = async (params: any) => {
  return await request.get<DeviceManagement.DeviceDatas | any>(`/device`, {
    params
  });
};

export const deviceDelete = async (params: any) => {
  return await request.put<DeviceManagement.DeviceDatas | any>(
    `/device/update/config`,
    params
  );
};

export const deviceListByGroup = async (params: any) => {
  return await request.get<DeviceManagement.DeviceDatas | any>(
    `/device/group/relation/list`,
    {
      params
    }
  );
};

export const deviceDetail = async (id: any) => {
  const url = `/device/detail/${id}`;
  return await request.get<DeviceManagement.DeviceDetail | any>(url);
};

export const deviceGroupRelation = async (params: any) => {
  return await request.post<Api.BaseApi.Data>(`/device/group/relation`, params);
};

export const getDeviceGroupRelation = async (params: any) => {
  return await request.get<any>(`/device/group/relation`, { params });
};

export const deviceAlarmStatus = async (params: any) => {
  return await request.get<any>(`/alarm/info/history/device`, { params });
};

export const deviceAlarmHistory = async (params: any) => {
  return await request.get<any>(`/alarm/info/history`, { params });
};

export const deviceAlarmList = async (params: any) => {
  return await request.get<any>(`/scene_automations/alarm`, { params });
};

export const deviceAlarmHistoryPut = async (params: any) => {
  return await request.put<any>(`/alarm/info/history`, params);
};

export const deviceTemplate = async (params: any) => {
  return await request.get<Api.BaseApi.Data | any>(`/device/template`, {
    params
  });
};

export const getServiceList = async (params: any) => {
  return await request.get<Api.BaseApi.Data | any>(`/service/list`, {
    params
  });
};

export const deviceTemplateDetail = async (params: any) => {
  return await request.get<Api.BaseApi.Data | any>(
    `/device/template/detail/${params.id}`
  );
};

export const deviceConfig = async (params: any) => {
  return await request.get<Api.BaseApi.Data | any>(`/device_config`, {
    params
  });
};

export const deviceConfigAdd = async (params: any) => {
  return await request.post<Api.BaseApi.Data | any>(`/device_config`, params);
};

export const deviceConfigEdit = async (params: any) => {
  return await request.put<Api.BaseApi.Data | any>(`/device_config`, params);
};

export const deviceConfigInfo = async (params: any) => {
  return await request.get<Api.BaseApi.Data | any>(
    `device_config/${params.id}`
  );
};

export const deviceConfigDel = async (params: any) => {
  return await request.delete<Api.BaseApi.Data | any>(
    `device_config/${params.id}`
  );
};

export const deviceConfigVoucherType = async (params: any) => {
  return await request.get<Api.BaseApi.Data | any>(
    `/device_config/voucher_type`,
    { params }
  );
};

export const protocolPluginConfigForm = async (params: any) => {
  return await request.get<any>(`/protocol_plugin/config_form`, { params });
};

export const deviceConfigBatch = async (params: any) => {
  return await request.put<Api.BaseApi.Data | any>(
    `/device_config/batch`,
    params
  );
};

export const deleteDeviceGroupRelation = async (params: any) => {
  return await request.delete2<Api.BaseApi.Data>(
    `/device/group/relation`,
    params
  );
};

export const getDeviceConnectInfo = async (params: any) => {
  return await request.get<Api.BaseApi.Data | any>(`/device/connect/info`, {
    params
  });
};

export const getPlugininfoByService = async (params: any) => {
  return await request.get<Api.BaseApi.Data | any>(`/service/plugin/info`, {
    params
  });
};

export const getDeviceConfigList = async (params: any) => {
  return await request.get<DeviceManagement.ConfigDatas>(`/device_config`, {
    params
  });
};

export const updateDeviceVoucher = async (params: any) => {
  return await request.post<any>(`/device/update/voucher`, params);
};
export const deviceAdd = async (params: any) => {
  return await request.post<any>(`/device`, params);
};
export const devicCeonnectForm = async (params: any) => {
  return await request.get<any>(`/device/connect/form`, { params });
};

export const checkDevice = async (deviceNumber: { deviceNumber: any }) => {
  const url = `/device/check/${deviceNumber}`;
  return await request.get<any>(url);
};
export const deleteDevice = async (params: any) => {
  return await request.delete<Api.BaseApi.Data | any>(`/device/${params.id}`);
};

export const setDeviceScriptEnable = async (params: any) => {
  return await request.put<any>(`/data_script/enable`, params);
};

export const getDataScriptList = async (params: any) => {
  return await request.get<DeviceManagement.ConfigDatas | any>(`/data_script`, {
    params
  });
};

export const dataScriptAdd = async (params: any) => {
  return await request.post<Api.BaseApi.Data | any>(`/data_script`, params);
};

export const dataScriptEdit = async (params: any) => {
  return await request.put<Api.BaseApi.Data | any>(`/data_script`, params);
};

export const dataScriptQuiz = async (params: any) => {
  return await request.post<Api.BaseApi.Data | any>(
    `/data_script/quiz`,
    params,
    { needMessage: true } as any
  );
};

export const dataScriptDel = async (params: any) => {
  return await request.delete<Api.BaseApi.Data | any>(
    `data_script/${params.id}`
  );
};

export const telemetryDataCurrent = async (id: any) => {
  const url = `/telemetry/datas/current/${id}`;
  return await request.get<DeviceManagement.telemetryCurrent | any>(url);
};

/**
 * @param params {device_id:string,keys:string}
 * @returns
 */
export const telemetryDataCurrentKeys = async (params: any) => {
  return await request.get<any>('/telemetry/datas/current/keys', { params });
};

/**
 * @param params { device_id: string, key: string, start_time: string, end_time: string, aggregate_window: string,
 *   aggregate_function: string, time_range: string }
 * @returns
 */
export const telemetryDataHistoryList = async (params: any) => {
  return await request.get<any>('/telemetry/datas/statistic', { params });
};

export const telemetryDataDel = async (params: any) => {
  return await request.delete2<Api.BaseApi.Data | any>(
    `telemetry/datas`,
    params
  );
};

export const getTelemetryLogList = async (params: any) => {
  return await request.get<any>(`/telemetry/datas/set/logs`, { params });
};

export const telemetryDataPub = async (params: any) => {
  return await request.post<any>(`/telemetry/datas/pub`, params);
};

export const expectMessageAdd = async (params: any) => {
  return await request.post<any>(`/expected/data`, params);
};

export const expectMessageList = async (params: any) => {
  return await request.get<any>(`/expected/data/list`, { params });
};

export const expectMessageDelete = async (params: any) => {
  return await request.delete<any>(`/expected/data/${params}`);
};
export const getAttributeDataSet = async (params: any) => {
  return await request.get<any>(`attribute/datas/${params.device_id}`);
};

export const deleteAttributeDataSet = async (params: any) => {
  return await request.delete<any>(`attribute/datas/${params}`);
};

export const getAttributeDataSetLogs = async (params: any) => {
  return await request.get<any>(`/attribute/datas/set/logs`, { params });
};

export const attributeDataPub = async (params: any) => {
  return await request.post<any>(`/attribute/datas/pub`, params);
};

/**
 * @param params {device_id:string,key:string}
 * @returns
 */
export const getAttributeDatasKey = async (params: any) => {
  return await request.get<any>('/attribute/datas/key', { params });
};

export const getEventDataSet = async (params: any) => {
  return await request.get<any>(`/event/datas`, { params });
};

export const getCommandDataSetLogs = async (params: any) => {
  return await request.get<any>(`/command/datas/set/logs`, { params });
};

export const commandDataPub = async (params: any) => {
  return await request.post<any>(`/command/datas/pub`, params);
};

export const commandDataById = async (id: any) => {
  const url = `/command/datas/${id}`;
  return await request.get<DeviceManagement.telemetryCurrent | any>(url);
};

export const deviceTemplateSelect = async () => {
  const url = `/device/template/chart/select`;
  return await request.get<any>(url);
};

export const telemetryHistoryData = async (params: any) => {
  return await request.get<any>(`/telemetry/datas/history/page`, {
    params
  });
};

export const deviceUpdateConfig = async (params: any) => {
  return await request.put<any>(`/device/update/config`, params);
};

export const deviceConfigMenu = async (params: any) => {
  return await request.get<any>(`/device/template/menu`, { params });
};

export const deviceLocation = async (params: any) => {
  return await request.put<any>(`/device`, params);
};

export const deviceUpdate = async (params: any) => {
  return await request.put<Api.BaseApi.Data>('/device', params);
};

export const childDeviceTableList = async (params: any) => {
  return await request.get<any>(`/device/sub-list/${params.id}`, {
    params
  });
};

export const childDeviceSelectList = async () => {
  return await request.get<any>(`/device/list`, {});
};

export const addChildDevice = async (params: any) => {
  return await request.post<any>(`/device/son/add`, params);
};

export const removeChildDevice = async (params: any) => {
  return await request.put<any>(`/device/sub-remove`, params);
};

export const getSimulation = async (params: any) => {
  return await request.get<any>(`/telemetry/datas/simulation`, { params });
};

export const sendSimulation = async (params: any) => {
  return await request.post<any>(`/telemetry/datas/simulation`, params);
};

export const deviceCustomCommandsIdList = async (paramsId: any) => {
  return await request.get<any>(`/device/model/custom/commands/${paramsId}`);
};

export const deviceProtocalServiceList = async (params: any) => {
  return await request.get<any>(`/service/plugin/select`, { params });
};
