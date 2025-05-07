import { createApp, watch } from 'vue';
import './plugins/assets';
import { useSysSettingStore } from '@/store/modules/sys-setting';
import { setupDayjs, setupIconifyOffline, setupLoading, setupNProgress } from './plugins';
import { setupStore } from './store';
import { router, setupRouter } from './router';
import { i18n, setupI18n } from './locales';
import App from './App.vue';

const RECENTLY_VISITED_ROUTES_KEY = 'RECENTLY_VISITED_ROUTES';
const MAX_RECENT_ROUTES = 8;

const excludedPaths = ['/login/*', '/404', '/home', '/visualization/kanban-details'];

async function setupApp() {
  const app = createApp(App);
  setupStore(app);
  setupI18n(app);
  const sysSettingStore = useSysSettingStore();
  await sysSettingStore.initSysSetting();
  watch(
    () => sysSettingStore.system_name,
    newSystemName => {
      const locales = i18n.global.availableLocales;
      locales.forEach(locale => {
        i18n.global.mergeLocaleMessage(locale, {
          system: {
            title: newSystemName
          }
        });
      });
    },
    { immediate: true }
  );
  setupLoading();
  setupNProgress();
  setupIconifyOffline();
  setupDayjs();
  await setupRouter(app);

  router.afterEach((to) => {
    const isExcluded = excludedPaths.some(pattern => {
      if (pattern.endsWith('/*')) {
        const prefix = pattern.slice(0, -1);
        return to.path.startsWith(prefix);
      } else {
        return to.path === pattern;
      }
    });

    if (isExcluded) {
      return;
    }

    if (!to.name || !to.meta?.title || to.redirectedFrom) {
      return;
    }

    try {
      const routesRaw = localStorage.getItem(RECENTLY_VISITED_ROUTES_KEY);
      let recentRoutes = routesRaw ? JSON.parse(routesRaw) : [];

      recentRoutes = recentRoutes.filter(route => route.path !== to.path);
      // console.log('recentRoutes',to);

      recentRoutes.unshift({
        path: to.path,
        name: to.name,
        title: to.meta.title,
        i18nKey:to.meta.i18nKey,
        icon:to.meta.icon,
        query: to.query
      });

      if (recentRoutes.length > MAX_RECENT_ROUTES) {
        recentRoutes = recentRoutes.slice(0, MAX_RECENT_ROUTES);
      }

      localStorage.setItem(RECENTLY_VISITED_ROUTES_KEY, JSON.stringify(recentRoutes));
    } catch (error) {
      console.error('Error processing recently visited routes:', error);
    }
  });

  app.config.globalProperties.getPlatform = () => {
    const { appVersion }: any = window.navigator;
    if (['iPhone', 'Android', 'iPad'].includes(appVersion) || window.innerWidth < 680) {
      return true;
    }
    return false;
  };
  app.mount('#app');
}

setupApp();