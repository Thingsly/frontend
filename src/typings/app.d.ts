/** The global namespace for the app */
declare namespace App {
  /** Theme namespace */
  namespace Theme {
    type ColorPaletteNumber = import('@sa/color-palette').ColorPaletteNumber;

    /** Theme token */
    type ThemeToken = {
      colors: ThemeTokenColor;
      boxShadow: {
        header: string;
        sider: string;
        tab: string;
      };
    };

    /** Theme setting */
    interface ThemeSetting {
      /** Theme scheme */
      themeScheme: UnionKey.ThemeScheme;
      /** Theme color */
      themeColor: string;
      /** Other color */
      otherColor: OtherColor;
      /** Whether info color is followed by the primary color */
      isInfoFollowPrimary: boolean;
      /** Layout */
      layout: {
        /** Layout mode */
        mode: UnionKey.ThemeLayoutMode;
        /** Scroll mode */
        scrollMode: UnionKey.ThemeScrollMode;
      };
      /** Page */
      page: {
        /** Whether to show the page transition */
        animate: boolean;
        /** Page animate mode */
        animateMode: UnionKey.ThemePageAnimateMode;
      };
      /** Header */
      header: {
        /** Header height */
        height: number;
        /** Header breadcrumb */
        breadcrumb: {
          /** Whether to show the breadcrumb */
          visible: boolean;
          /** Whether to show the breadcrumb icon */
          showIcon: boolean;
        };
      };
      /** Tab */
      tab: {
        /** Whether to show the tab */
        visible: boolean;
        /**
         * Whether to cache the tab
         *
         * If cache, the tabs will get from the local storage when the page is refreshed
         */
        cache: boolean;
        /** Tab height */
        height: number;
        /** Tab mode */
        mode: UnionKey.ThemeTabMode;
      };
      /** Fixed header and tab */
      fixedHeaderAndTab: boolean;
      /** Sider */
      sider: {
        /** Inverted sider */
        inverted: boolean;
        /** Sider width */
        width: number;
        /** Collapsed sider width */
        collapsedWidth: number;
        /** Sider width when the layout is 'vertical-mix' or 'horizontal-mix' */
        mixWidth: number;
        /** Collapsed sider width when the layout is 'vertical-mix' or 'horizontal-mix' */
        mixCollapsedWidth: number;
        /** Child menu width when the layout is 'vertical-mix' or 'horizontal-mix' */
        mixChildMenuWidth: number;
      };
      /** Footer */
      footer: {
        /** Whether to show the footer */
        visible: boolean;
        /** Whether fixed the footer */
        fixed: boolean;
        /** Footer height */
        height: number;
        /** Whether float the footer to the right when the layout is 'horizontal-mix' */
        right: boolean;
      };
    }

    interface OtherColor {
      info: string;
      success: string;
      warning: string;
      error: string;
    }

    interface ThemeColor extends OtherColor {
      primary: string;
    }

    type ThemeColorKey = keyof ThemeColor;

    type ThemePaletteColor = {
      [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string;
    };

    type BaseToken = Record<string, Record<string, string>>;

    interface ThemeTokenColor extends ThemePaletteColor {
      nprogress: string;
      container: string;
      layout: string;
      inverted: string;
      base_text: string;

      [key: string]: string;
    }
  }

  /** Global namespace */
  namespace Global {
    type VNode = import('vue').VNode;
    type RouteLocationNormalizedLoaded = import('vue-router').RouteLocationNormalizedLoaded;
    type RouteKey = import('@elegant-router/types').RouteKey;
    type RouteMap = import('@elegant-router/types').RouteMap;
    type RoutePath = import('@elegant-router/types').RoutePath;
    type LastLevelRouteKey = import('@elegant-router/types').LastLevelRouteKey;

    /** The global header props */
    interface HeaderProps {
      /** Whether to show the logo */
      showLogo?: boolean;
      /** Whether to show the menu toggler */
      showMenuToggler?: boolean;
      /** Whether to show the menu */
      showMenu?: boolean;
    }

    /** The global menu */
    interface Menu {
      /**
       * The menu key
       *
       * Equal to the route key
       */
      key: string;
      /** The menu label */
      label: string;
      /** The menu i18n key */
      i18nKey?: I18n.I18nKey;
      /** The route key */
      routeKey: RouteKey;
      /** The route path */
      routePath: RoutePath;
      /** The menu icon */
      icon?: () => VNode;
      /** The menu children */
      children?: Menu[];
      remark: string;
    }

    type Breadcrumb = Omit<Menu, 'children'> & {
      options?: Breadcrumb[];
    };

    /** Tab route */
    type TabRoute = Pick<RouteLocationNormalizedLoaded, 'name' | 'path' | 'meta'> &
      Partial<Pick<RouteLocationNormalizedLoaded, 'fullPath' | 'query' | 'matched'>>;

    /** The global tab */
    type Tab = {
      /** The tab id */
      id: string;
      /** The tab label */
      label: string;
      /**
       * The new tab label
       *
       * If set, the tab label will be replaced by this value
       */
      newLabel?: string;
      /**
       * The old tab label
       *
       * when reset the tab label, the tab label will be replaced by this value
       */
      oldLabel?: string;
      /** The tab route key */
      routeKey: LastLevelRouteKey;
      /** The tab route path */
      routePath: RouteMap[LastLevelRouteKey];
      /** The tab route full path */
      fullPath: string;
      /** The tab fixed index */
      fixedIndex?: number;
      /**
       * Tab icon
       *
       * Iconify icon
       */
      icon?: string;
      /**
       * Tab local icon
       *
       * Local icon
       */
      localIcon?: string;
      /** I18n key */
      i18nKey?: I18n.I18nKey;
    };

    /** Form rule */
    type FormRule = import('naive-ui').FormItemRule;

    /** The global dropdown key */
    type DropdownKey = 'closeCurrent' | 'closeOther' | 'closeLeft' | 'closeRight' | 'closeAll';
  }

  /**
   * I18n namespace
   *
   * Locales type
   */
  namespace I18n {
    type RouteKey = import('@elegant-router/types').RouteKey;

    type LangType = 'en-US' | 'vi-VN';

    type LangOption = {
      label: string;
      key: LangType;
    };

    type I18nRouteKey = Exclude<RouteKey, 'root' | 'not-found'>;

    type FormMsg = {
      required: string;
      invalid: string;
      lenMin6: string;
      tip: string;
    };

