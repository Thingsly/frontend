/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace BaseApi {
    interface Data {
      name: string;
      code: number;
      message: string;
    }
  }
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      current: number;
      /** page size */
      size: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T extends NonNullable<unknown>> extends PaginatingCommonParams {
      records: T[];
    }

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = '1' | '2';

    /** common record */
    type CommonRecord<T extends NonNullable<unknown>> = {
      /** record id */
      id: number;
      /** record creator */
      createBy: string;
      /** record create time */
      createTime: string;
      /** record updater */
      updateBy: string;
      /** record update time */
      updateTime: string;
      /** record status */
      status: EnableStatus | null;
    } & T;
  }
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    type RoleType = 'SYS_ADMIN' | 'TENANT_ADMIN' | 'TENANT_USER';

    interface LoginToken {
      token: string;
      refreshToken: string;
      expires_in: number;
    }

    interface UserInfo {
      id?: string;
      userId?: string;
      userName: string;
      roles?: string[];
      authority: string;

      [key: string]: any;
    }
  }
  /**
   * namespace Route
   *
   * backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
      parent_id: string;
      title: string;
      multilingual: App.I18n.I18nKey;
      param2: string;
      element_code: string;
      param1: string;
      param3: string;
      orders: number;
      // element_type: 1 | 2 | 3 | 4 | 5;
      element_type: 1 | 3;
      authority: any;
      description: string;
      remark: string;
      route_path: string;
      children: MenuRoute[];
    }

    interface Data {
      list: MenuRoute[];
      total: number;
    }

    interface UserRoute {
      list: ElegantConstRoute[];
      home: import('@elegant-router/types').LastLevelRouteKey;
    }
  }
  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /** role */
    type Role = Common.CommonRecord<{
      /** role name */
      roleName: string;
      /** role code */
      roleCode: string;
      /** role description */
      roleDesc: string;
    }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'status'> & CommonSearchParams
    >;

    /** role list */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /** all role */
    type AllRole = Pick<Role, 'id' | 'roleName' | 'roleCode'>;

    /**
     * user gender
     *
     * - "1": "male"
     * - "2": "female"
     */
    type UserGender = '1' | '2';

    /** user */
    type User = Common.CommonRecord<{
      /** user name */
      userName: string;
      /** user gender */
      userGender: UserGender | null;
      /** user nickname */
      nickName: string;
      /** user phone */
      userPhone: string;
      /** user email */
      userEmail: string;
      /** user role code collection */
      userRoles: string[];
    }>;

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.User, 'userName' | 'userGender' | 'nickName' | 'userPhone' | 'userEmail' | 'status'> &
        CommonSearchParams
    >;

    /** user list */
    type UserList = Common.PaginatingQueryRecord<User>;

    /**
     * menu type
     *
     * - "1": directory
     * - "2": menu
     */
    type MenuType = '1' | '2';

    type MenuButton = {
      /**
       * button code
       *
       * it can be used to control the button permission
       */
      code: string;
      /** button description */
      desc: string;
    };

    /**
     * icon type
     *
     * - "1": iconify icon
     * - "2": local icon
     */
    type IconType = '1' | '2';

    type Menu = Common.CommonRecord<{
      /** parent menu id */
      parentId: number;
      /** menu type */
      menuType: MenuType;
      /** menu name */
      menuName: string;
      /** route name */
      routeName: string;
      /** route path */
      routePath: string;
      /** component */
      component?: string;
      /**
       * i18n key
       *
       * it is for internationalization
       */
      i18nKey?: App.I18n.I18nKey;
      /** iconify icon name or local icon name */
      icon: string;
      /** icon type */
      iconType: IconType;
      /** menu order */
      order: number;
      /** whether to cache the route */
      keepAlive?: boolean;
      /** outer link */
      href?: string;
      /** whether to hide the route in the menu */
      hideInMenu?: boolean;
      /**
       * The menu key will be activated when entering the route
       *
       * The route is not in the menu
       *
       * @example
       *   the route is "user_detail", if it is set to "user_list", the menu "user_list" will be activated
       */
      activeMenu?: import('@elegant-router/types').LastLevelRouteKey;
      /** By default, the same route path will use one tab, if set to true, it will use multiple tabs */
      multiTab?: boolean;
      /** If set, the route will be fixed in tabs, and the value is the order of fixed tabs */
      fixedIndexInTab?: number;
      /** menu buttons */
      buttons?: MenuButton[];
      /** children menu */
      children?: Menu[];
    }>;

    type SystemLogSearchParams = {
      page: number;
      page_size: number;
      username?: string | null;
      start_time?: string | null;
      end_time?: string | null;
    };

    type SystemLogList = {
      id?: string;
      ip?: string;
      path?: string;
      user_id?: string;
      name?: null | string;
      created_at?: Date;
      latency?: number;
      request_message?: string;
      response_message?: string;
      tenant_id?: string;
      remark?: null;
    };
  }

  namespace ApiApplyManagement {
    interface Service {
      id: string;
      name: string | null;
      device_type: string | number;
      protocol_type: string;
      description: string | null;
      http_address: string | null;
      access_address: string | null;
      sub_topic_prefix: string | null;
      additional_info: string;
      ts: string;
      language_code: string;
    }

    interface Data {
      list: Service[];
      total: number;
    }
  }

  namespace GeneralSetting {
    interface ThemeSetting {
      /** id */
      id: string;
      system_name: string | null;
      logo_background: string | undefined;
      logo_loading: string | undefined;
      logo_cache: string | undefined;
      home_background: string | undefined;
    }

    interface DataClearSetting {
      /** id */
      id: string;
      data_type: string;
      enabled: string;
      retention_days: number;
      last_cleanup_time: string | null;
      last_cleanup_data_time: string | null;
      remark: string | null;
    }

    interface DataClear {
      list: DataClearSetting[];
      total: number;
    }

    interface Theme {
      list: ThemeSetting[];
      total: number;
    }
  }
  namespace NotificationServices {
    interface Email {
      id: string;
      config: string;
      email_config: any;
      notice_type: string;
      remark: string;
      status: string;
    }
    interface PushNotification {
      pushServer: string;
    }
  }
  namespace UserManagement {
    interface User {
      id: string;
      email: string | null;
      name: string | null;
      description: string | null;
      phone_number: string;
      status: 'F' | 'N' | null;
      gender: '0' | '1' | null;
      remark: string | null;
      created_at: string | null;
      updated_at: string | null;
      lastVisitTime: string | null;
    }
    interface UserKey {

      id: string;

      name: string | null;

      api_key: string | null;

      status: 0 | 1 | null;

      created_at: string | null;

      updated_at: string | null;

      show: boolean | false;

      tenant_id: string | null;
    }

    interface Data {
      list: User[];
      total: number;
    }
    interface KeyData {
      list: UserKey[];
      total: number;
    }
  }

  namespace RuleEngine {
    interface Rule {

      id: string;

      name: string | null;
      status: '1' | '2' | null;
    }
  }
  namespace DataService {
    interface Data {

      id: string;

      name: string | null;

      appKey: string | null;

      signMode: string | null;

      ip: string | null;

      flag: string | null;
      dataInterval: string | null;
      desc: string | null;
      createTime: string | null;
      status: '1' | '2' | null;
    }
  }
  namespace ApplyManagement {
    interface Service {

      id: string;

      name: string | null;

      serviceType: string | null;

      desc: string | null;

      author: string | null;

      version: string | null;
      status: '1' | '2' | null;
    }
  }


  namespace device {
    interface addDeviceModel {
      additional_info: string;
      created_at: string;
      data_identifier: string;
      data_name: string;
      data_type: string;
      description: string;
      device_template_id: string;
      id: string;
      read_write_flag: string;
      remark: string;
      tenant_id: string;
      unit: string;
      updated_at: string;

      [property: string]: any;
    }
  }


  namespace Alarm {
    interface NotificationGroupParams {
      name?: string;
      notification_type?: string;
      page: number;
      page_size: number;
      status?: string;
      tenant_id?: string;
    }

    interface AddNotificationGroupParams {
      name: string;
      description?: string;
      notification_config?: string;
      notification_type: string;
      remark?: string;
      status: string;
      tenant_id?: string;
    }

    interface NotificationGroupList {
      created_at: Date;
      description: string;
      id: string;
      name: string;
      notification_config: string;
      notification_type: string;
      remark: string;
      status: string;
      tenant_id: string;
      updated_at: Date;
    }

    interface NotificationHistoryParams {
      page: number;
      page_size: number;
      notification_type: string;
      send_target?: string;
      send_time_start?: string;
      send_time_stop?: string;
    }

    interface NotificationHistoryList {
      page: number;
      page_size: number;
      notification_type: string;
      send_target?: string;
      send_time_start?: string;
      send_time_stop?: string;
    }
  }

  namespace Irrigation {
    interface AddTimeIrrigation {
      name: string | null;
      space_id: string | null;
      district_id: string | null;
      device_id: string | null;
      irrigation_time: string | null;
      schedule: string | null;
      control_type: string | null;
      irrigation_duration: number | null;
      valve_opening: number | null;
      status?: string | null;
      remark: string | null;
      [key: string]: any;
    }
  }

  /**
   * namespace Device
   *
   * backend api module: "device"
   */
  namespace Device {
    interface DeviceSelectItem {
      device_id: string;
      device_name: string;
    }

    interface DeviceSelectorParams {
      page?: string;
      page_size?: string;
      has_device_config?: boolean;
    }

  }
}
