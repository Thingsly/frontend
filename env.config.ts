/**
 * Create service config by current env
 *
 * @param env The current env
 */
export function createServiceConfig(env: Env.ImportMeta) {
  const mockURL = 'http://127.0.0.1:9999/api/v1';
  const devURL = 'http://103.124.93.210:9999/api/v1';
  // const devURL = 'http://127.0.0.1:9999/api/v1';
  // const devURL = 'http://mitras.cloud/api/v1';
  // const devURL = 'http://demo.mitras.cloud/api/v1';

  const testURL = '';
  const prodURL = 'http://103.124.93.210:9999/api/v1';

  const serviceConfigMap: App.Service.ServiceConfigMap = {
    dev: {
      baseURL: devURL,
      otherBaseURL: {
        demo: devURL,
        mock: mockURL
      }
    },
    test: {
      baseURL: mockURL,
      otherBaseURL: {
        demo: testURL,
        mock: mockURL
      }
    },
    prod: {
      baseURL: prodURL,
      otherBaseURL: {
        demo: prodURL,
        mock: mockURL
      }
    }
  };

  const { VITE_SERVICE_ENV = 'dev' } = env;

  return serviceConfigMap[VITE_SERVICE_ENV];
}

/**
 * Get proxy pattern of service url
 *
 * @param key If not set, will use the default key
 */
export function createProxyPattern(key?: App.Service.OtherBaseURLKey) {
  if (!key) {
    return '/proxy-default';
  }

  return `/proxy-${key}`;
}
