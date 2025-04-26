import type { Router } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { $t } from '@/locales';

export function createDocumentTitleGuard(router: Router) {
  router.afterEach(to => {
    const { i18nKey, title } = to.meta;
    const appTitle = import.meta.env.VITE_APP_TITLE;
    let routeTitle = '';

    if (to.path?.startsWith('/login/')) {
      const path = to.path.split('/').pop()?.toLowerCase();
      switch (path) {
        case 'register-email':
          routeTitle = $t('page.login.register.title');
          break;
        case 'reset-pwd':
          routeTitle = $t('page.login.resetPwd.title');
          break;
        case 'code-login':
          routeTitle = $t('page.login.codeLogin.title');
          break;
        default:
          routeTitle = $t('page.login.pwdLogin.title');
      }
    } else {
      routeTitle = i18nKey ? $t(i18nKey) : title;
    }

    const documentTitle = routeTitle ? `${appTitle} - ${routeTitle}` : appTitle;

    useTitle(documentTitle);
  });
}