    type Schema = {
      title: string;
      default: string;
      system: {
        title: string;
      };
      common: {
        serviceConfi: string;
        config: string;
        pluginConfig: string;
        deleteThePlan: string;
        cancelThePlan: string;
        planTheDevice: string;
        checkDevice: string;
        editSpace: string;
        locationInfoAdded: string;
        section: string;
        leastOneChart: string;
        accompaniedIndicators: string;
        copyingFailed: string;
        copiedClipboard: string;
        dataSources: string;
        maxSelect: string;
        chart: string;
        selectCardFirst: string;
        componentsAddedYet: string;
        templateDeleted: string;
        normal: string;
        lowAlarm: string;
        intermediateAlarm: string;
        highAlarm: string;
        allStatus: string;
        enterAlarmDesc: string;
        alarmRules: string;
        alarmHistory: string;
        sceneLinkageInfo: string;
        chooseNotificationMethod: string;
        notificationGroupDesc: string;
        createNotificationGroup: string;
        editNotificationGroup: string;
        editFail: string;
        editSuccess: string;
        times1: string;
        times2: string;
        times3: string;
        times4: string;
        times5: string;
        times6: string;
        times7: string;
        times8: string;
        times9: string;
        times10: string;
        minutes3: string;
        minutes4: string;
        minutes6: string;
        minutes7: string;
        minutes8: string;
        minutes9: string;
        enterTriggeringDuration: string;
        enterNumberTriggering: string;
        enterAlarmLevel: string;
        enterAlarmName: string;
        enterJson: string;
        nodata: string;
        halfYear: string;
        lastYears1: string;
        lastDays90: string;
        lastDays60: string;
        lastDays30: string;
        lastDays15: string;
        lastDays7: string;
        lastDays3: string;
        lastHours24: string;
        lastHours12: string;
        lastHours6: string;
        lastHours3: string;
        lastHours1: string;
        last_30m: string;
        last_15m: string;
        last_5m: string;
        custom: string;
        average: string;
        sum: string;
        diffValue: string;
        months1: string;
        days7: string;
        hours6: string;
        hours3: string;
        minute2: string;
        minute1: string;
        seconds30: string;
        notAggre: string;
        rangeMustSelected: string;
        alreadyScatterPlot: string;
        switchScatterPlots: string;
        alreadyToChart: string;
        switchBarChart: string;
        alreadyCurveChart: string;
        switchLineChart: string;
        deleteDeviceConfig: string;
        addExtendedInfo: string;
        editExtendedInfo: string;
        extensionInfoDeleted: string;
        enterName: string;
        devicesSetting: string;
        protocolConfig: string;
        associatedDevices: string;
        propertiesAndFunctions: string;
        dataProces: string;
        deleteProcessing: string;
        timeConditions: string;
        deviceConditions: string;
        timeFrame: string;
        repeat: string;
        single: string;
        interfaceStatus: string;
        contentToCopied: string;
        browserNotSupport: string;
        formatFile: string;
        pleaseUploadit: string;
        days1: string;
        hours1: string;
        minutes30: string;
        minutes10: string;
        minutes5: string;
        includeList: string;
        between: string;
        lessOrEqual: string;
        greaterOrEqual: string;
        under: string;
        pass: string;
        unequal: string;
        equal: string;
        sunset: string;
        sunrise: string;
        monthly: string;
        weekly: string;
        everyDay: string;
        everyHour: string;
        weather: string;
        deviceConfigName: string;
        deviceAccessType: string;
        deviceConnectionMethod: string;
        activateSceneInfo: string;
        activationPrompt: string;
        deleteSceneInfo: string;
        deletePrompt: string;
        addArea: string;
        addSpace: string;
        sending: string;
        base: string;
        saveSceneInfo: string;
        addFail: string;
        belongingSpace: string;
        as: string;
        param: string;
        singleClassDevice: string;
        singleDevice: string;
        triggerService: string;
        triggerAlarm: string;
        activateScene: string;
        operateDevice: string;
        stopFail: string;
        stopSuccess: string;
        startSuccess: string;
        startFail: string;
        deleteFail: string;
        test: string;
        low: string;
        middle: string;
        high: string;
        Ignored: string;
        toIgnore: string;
        maintenance: string;
        untreated: string;
        handled: string;
        alarm_time: string;
        alarm_level: string;
        processor_name: string;
        spaceName: string;
        userStatus: string;
        requestTime: string;
        requestMethod: string;
        requestPath: string;
        manageDevices: string;
        screenNameNull: string;
        addScreen: string;
        editScreen: string;
        editNameAndDesc: string;
        visualEditing: string;
        withinOneYear: string;
        withinOneMonth: string;
        time: string;
        complete: string;
        actions: string;
        input: string;
        select: string;
        selectOrInput: string;
        remark: string;
        add: string;
        save: string;
        addSuccess: string;
        backToHome: string;
        batchDelete: string;
        cancel: string;
        check: string;
        columnSetting: string;
        confirm: string;
        delete: string;
        remove: string;
        deleteSuccess: string;
        confirmDelete: string;
        edit: string;
        index: string;
        logout: string;
        logoutConfirm: string;
        lookForward: string;
        modify: string;
        modifySuccess: string;
        modifyFail: string;
        pleaseCheckValue: string;
        refresh: string;
        reset: string;
        search: string;
        tip: string;
        update: string;
        updateSuccess: string;
        refreshTable: string;
        changeTableColumns: string;
        userCenter: string;
        export: string;
        description: string;
        yesOrNo: {
          yes: string;
          no: string;
        };
        debug: string;
        send: string;
        creationTime: string;
        service: string;
        protocol: string;
        createUser: string;
        addRelatedUser: string;
        removeRelatedUser: string;
        loginName: string;
        lastLoginTime: string;
        userName: string;
        addUserToDeviceInfo: string;
        today: string;
        yesterday: string;
        dayBeforeYesterday: string;
        thisWeek: string;
        lastWeek: string;
        thisMonth: string;
        lastMonth: string;
        thisYear: string;
        lastYear: string;
        lastSixMonth: string;
        lastOneYear: string;
        lastWeekToday: string;
        January: string;
        getCode: string;
        countingLabel: string;
        phoneRequired: string;
        networkError: string;
        fetchDataFailed: string;
        noMoreData: string;
        operationFailed: string;
        phoneInvalid: string;
        emailRequired: string;
        emailInvalid: string;
      };
      theme: {
        themeSchema: { title: string } & Record<UnionKey.ThemeScheme, string>;
        layoutMode: { title: string } & Record<UnionKey.ThemeLayoutMode, string>;
        themeColor: {
          title: string;
          followPrimary: string;
        } & Theme.ThemeColor;
        scrollMode: { title: string } & Record<UnionKey.ThemeScrollMode, string>;
        page: {
          animate: string;
          mode: { title: string } & Record<UnionKey.ThemePageAnimateMode, string>;
        };
        fixedHeaderAndTab: string;
        header: {
          height: string;
          breadcrumb: {
            visible: string;
            showIcon: string;
          };
        };
        tab: {
          visible: string;
          cache: string;
          height: string;
          mode: { title: string } & Record<UnionKey.ThemeTabMode, string>;
        };
        sider: {
          inverted: string;
          width: string;
          collapsedWidth: string;
          mixWidth: string;
          mixCollapsedWidth: string;
          mixChildMenuWidth: string;
        };
        footer: {
          visible: string;
          fixed: string;
          height: string;
          right: string;
        };
        themeDrawerTitle: string;
        pageFunTitle: string;
        configOperation: {
          copySuccess: string;
          copyConfig: string;
          copySuccessMsg: string;
          resetConfig: string;
          resetSuccessMsg: string;
        };
      };
      route: {
        apply_in: string;
        product: string;
        product_list: string;
        'product_update-ota': string;
        'product_update-package': string;
        'management_ordinary-user': string;
        visualization_panel: string;
        'visualization_big-screen': string;
        irrigation: string;
        irrigation_time: string;
        irrigation_group: string;
        irrigation_rotation: string;
        personal_center: string;
        'space-management': string;
        'system-management-user_equipment-map': string;
        'edit-area': string;
        'new-area': string;
        device_service_access: string;
        device_service_details: string;
        'data-services': string;
        'data-services_data-forward': string;
        'data-services_forward-config': string;
        'device-details-app': string;
        'alarm_warning-message': string;
        'walarm_arning-message': string;
        'personal-center': string;
        apply_plugin: string;
        plugin_map: string;
        device_access: string;
        device_grouping: string;
        'device_grouping-details': string;
        device_manage: string;
        device_details: string;
        'device_details-child': string;
        device_config: string;
        'device_service-access': string;
        'device_service-details': string;
      } & Record<I18nRouteKey, string>;
      page: {
        product: ProductLocal;
        login: {
          common: {
            loginOrRegister: string;
            userNamePlaceholder: string;
            phonePlaceholder: string;
            codePlaceholder: string;
            passwordPlaceholder: string;
            confirmPasswordPlaceholder: string;
            codeLogin: string;
            codeSent: string;
            codeError: string;
            confirm: string;
            back: string;
            validateSuccess: string;
            loginSuccess: string;
            welcomeBack: string;
          };
          pwdLogin: {
            title: string;
            rememberMe: string;
            forgetPassword: string;
            register: string;
            otherAccountLogin: string;
            otherLoginMode: string;
            superAdmin: string;
            admin: string;
            user: string;
          };
          codeLogin: {
            title: string;
            getCode: string;
            imageCodePlaceholder: string;
          };
          register: {
            title: string;
            agreement: string;
            emailPlaceholder: string;
            registerSuccess: string;
            registerError: string;
            protocol: string;
            policy: string;
          };
          resetPwd: {
            title: string;
          };
        };
        about: {
          title: string;
          introduction: string;
          projectInfo: {
            title: string;
            version: string;
            latestBuildTime: string;
            githubLink: string;
            previewLink: string;
          };
          prdDep: string;
          devDep: string;
        };
        home: {
          greeting: string;
          weatherDesc: string;
          projectCount: string;
          todo: string;
          message: string;
          downloadCount: string;
          registerCount: string;
          schedule: string;
          study: string;
          work: string;
          rest: string;
          entertainment: string;
          visitCount: string;
          turnover: string;
          dealCount: string;
          projectNews: {
            title: string;
            moreNews: string;
            desc1: string;
            desc2: string;
            desc3: string;
            desc4: string;
            desc5: string;
          };
          creativity: string;
        };
        function: {
          tab: {
            tabOperate: {
              title: string;
              addTab: string;
              addTabDesc: string;
              closeTab: string;
              closeCurrentTab: string;
              closeAboutTab: string;
              addMultiTab: string;
              addMultiTabDesc1: string;
              addMultiTabDesc2: string;
            };
            tabTitle: {
              title: string;
              changeTitle: string;
              change: string;
              resetTitle: string;
              reset: string;
            };
          };
          multiTab: {
            routeParam: string;
            backTab: string;
          };
        };
        manage: {
          common: {
            status: {
              enable: string;
              disable: string;
            };
          };
          role: {
            title: string;
            roleName: string;
            roleCode: string;
            roleStatus: string;
            roleDesc: string;
            form: {
              roleName: string;
              roleCode: string;
              roleStatus: string;
              roleDesc: string;
            };
            addRole: string;
            editRole: string;
            editPermission: string;
          };
          api: {
            title: string;
            addApiKey: string;
            apiName: string;
            api_key: string;
            apiStatus: string;
            created_at: string;
            apiStatus1: {
              freeze: string;
              normal: string;
            };
            form: {
              apiName: string;
            };
            editAPi: string;
          };
          user: {
            title: string;
            userName: string;
            userGender: string;
            nickName: string;
            userPhone: string;
            userEmail: string;
            remark: string;
            accountStatus: string;
            userStatus: string;
            userStatus2: string;
            userRole: string;
            userRole2: string;
            password: string;
            confirmPwd: string;
            enter: string;
            form: {
              userName: string;
              userGender: string;
              nickName: string;
              userPhone: string;
              userEmail: string;
              userStatus: string;
              userRole: string;
              userRole2: string;
            };
            addUser: string;
            editUser: string;
            gender: {
              male: string;
              female: string;
            };
            status: {
              freeze: string;
              normal: string;
            };
          };
          menu: {
            title: string;
            id: string;
            parentId: string;
            authority: string;
            menuType: string;
            menuName: string;
            componentType: string;
            routeName: string;
            routePath: string;
            page: string;
            layout: string;
            i18nKey: string;
            icon: string;
            localIcon: string;
            iconTypeTitle: string;
            order: string;
            keepAlive: string;
            href: string;
            hideInMenu: string;
            activeMenu: string;
            multiTab: string;
            fixedIndexInTab: string;
            button: string;
            buttonCode: string;
            buttonDesc: string;
            menuStatus: string;
            form: {
              parent: string;
              title: string;
              multilingual: string;
              name: string;
              path: string;
              route_path: string;
              componentType: string;
              type: string;
              authority: string;
              menuType: string;
              menuName: string;
              routeName: string;
              routePath: string;
              page: string;
              layout: string;
              i18nKey: string;
              icon: string;
              localIcon: string;
              order: string;
              keepAlive: string;
              href: string;
              hideInMenu: string;
              activeMenu: string;
              multiTab: string;
              fixedInTab: string;
              fixedIndexInTab: string;
              button: string;
              buttonCode: string;
              buttonDesc: string;
              menuStatus: string;
            };
            addMenu: string;
            editMenu: string;
            addChildMenu: string;
            type: {
              directory: string;
              menu: string;
            };
            iconType: {
              iconify: string;
              local: string;
            };
            tooltip: {
              deviceConfig: string;
              deviceTemplate: string;
            };
          };
          setting: {
            themeSetting: {
              title: string;
              form: {
                systemTitle: string;
                homeAndBackendLogo: string;
                loadingPageLogo: string;
                websiteLogo: string;
                background: string;
              };
              changeLogo: string;
            };
            dataClearSetting: {
              title: string;
              form: {
                cleanupType: string;
                retentionDays: string;
                lastCleanupTime: string;
                lastCleanupDataTime: string;
                enabled: string;
              };
              type: {
                equipmentData: string;
                operationLog: string;
              };
            };
          };
          notification: {
            enableDisableService: string;
            email: {
              title: string;
              form: {
                sendMailServer: string;
                sendPort: string;
                senderMail: string;
                authorizationCodeOrPassword: string;
                ssl: string;
                inbox: string;
                message: string;
              };
            };
            shortMessage: {
              title: string;
            };
            pushNotification: {
              title: string;
              pushServer: string;
            };
          };
        };
        dataForward: {
          title: string;
          config: string;
          ruleName: string;
          des: string;
          ctime: string;
          utime: string;
          op: string;
          editTitle: string;
          addTitle: string;
          ruleNameLabel: string;
          ruleNamePlaceholder: string;
          descriptionLabel: string;
          descriptionPlaceholder: string;
          cancel: string;
          confirm: string;
          deleteSuccess: string;
          editSuccess: string;
          addSuccess: string;
          dataSourceConfig: string;
          addDataSource: string;
          editDataSource: string;
          device: string;
          group: string;
          product: string;
          deviceCount: string;
          groupCount: string;
          productCount: string;
          parseScript: string;
          enableScript: string;
          debugParam: string;
          debugResult: string;
          debugScript: string;
          saveScript: string;
          scriptSaveSuccess: string;
          messageType: string;
          telemetryUp: string;
          attributeUp: string;
          event: string;
          onlineOfflineNotice: string;
          selectDevice: string;
          selectMessageType: string;
          deviceName: string;
          groupName: string;
          productName: string;
          deviceId: string;
          groupId: string;
          productId: string;
          destinationType: string;
          mqtt: string;
          url: string;
          addDestination: string;
          editDestination: string;
          name: string;
          enterName: string;
          destinationTypeLabel: string;
          mqttConfig: string;
          hostIP: string;
          enterHostIP: string;
          port: string;
          enterPort: string;
          publishTopic: string;
          enterPublishTopic: string;
          selectQoS: string;
          selectMQTTVersion: string;
          clientId: string;
          enterClientId: string;
          username: string;
          enterUsername: string;
          password: string;
          enterPassword: string;
          urlConfig: string;
          urlAddress: string;
          enterUrlAddress: string;
          messageEncryption: string;
          enableEncryption: string;
          secretKey: string;
          enterSecretKey: string;
          description: string;
          enterDescription: string;
          submit: string;
          nameRequired: string;
          hostRequired: string;
          hostMaxLength: string;
          portRequired: string;
          portRange: string;
          topicRequired: string;
          topicMaxLength: string;
          qosRequired: string;
          qosRange: string;
          mqttVersionRequired: string;
          mqttVersionMaxLength: string;
          urlRequired: string;
          urlInvalid: string;
          secretRequired: string;
          secretLength: string;
          secretFormat: string;
          saveSuccess: string;
          saveFail: string;
          saving: string;
        };
        expect: {
          createTime: string;
          commandType: string;
          label: string;
          commandContent: string;
          expireTime: string;
          status: string;
          statusInfo: string;
          dealTime: string;
          operate: string;
          pending: string;
          send: string;
          expired: string;
          selectCommandTypePlease: string;
          command: string;
          inputLabelPlease: string;
        };
        irrigation: {
          name: string;
          duration: string;
          hour: string;
          minute: string;
          irrigationDuration: string;
          capacity: string;
          areaOrSpace: string;
          diviceName: string;
          controlType: string;
          planStatus: string;
          distribute: string;
          log: string;
          addIrrigationPlan: string;
          time: {
            device: string;
            name: string;
            planName: string;
            repeatTime: string;
            orderCode: string;
            irrigationTime: string;
            doorOpeing: string;
            week: {
              monday: string;
              tuesday: string;
              wednesday: string;
              thursday: string;
              friday: string;
              saturday: string;
              sunday: string;
            };
            log: {
              name: string;
              commandIssuanceTime: string;
              instructionContent: string;
              result: string;
              detail: string;
            };
          };
          group: {
            name: string;
            controlModel: string;
            startTime: string;
            runDetail: string;
            deviceName: string;
            orderNumber: string;
            addGroupPlane: string;
            planName: string;
            deviceType: string;
            addDevice: string;
            duration: string;
            singleControl: string;
            loopControl: string;
            cycleNumber: string;
            intervalDuration: string;
            clickToAdd: string;
            choosedDevice: string;
            chooseDevices: string;
            deviceCode: string;
            log: {
              planDetail: string;
              runTime: string;
              runResult: string;
              detail: string;
            };
            detail: {
              commandIssuanceTime: string;
              spaceOrArea: string;
              orderContent: string;
              result: string;
              detail: string;
            };
          };
          rotation: {
            addRotationPlane: string;
            name: string;
            waterPumpEquipment: string;
            waterPumpDoorOpening: string;
            waterPumpPressure: string;
            rotationDuration: string;
            addRotationDevice: string;
            valveStatus: string;
            pressure: string;
            chooseDevice: string;
          };
        };
        apply: {
          service: {
            form: {
              serviceName: string;
              deviceType: string;
              protocolType: string;
              accessAddress: string;
              httpAddress: string;
              subTopicPrefix: string;
              additionalInfo: string;
            };
          };
        };
      };
      form: {
        required: string;
        userName: FormMsg;
        phone: FormMsg;
        pwd: FormMsg;
        code: FormMsg;
        email: FormMsg;
        manycheck: FormMsg;
      };
      dropdown: Record<Global.DropdownKey, string>;
      icon: {
        themeConfig: string;
        themeSchema: string;
        lang: string;
        fullscreen: string;
        fullscreenExit: string;
        reload: string;
        collapse: string;
        expand: string;
        pin: string;
        unpin: string;
      };
      dashboard_panel: {
        addKanBan: string;
        editKanban: string;
        cardName: {
          date: {
            january: string;
            february: string;
            march: string;
            april: string;
            may: string;
            june: string;
            july: string;
            august: string;
            september: string;
            october: string;
            november: string;
            december: string;
          };
          week: {
            mon: string;
            tue: string;
            wed: string;
            thur: string;
            fri: string;
            sat: string;
            sun: string;
          };
          bugNum: string;
          deviceNum: string;
          userNum: string;
          regionNum: string;
          tenantNumLine: string;
          deviceNumPie: string;
          weatherOverview: string;
          irrigationArea: string;
          weatherStation: string;
          tenant: string;
          onLine: string;
          offline: string;
          onlineRate: string;
          yesterdayAdd: string;
          lastMonthAdd: string;
          active: string;
          notActive: string;
          activationRate: string;
          sevenDayWeather: string;
          spaceNum: string;
          thisMonth: string;
          areaName: string;
          corn: string;
          SprinklerIrrigationDitchIrrigation: string;
          irrigationTypes: string;
          hectare: string;
          regionalArea: string;
          sandyLoamSoil: string;
          soil: string;
          soilMoisture: string;
          temperature: string;
          Conductivity: string;
          potassiumContent: string;
          phosphorusContent: string;
          nitrogenContent: string;
          weatherStationData: string;
          historyData: string;
          windSpeed: string;
          windDirection: string;
          humidity: string;
          pressure: string;
          rainfall: string;
          instrumentPanel: string;
          videoPlayer: string;
        };
      };
      device_template: {
        selectServices: string;
        stepOneDescribe: string;
        serviceConfig: string;
        stepTwoDescribe: string;
        equipmentConfig: string;
        stepThreeDescribe: string;
        adoptDeviceAdd: string;
        templateInfo: string;
        editTemplateInfo: string;
        addDeviceInfo: string;
        modelDefinition: string;
        deviceParameterDescribe: string;
        webChartConfiguration: string;
        bindTheCorrespondingChart: string;
        appChartConfiguration: string;
        editAppDetailsPage: string;
        release: string;
        releaseAppStore: string;
        enterTemplateName: string;
        templateName: string;
        templateTage: string;
        authorName: string;
        enterAuthorName: string;
        templateVersion: string;
        entertemplateVersion: string;
        illustrate: string;
        enterIllustrate: string;
        selectCover: string;
        nextStep: string;
        addTage: string;
        back: string;
        add: string;
        confirm: string;
        telemetry: string;
        attributes: string;
        events: string;
        command: string;
        addAndEditTelemetry: string;
        addAndEditAttributes: string;
        addAndEditEvents: string;
        addAndEditCommand: string;
        setEnumItem: string;
        enumValue: string;
        enumDesc: string;
        addEnumItem: string;
        table_header: {
          dataName: string;
          eventContent: string;
          dataIdentifier: string;
          readAndWriteSign: string;
          readAndWrite: string;
          readOnly: string;
          dataType: string;
          eventReportingTime: string;
          updateTime: string;
          attributeValue: string;
          unit: string;
          description: string;
          attributeName: string;
          attributeIdentifier: string;
          eventName: string;
          eventIdentifier: string;
          eventParameters: string;
          commandName: string;
          commandIdentifier: string;
          commandParameters: string;
          pleaseEnterADataName: string;
          pleaseEnterTheDataIdentifier: string;
          pleaseEnterTheDataType: string;
          pleaseEnterTheUnit: string;
          PleaseEnterADescription: string;
          pleaseEnterTheAttributeName: string;
          pleaseEnterTheAttributeIdentifier: string;
          pleaseEnterTheAttributeType: string;
          attributeType: string;
          addEditParameters: string;
          parameterName: string;
          PleaseEnterTheParameterName: string;
          ParameterIdentifier: string;
          PleaseEnterTheParameterIdentifier: string;
          ParameterType: string;

          PleaseSelectParameterType: string;
          singleControlTask: string;
          addParameters: string;
          commandDescription: string;
          pleaseEnterACommandDescription: string;
          pleaseEnterTheCommandName: string;
          pleaseEnterTheCommandIdentifier: string;
          PleaseEnterTheCommandType: string;
          eventDescription: string;
          PleaseEventDescription: string;
          singleControlTaskl: string;
          PleaseEventName: string;
          PleaseEeventIdentifier: string;
          setEnum: string;
          addEnum: string;
          enumDataType: string;
          enumDataValue: string;
          enumDescription: string;
        };
      };
      custom: {
        home: {
          title: string;
          description: string;
          refresh: string;
          kanbanNameNull: string;
        };
        groupPage: {
          deviceNumberMax: string;
          deviceNumberNotAvailable: string;
          deviceAvailable: string;
          groupName: string;
          description: string;
          createdAt: string;
          actions: string;
          view: string;
          confirmDelete: string;
          delete: string;
          removeFromGroup: string;
          createGroupButton: string;
          deviceGroupPlaceholder: string;
          selectParentGroup: string;
          enterGroupName: string;
          group: string;
          addGroup: string;
          editGroup: string;
          confirm: string;
          cancel: string;
          modificationSuccess: string;
          additionSuccess: string;
        };
        devicePage: {
          maintenance: string;
          attributeDistribution: string;
          attributeReporting: string;
          transmissionPreprocessing: string;
          reportPreprocessing: string;
          commandDeliveryPreprocessing: string;
          eventReportPreprocessing: string;
          pushTime: string;
          handle: string;
          deviceNumberMax: string;
          deviceNumberNotAvailable: string;
          subDeviceAddress: string;
          deviceKey: string;
          deviceName: string;
          deviceNumber: string;
          deviceConfig: string;
          configTemplate: string;
          unlimitedDeviceConfig: string;
          selectGroup: string;
          online: string;
          offline: string;
          alarmed: string;
          notAlarmed: string;
          lastPushTime: string;
          serviceProtocol: string;
          details: string;
          delete: string;
          group: string;
          unlimitedOnlineStatus: string;
          unlimitedAlarmStatus: string;
          alarm: string;
          noAlarm: string;
          unlimitedAccessType: string;
          directConnectedDevices: string;
          gateway: string;
          gatewaySubEquipment: string;
          unlimitedAccessMode: string;
          byProtocol: string;
          byService: string;
          deviceNameOrNumber: string;
          manualAdd: string;
          addByNumber: string;
          addByServer: string;
          addDevice: string;
          createDevice: string;
          configureDevice: string;
          configurationComplete: string;
          enterDeviceNumber: string;
          deviceNumberAvailable: string;
          finish: string;
          onlineStatus: string;
          alarmStatus: string;
          accessServiceProtocol: string;
          onlineOption: string;
          offlineOption: string;
          alarmOption: string;
          noAlarmOption: string;
          step1Title: string;
          tips: string;
          step1Desc: string;
          step2Title: string;
          step2Desc: string;
          step3Title: string;
          step3Desc: string;
          serverStep1Title: string;
          serverStep1Desc: string;
          serverStep2Title: string;
          serverStep2Desc: string;
          enterDeviceName: string;
          validationFailed: string;
          label: string;
          selectDeviceConfig: string;
          inputDeviceName: string;
          submit: string;
          connectInfo: string;
          success: string;
          deviceConfigSuccess: string;
          close: string;
          fail: string;
          deviceConfigFail: string;
          back: string;
          saveAndNext: string;
        };
        grouping_details: {
          messageId: string;
          sendContent: string;
          previousPage: string;
          previousLevel: string;
          backToGroupList: string;
          groupLevel: string;
          groupId: string;
          description: string;
          createTime: string;
          subGroup: string;
          addSubGroup: string;
          device: string;
          addDeviceToGroup: string;
          detail: string;
          basic: string;
          setting: string;
          edit: string;
          noGroupId: string;
          operationSuccess: string;
          operationFail: string;
          cancel: string;
          confirm: string;
        };
        device_details: {
          sendTime: string;
          titleOrContent: string;
          notificationType: string;
          attributeDistributionTime: string;
          messageId: string;
          sendContent: string;
          triggerOperation: string;
          whole: string;
          command: string;
          sendResults: string;
          automaticTriggering: string;
          manualOperation: string;
          history: string;
          sequential: string;
          deleteAttribute: string;
          sendInputData: string;
          operationTime: string;
          operationUsers: string;
          operationType: string;
          telemetry: string;
          join: string;
          deviceAnalysis: string;
          chart: string;
          AdditionalDetails: string;
          message: string;
          attributes: string;
          eventReport: string;
          commandDelivery: string;
          expectMessage: string;
          automate: string;
          giveAnAlarm: string;
          user: string;
          settings: string;
          deviceNumber: string;
          deviceConfig: string;
          status: string;
          online: string;
          offline: string;
          alarm: string;
          noAlarm: string;
          lastUpdate: string;
        };
      };
      generate: {
        inputRightJson: string;
        customCommand: string;
        addCustomCommand: string;
        customControl: string;
        commandContent: string;
        enableStatus: string;
        btnname: string;
        sceneLinkageName: string;
        alarmConfugName: string;
        alarmDevices: string;
        alarmReason: string;
        alarmStatus: string;
        enterSceneDesc: string;
        editAlarm: string;
        selectRuleStatus: string;
        by: string;
        clickDelete: string;
        suspend: string;
        startup: string;
        addExecutionAction: string;
        addExecutionConditions: string;
        sceneLinkDesc: string;
        runstate: string;
        gatewayDevice: string;
        alarmConfig: string;
        alarmInfo: string;
        alarmHistory: string;
        notificationGroup: string;
        spaceLocation: string;
        spaceOrArea: string;
        editRule: string;
        addRule: string;
        annotation: string;
        fieldName: string;
        sqlInput: string;
        selectStatus: string;
        dataInterval: string;
        appKey: string;
        supportFlag: string;
        IPwhitelist: string;
        signatureMethod: string;
        ruleName: string;
        cropWaterDemand: string;
        soilParam: string;
        commandIssuanceTime: string;
        issueCommand: string;
        commandConetnt: string;
        selectSubDevices: string;
        setSubDevices: string;
        unbind: string;
        unbound: string;
        errorMessage: string;
        returnFail: string;
        returnSuccess: string;
        sendingFail: string;
        sendingSuccess: string;
        code: string;
        name: string;
        greeting: string;
        orIf: string;
        'add-group': string;
        'delete-group': string;
        'delete-condition': string;
        'add-condition': string;
        'please-select': string;
        'please-select-expiration-time': string;
        'expiration-time': string;
        'please-select-date': string;
        'please-select-period': string;
        'not-executed': string;
        'please-select-day-hour-minute': string;
        value: string;
        'max-value': string;
        'min-value': string;
        inputMaxValue: string;
        inputMinValue: string;
        sum: string;
        diff: string;
        'save-scene-configuration': string;
        'add-execution-action': string;
        'delete-execution-action': string;
        'separated-by-commas': string;
        'create-alarm': string;
        trigger: string;
        activate: string;
        delete: string;
        'add-row': string;
        search: string;
        'delete-operation': string;
        enter: string;
        'add-operation': string;
        group: string;
        and: string;
        save: string;
        saveSuccess: string;
        saveFail: string;
        saving: string;
        cancel: string;
        'condition-trigger': string;
        'location-details': string;
        'irrigation-type': string;
        'soil-type': string;
        'planting-crops': string;
        rise: string;
        'required-water-supply-for-crops': string;
        hectare: string;
        'area-size': string;
        'area-image': string;
        'set-range': string;
        'map-range': string;
        latitude: string;
        longitude: string;
        'location-information': string;
        'set-location': string;
        'area-location': string;
        'configuration-entry': string;
        'area-name': string;
        'cancel-loading': string;
        'start-loading': string;
        confirm: string;
        action: string;
        'enter-description': string;
        'loading-button': string;
        loading: string;
        'online-status': string;
        description: string;
        'enter-scene-name': string;
        'online-rate': string;
        'associated-space': string;
        'expand-configuration': string;
        'enter-keyword': string;
        'total-devices': string;
        'terminal-count': string;
        'device-overview': string;
        'save-scene-linkage': string;
        button: string;
        then: string;
        'edit-location': string;
        'space-location': string;
        'space-name': string;
        if: string;
        'add-space-area': string;
        'edit-current-space-area': string;
        'enter-scene-linkage-name': string;
        'expand-card': string;
        'manually-add-device': string;
        reset: string;
        'telemetry-history-data': string;
        'execution-failed': string;
        'execution-successful': string;
        all: string;
        'execution-status': string;
        'execution-description': string;
        'execution-time': string;
        'display-title': string;
        'order-number': string;
        'search-space-or-area': string;
        title: string;
        send: string;
        debug: string;
        normal: string;
        'select-execution-status': string;
        alarm: string;
        'copy-commands-to-local': string;
        'offline-status': string;
        mqtt: string;
        'debug-run-result': string;
        'alarm-content': string;
        details: string;
        'report-data': string;
        'simulate-input': string;
        'batch-ignore': string;
        log: string;
        'batch-process': string;
        'enable-status': string;
        attribute: string;
        'issue-attribute': string;
        'simulate-report-data': string;
        'device-type': string;
        'issue-control': string;
        'parse-script': string;
        'device-description': string;
        'device-code': string;
        device: string;
        'device-name': string;
        sha256hmac: string;
        'select-processing-type': string;
        'select-device': string;
        'processing-type': string;
        'device-number': string;
        secret: string;
        'enter-title': string;
        key: string;
        'select-notification-group': string;
        'alarm-level': string;
        'payload-url': string;
        'notification-group': string;
        'modify-device-info': string;
        'trigger-duration': string;
        'multiple-email-phone-using-comma': string;
        'device-count': string;
        'add-alarm': string;
        'set-email-phone': string;
        edit: string;
        'trigger-repeat-count': string;
        'enter-default-value': string;
        'default-value': string;
        'select-type': string;
        'add-new': string;
        'alarm-description': string;
        add: string;
        crop: string;
        type: string;
        'set-member-notification-method': string;
        'enter-device-name': string;
        'alarm-name': string;
        'alarm-status': string;
        'signature-method': string;
        'is-homepage': string;
        'notification-method': string;
        'space-management': string;
        'connection-info': string;
        'rule-name': string;
        'enter-dashboard-name': string;
        'dashboard-name': string;
        'notification-group-description': string;
        configuration: string;
        'enter-tag-name': string;
        'notification-group-name': string;
        'data-source-name': string;
        'add-data-processing': string;
        'enter-large-screen-name': string;
        'large-screen-name': string;
        sql2: string;
        'enter-sub-device-address': string;
        'sub-device-address-setting': string;
        'add-extension-info': string;
        'rule-engine': string;
        'device-group': string;
        operation: string;
        'api-support-flag': string;
        'modification-time': string;
        system: string;
        'creation-time': string;
        'group-name': string;
        'device-firmware': string;
        'scene-description': string;
        'form-configuration': string;
        'scene-name': string;
        ip: string;
        view: string;
        ip2: string;
        'data-source-type': string;
        creativity: string;
        'data-parsing': string;
        '+add-scene-linkage': string;
        'add-device': string;
        'select-authentication-type': string;
        'add-sub-device': string;
        'parent-group': string;
        'gateway-sub-device': string;
        'device-configuration': string;
        gateway: string;
        'quick-operation': string;
        'direct-connected-device': string;
        'authentication-type': string;
        publish: string;
        'create-access-rule': string;
        'platform-connect-device': string;
        'device-access-type': string;
        'device-connect-platform': string;
        '+add-device': string;
        'select-protocol-service': string;
        '+add-scene': string;
        'device-connection-method': string;
        first: string;
        'more-dynamics': string;
        issue: string;
        'select-device-function-template': string;
        'through-protocol-access': string;
        credential: string;
        dynamic: string;
        'role-description': string;
        'device-configuration-name': string;
        'repeat-new-password': string;
        recipient: string;
        'confirm-delete-dashboard': string;
        'access-method-service': string;
        'or-enter-here': string;
        'hour-24': string;
        'select-permission': string;
        export: string;
        'max-9': string;
        'more-tech-stack': string;
        'new-password': string;
        'role-name': string;
        query: string;
        switch: string;
        'number-of-devices': string;
        'project-main-tech-stack': string;
        refresh: string;
        'command-identifier': string;
        status: string;
        selected: string;
        'remember-path': string;
        table: string;
        'old-password': string;
        'notification-type': string;
        'search-by-name': string;
        'confirm-password': string;
        username: string;
        requestMethod: string;
        ipAddress: string;
        'change-password': string;
        'notification-record': string;
        'add-chart': string;
        'create-large-screen': string;
        timeline: string;
        password: string;
        'system-log': string;
        'no-data': string;
        'message-total': string;
        'create-dashboard': string;
        'has-data': string;
        email: string;
        'add-component': string;
        'enter-template-name': string;
        'extension-info': string;
        'next-step': string;
        'add-device-function-template': string;
        'email-address': string;
        demo: string;
        'device-location': string;
        'super-admin': string;
        tenant: string;
        'account-type': string;
        'vue3-doc-url': string;
        'select-theme': string;
        'not-found-create': string;
        'previous-step': string;
        'last-name': string;
        'select-user': string;
        'color-theme': string;
        'color-theme1': string;
        'color-theme2': string;
        'copy-json': string;
        'enter-config-name': string;
        'enter-key': string;
        close: string;
        'bind-device-function-template': string;
        open: string;
        copy: string;
        'basic-info': string;
        'set-default-device-open-status': string;
        'copy-one-type-one-secret-device-password': string;
        'search-icon': string;
        'allow-device-auto-create': string;
        'personal-space': string;
        'table-column-setting': string;
        'configure-auto-create-device': string;
        'card-content': string;
        'temperature-alert-above-28': string;
        'view-key': string;
        'click-to-select-icon': string;
        'privacy-policy': string;
        'delete-device-configuration': string;
        'custom-icon-example': string;
        'user-agreement': string;
        'card-segment-example': string;
        'print-picture': string;
        'markdown-plugin': string;
        'weather-forecast': string;
        'auto-create-device-via-one-type-one-secret': string;
        'auto-create-device': string;
        'print-table': string;
        'i-have-read-and-accept': string;
        color: string;
        'video-player-plugin': string;
        'text-button': string;
        print: string;
        'icon-selector': string;
        'enter-content-to-copy': string;
        'extra-large-card': string;
        'icon-example': string;
        'large-card': string;
        'rich-text-plugin': string;
        'text-copy': string;
        'medium-card': string;
        dashboard: string;
        'map-plugin': string;
        'small-card': string;
        'alarm-center': string;
        age: string;
        size: string;
        card: string;
        user: string;
        'basic-card': string;
        'basic-usage': string;
        'mumble-jumble': string;
        'migrate-dashboard-to-visualization': string;
        'route-management': string;
        preview: string;
        'final-result': string;
        'enter-read-write': string;
        'choose-protocol-or-Service': string;
        or: string;
        enterSceneName: string;
        labelName: string;
        requestHeader: string;
        format: string;
        fieldValue: string;
        fieldKey: string;
        addAlarm: string;
        addAlarmRule: string;
        heartbeatFunctionInfo: string;
        manualOnlineStatusEdit: string;
        deviceCode: string;
        enterReadWriteFlag: string;
        heartbeatThreshold: string;
        heartbeatIntervalSeconds: string;
        timeoutThreshold: string;
        timeoutMinutes: string;
        phoneNumber: string;
        location: string;
        pluginDemoUrl: string;
        vue3DocumentationUrl: string;
        deviceAccessType: string;
        swiperPlugin: string;
        onlineDeviceConfig: string;
        svgIconCustomization: string;
        createDeviceConfig: string;
        summaryOfLastMonth: string;
        salesOfCurrentMonth: string;
        customIconExample: string;
        printImage: string;
        earningsOfCurrentMonth: string;
        videoPlayerPlugin: string;
        copyText: string;
        printText: string;
        iconSelector: string;
        enterTextToCopy: string;
        richTextPlugin: string;
        textCopy: string;
        mapPlugin: string;
        iconComponentExample: string;
        randomText: string;
        firstElement: string;
        secondElement: string;
        thirdElement: string;
        individual: string;
        'alarm-info': string;
        timeRangeWarning: string;
        timeTypeWarning: string;
        controlCommands: string;
        distributeControlToDevice: string;
        expectedMessage: string;
        expirationTime: string;
        hour: string;
        expectedMessageTip: string;
        curveWidth: string;
        stateOnIcon: string;
        stateOnColor: string;
        stateOffIcon: string;
        stateOffColor: string;
        createForwardRule: string;
        baseInfo: string;
        secureSet: string;
      };
      kanban: {
        'add-cards': string;
      };
      card: any;
    };

