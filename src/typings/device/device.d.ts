declare namespace DeviceManagement {
  interface Group {
    id: string;
    parent_id: string;
    tier: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    remark: string | null;
    tenant_id: string;
  }

  interface TreeNode {
    group: Group;
    children?: TreeNode[];
  }

  type TreeStructure = TreeNode[];

  interface DetailData {
    detail: {
      created_at: string;
      description: string;
      id: string;
      name: string;
      parent_id: string;
      remark: string;
      tenant_id: string;
      tier: number;
      updated_at: string;
    };
    tier: {
      group_path: string;
    };
  }

  interface GroupDeviceData {
    any;
  }

  interface DeviceData {
    id: string;
    activate_flag: string;
    current_version: string;
    device_config_id: string;
    device_number: string;
    device_type: number;
    group_id: string;
    is_enabled: string;
    label: string;
    name: string;
    product_id: string;
    protocol: string;
  }

  interface DeviceDatas {
    list: DeviceData[];
    total: number;
  }

  interface DeviceDetail {
    id: string;
    name: string;
    voucher: string;
    tenant_id: string;
    is_enabled: string;
    activate_flag: string;
    created_at: string;
    update_at: string;
    device_number: string;
    product_id: string;
    parent_id: string;
    label: string;
    location: string;
    sub_device_addr: string;
    current_version: string;
    additional_info: string;
    protocol_config: string;
    device_config_name: string;
    remark1: string;
    remark2: string;
    remark3: string;
    device_config_id: string;
    batch_number: string;
    activate_at: string;
    is_online: number; 
  }

  interface telemetryData {
    device_id: string;
    key: string;
    tenant_id: string;
    ts: string;
    value: number;
    unit: string;
    label: string;
    name: string;
  }

  interface telemetryCurrent {
    data: telemetryData[];
  }

  interface ConfigData {
    id: string;
    name: string;
    device_template_id: string;
    device_type: string;
    protocol_type: string;
    voucher_type: string;
    protocol_config: string;
    device_conn_type: string;
    additional_info: string;
    description: string;
    tenant_id: string;
    created_at: string;
    updated_at: string;
    remark: null;
    device_count: number;
  }

  interface ConfigDatas {
    list: ConfigData[];
    total: number;
  }

  interface ProtocolAndServiceData {
    name: string;
    service_identifier: string;
  }

  interface ProtocolAndService {
    protocal: ProtocolAndServiceData[];
    service: ProtocolAndServiceData[];
  }

  interface ServiceData {
    id: string;
    name: string;
    service_plugin_id: string;
    voucher: string;
    description: string;
    service_access_config: string;
    remark: string;
    create_at: string;
    update_at: string;
    tenant_id: string;
  }

  interface ServiceList {
    list: ServiceData[];
    total: number;
  }
}
