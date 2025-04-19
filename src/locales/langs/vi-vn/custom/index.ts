import home from './home';
import groupPage from './groupPage';
import devicePage from './devicePage';
import groupingDetails from './grouping_details'; // Using camelCase for file name
import deviceDetails from './device_details'; // Using camelCase for file name
import management from './management';
import personalCenter from './personalCenter';
import plugin from './plugin';
import visualization from './visualization';

// Placeholder for associated devices translations
const associatedDevices = {
  selectDeviceFirst: 'Hãy chọn ít nhất một thiết bị.' // Added key
};

// Placeholder for config edit translations
const configEdit = {
  parseProtocolError: 'Phân tích cấu hình giao thức thất bại', // Added key
  loadConfigError: 'Tải cấu hình thất bại' // Added key
};

export default {
  home,
  groupPage,
  devicePage,
  grouping_details: groupingDetails,
  device_details: deviceDetails,
  management,
  personalCenter,
  plugin,
  visualization,
  associatedDevices, // Added new object
  configEdit // Added new object
};