    type GetI18nKey<T extends Record<string, unknown>, K extends keyof T = keyof T> = K extends string
      ? T[K] extends Record<string, unknown>
        ? `${K}.${GetI18nKey<T[K]>}`
        : K
      : never;

    // 将 I18nKey 定义为 string 来避免无限递归错误
    type I18nKey = string;

    type TranslateOptions<Locales extends string> = import('vue-i18n').TranslateOptions<Locales>;

    interface $T {
      (key: I18nKey): string;

      (key: I18nKey, plural: number, options?: TranslateOptions<LangType>): string;

      (key: I18nKey, defaultMsg: string, options?: TranslateOptions<I18nKey>): string;

      (key: I18nKey, list: unknown[], options?: TranslateOptions<I18nKey>): string;

      (key: I18nKey, list: unknown[], plural: number): string;

      (key: I18nKey, list: unknown[], defaultMsg: string): string;

      (key: I18nKey, named: Record<string, unknown>, options?: TranslateOptions<LangType>): string;

      (key: I18nKey, named: Record<string, unknown>, plural: number): string;

      (key: I18nKey, named: Record<string, unknown>, defaultMsg: string): string;
    }
  }

  /** Service namespace */
  namespace Service {
    /** The backend service env type */
    type EnvType = 'dev' | 'test' | 'prod';

