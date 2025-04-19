export default {
  common: {
    status: {
      enable: 'Kích hoạt',
      disable: 'Vô hiệu hóa'
    }
  },
  role: {
    title: 'Danh sách vai trò',
    roleName: 'Tên vai trò',
    roleCode: 'Mã vai trò',
    roleStatus: 'Trạng thái vai trò',
    roleDesc: 'Mô tả vai trò',
    form: {
      roleName: 'Vui lòng nhập tên vai trò',
      roleCode: 'Vui lòng nhập mã vai trò',
      roleStatus: 'Vui lòng chọn trạng thái vai trò',
      roleDesc: 'Vui lòng nhập mô tả vai trò'
    },
    addRole: 'Thêm vai trò',
    editRole: 'Chỉnh sửa vai trò',
    editPermission: 'Chỉnh sửa quyền'
  },
  api: {
    title: 'API key',
    addApiKey: 'Tạo API key',
    apiName: 'Tên',
    api_key: 'key',
    apiStatus: 'Trạng thái',
    created_at: 'Thời gian tạo',
    apiStatus1: {
      freeze: 'Dừng sử dụng',
      normal: 'Kích hoạt'
    },
    form: {
      apiName: 'Vui lòng nhập tên API key'
    },
    editAPi: 'Chỉnh sửa'
  },
  user: {
    title: 'Danh sách người dùng',
    userName: 'Tên',
    userGender: 'Giới tính',
    nickName: 'Biệt danh',
    userPhone: 'Số điện thoại',
    accountStatus: 'Trạng thái tài khoản',
    remark: 'Ghi chú',
    userEmail: 'Email',
    userStatus: 'Trạng thái thuê bao',
    userStatus2: 'Trạng thái người dùng',
    userRole: 'Vai trò thuê bao',
    userRole2: 'Vai trò người dùng',
    password: 'Mật khẩu',
    confirmPwd: 'Xác nhận mật khẩu',
    enter: 'Enter',
    form: {
      userName: 'Vui lòng nhập tên',
      userGender: 'Vui lòng chọn giới tính',
      nickName: 'Vui lòng nhập biệt danh',
      userPhone: 'Vui lòng nhập số điện thoại',
      userEmail: 'Vui lòng nhập email',
      userStatus: 'Vui lòng chọn trạng thái thuê bao',
      userRole: 'Vui lòng chọn vai trò thuê bao',
      userRole2: 'Vui lòng chọn vai trò người dùng'
    },
    addUser: 'Thêm người dùng',
    editUser: 'Chỉnh sửa người dùng',
    gender: {
      male: 'Nam',
      female: 'Nữ'
    },
    status: {
      freeze: 'Đóng băng',
      normal: 'Bình thường'
    }
  },
  menu: {
    title: 'Quản lý menu',
    id: 'ID',
    parentId: 'ID menu cha',
    authority: 'Quyền hạn',
    menuType: 'Loại menu',
    menuName: 'Tên menu',
    componentType: 'Loại thành phần',
    routeName: 'Tên tuyến đường',
    routePath: 'Đường dẫn tuyến đường',
    page: 'Thành phần trang',
    layout: 'Bố cục',
    i18nKey: 'Khóa quốc tế hóa',
    icon: 'Biểu tượng',
    localIcon: 'Biểu tượng địa phương',
    iconTypeTitle: 'Loại biểu tượng',
    order: 'Thứ tự',
    keepAlive: 'Lưu cache tuyến đường',
    href: 'Liên kết ngoài',
    hideInMenu: 'Ẩn menu',
    activeMenu: 'Menu nổi bật',
    multiTab: 'Hỗ trợ đa tab',
    fixedIndexInTab: 'Chỉ số cố định trong tab',
    button: 'Nút',
    buttonCode: 'Mã nút',
    buttonDesc: 'Mô tả nút',
    menuStatus: 'Trạng thái menu',
    form: {
      parent: 'Menu cha',
      title: 'Tiêu đề',
      multilingual: 'Tiêu đề (đa ngôn ngữ)',
      name: 'Tên',
      path: 'Đường dẫn truy cập',
      route_path: 'Đường dẫn thành phần',
      componentType: 'Loại thành phần',
      icon: 'Biểu tượng',
      order: 'Thứ tự',
      type: 'Loại',
      authority: 'Quyền hạn',
      menuType: 'Vui lòng chọn loại menu',
      menuName: 'Vui lòng nhập tên menu',
      routeName: 'Vui lòng nhập tên tuyến đường',
      routePath: 'Vui lòng nhập đường dẫn tuyến đường',
      page: 'Vui lòng chọn thành phần trang',
      layout: 'Vui lòng chọn thành phần bố cục',
      i18nKey: 'Vui lòng nhập khóa quốc tế hóa',
      localIcon: 'Vui lòng chọn biểu tượng địa phương',
      keepAlive: 'Vui lòng chọn có lưu cache tuyến đường hay không',
      href: 'Vui lòng nhập liên kết ngoài',
      hideInMenu: 'Vui lòng chọn có ẩn menu hay không',
      activeMenu: 'Vui lòng nhập tên tuyến đường menu nổi bật',
      multiTab: 'Vui lòng chọn có hỗ trợ đa tab hay không',
      fixedInTab: 'Vui lòng chọn có cố định trong tab hay không',
      fixedIndexInTab: 'Vui lòng nhập chỉ số cố định trong tab',
      button: 'Vui lòng chọn có phải là nút hay không',
      buttonCode: 'Vui lòng nhập mã nút',
      buttonDesc: 'Vui lòng nhập mô tả nút',
      menuStatus: 'Vui lòng chọn trạng thái menu'
    },
    addMenu: 'Thêm menu mới',
    editMenu: 'Chỉnh sửa menu',
    addChildMenu: 'Thêm menu con',
    type: {
      directory: 'Thư mục',
      menu: 'Menu'
    },
    iconType: {
      iconify: 'Biểu tượng iconify',
      local: 'Biểu tượng địa phương'
    },
    tooltip: {
      deviceConfig: 'Cấu hình các giao thức và tham số khác của thiết bị',
      deviceTemplate: 'Định nghĩa mô hình vật lý và biểu đồ hiển thị'
    }
  },
  setting: {
    themeSetting: {
      title: 'Cài đặt giao diện',
      form: {
        systemTitle: 'Tiêu đề hệ thống',
        homeAndBackendLogo: 'Logo trang chủ và backend',
        loadingPageLogo: 'Logo trang tải',
        websiteLogo: 'Logo trang web',
        background: 'Hình nền'
      },
      changeLogo: 'Thay đổi logo'
    },
    dataClearSetting: {
      title: 'Cài đặt làm sạch dữ liệu',
      form: {
        cleanupType: 'Loại làm sạch',
        retentionDays: 'Số ngày giữ lại',
        lastCleanupTime: 'Thời gian làm sạch lần cuối',
        lastCleanupDataTime: 'Thời gian làm sạch dữ liệu lần cuối',
        enabled: 'Có kích hoạt không'
      },
      type: {
        equipmentData: 'Dữ liệu thiết bị',
        operationLog: 'Nhật ký hoạt động'
      }
    }
  },
  notification: {
    enableDisableService: 'Bật/tắt dịch vụ',
    email: {
      title: 'Email',
      form: {
        sendMailServer: 'Máy chủ gửi email',
        sendPort: 'Cổng gửi',
        senderMail: 'Email người gửi',
        authorizationCodeOrPassword: 'Mã ủy quyền/Mật khẩu',
        ssl: 'Kích hoạt SSL',
        inbox: 'Hộp thư đến',
        message: 'Nội dung tin nhắn'
      }
    },
    shortMessage: {
      title: 'Tin nhắn'
    },
    pushNotification: {
      title: 'Thông báo đẩy',
      pushServer: 'Máy chủ đẩy thông báo'
    }
  },
  validation: {
    commandIdentifierRequired: 'Mã lệnh không được để trống'
  }
};
