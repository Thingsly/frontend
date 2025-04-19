/** Custom route types for the permission management module */
declare namespace CustomRoute {
  interface Route extends Api.Route.MenuRoute {}

  /**
   * Cleanup types
   *
   * - 1: Menu
   * - 2: Directory
   * - 3: Route
   * - 4: Button
   */
  type routerTypeKey = NonNullable<Route['element_type']>;

  /**
   * Types
   *
   * - SYS_ADMIN: System Administrator
   * - TENANT_USER: Tenant User
   * - TENANT_ADMIN: Tenant Administrator
   */
  type routerSysFlagKey = string;
}

/** Application Management - Service Management Module */
declare namespace ServiceManagement {
  interface Service extends Api.ApiApplyManagement.Service {}
  /** Device Type */
  type DeviceTypeKey = NonNullable<Service['device_type']>;
  /** Protocol Type */
  type ProtocolTypeKey = NonNullable<Service['protocol_type']>;
}

/** Rule Engine Module */
declare namespace RuleEngine {
  interface Rule extends Api.RuleEngine.Rule {
    /** Serial Number */
    index: number;
  }

  /**
   * Rule engine status
   *
   * - 1: Enabled
   * - 2: Paused
   */
  type StatusKey = NonNullable<Rule['status']>;
}

/** Data Service Module */
declare namespace DataService {
  interface Data extends Api.DataService.Data {
    /** Serial Number */
    index: number;
    /** SQL */
    SQL: string | null;
    /** SQL Writing Aid */
    SQLWritingAid: string | null;
  }

  /**
   * Signature method
   *
   * - 1: MD5
   * - 2: HAS256
   */
  type SignModeKey = NonNullable<Data['signMode']>;

  /**
   * API support flags
   *
   * - 1: HTTP API
   * - 2: HTTP and WS APIs
   */
  type FlagKey = NonNullable<Data['flag']>;

  /**
   * Rule engine status
   *
   * - 1: Enabled
   * - 2: Stopped
   */
  type StatusKey = NonNullable<Data['status']>;
}

/** General Settings */
declare namespace GeneralSetting {
  interface ThemeSetting extends Api.GeneralSetting.ThemeSetting {}
  interface DataClearSetting extends Api.GeneralSetting.DataClearSetting {}

  /**
   * Cleanup types
   *
   * - 1: Operation Logs
   * - 2: Device Data
   */
  type CleanupTypeKey = NonNullable<DataClearSetting['data_type']>;
  /**
   * Whether to enable
   *
   * - 1: Enabled
   * - 2: Disabled
   */
  type EnabledTypeKey = NonNullable<DataClearSetting['enabled']>;
}

declare namespace NotificationServices {
  interface Email extends Api.NotificationServices.Email {}
  interface PushNotification extends Api.NotificationServices.PushNotification {}

  /**
   * Enable/Disable Service
   *
   * - OPEN: Enable
   * - CLOSE: Disable
   */
  type StatusKey = NonNullable<Email['status']>;
}

declare namespace UserManagement {
  interface User extends Api.UserManagement.User {}

  interface UserKey extends Api.UserManagement.UserKey {}

  /**
   * User gender
   *
   * - 0: Female
   * - 1: Male
   */
  type GenderKey = NonNullable<User['gender']>;

  /**
   * User status
   *
   * - N: Normal
   * - F: Frozen
   */
  type UserStatusKey = NonNullable<User['status']>;
}

// Device Information
declare namespace AddDeviceModel {
  interface Device extends Api.device.addDeviceModel {}
}