    /** Other baseURL key */
    type OtherBaseURLKey = 'demo' | 'mock';

    /** The backend service config */
    interface ServiceConfig<T extends OtherBaseURLKey = OtherBaseURLKey> {
      /** The backend service base url */
      baseURL: string;
      /** Other backend service base url map */
      otherBaseURL: Record<T, string>;
    }

    /** The backend service config map */
    type ServiceConfigMap = Record<EnvType, ServiceConfig>;

    /** The backend service response data */
    type Response<T = unknown> = {
      /** The backend service response code */
      code: string;
      /** The backend service response message */
      msg: string;
      /** The backend service response data */
      data: T;
    };

    /** The demo backend service response data */
    type DemoResponse<T = unknown> = {
      /** The backend service response code */
      status: string;
      /** The backend service response message */
      message: string;
      /** The backend service response data */
      result: T;
    };
    type RequestErrorType = 'axios' | 'http' | 'backend';
    interface RequestError {
      type: RequestErrorType;
      code: string | number;
      msg: string;
    }

    /** The demo backend service response data */
    type DEVResponse<T = unknown> = {
      error?: RequestError;
      /** The backend service response code */
      code: number;
      /** The backend service response message */
      message: string;
      /** The backend service response data */
      data: T;
    };
    interface BackendResultConfig {
      codeKey: string;
      dataKey: string;
      msgKey: string;
      successCode: number | string;
    }
    interface SuccessResult<T = any> {
      error: null;
      data: T;
    }

    interface FailedResult {
      error: RequestError;
      data: null;
    }

    type RequestResult<T = any> = SuccessResult<T> | FailedResult;

    type MultiRequestResult<T extends any[]> = T extends [infer First, ...infer Rest]
      ? [First] extends [any]
        ? Rest extends any[]
          ? [Service.RequestResult<First>, ...MultiRequestResult<Rest>]
          : [Service.RequestResult<First>]
        : Rest extends any[]
          ? MultiRequestResult<Rest>
          : []
      : [];

    type ServiceAdapter<T = any, A extends any[] = any> = (...args: A) => T;

    interface MockServiceResult<T = any> {
      code: string | number;
      data: T;
      message: string;
    }
    interface MockOption {
      url: Record<string, any>;
      body: Record<string, any>;
      query: Record<string, any>;
      headers: Record<string, any>;
    }
  }
}

type ProductLocal = Record<string, any>;
