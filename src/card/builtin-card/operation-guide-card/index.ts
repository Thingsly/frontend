import { defineAsyncComponent } from 'vue';
import type { ICardDefine } from '@/components/panel/card';
import { $t } from '@/locales';
import poster from './poster.png';

export default {
  id: 'operation-guide',
  type: 'builtin',
  component: defineAsyncComponent(() => import('./component.vue')),
  poster,
  title: $t('card.operationGuide'),
  preset: {
    dataSource: {
      origin: 'system',
      isSupportTimeRange: false,
      dataTimeRange: '',
      isSupportAggregate: false,
      dataAggregateRange: '',
      systemSource: [],
      deviceSource: []
    },
    config: {
      guideList: [
        { titleKey: 'card.operationGuideCard.guideItems.addDevice.title', descriptionKey: 'card.operationGuideCard.guideItems.addDevice.description', link:'/device/manage'},
        { titleKey: 'card.operationGuideCard.guideItems.configureDevice.title', descriptionKey: 'card.operationGuideCard.guideItems.configureDevice.description', link:'/device/config' },
        { titleKey: 'card.operationGuideCard.guideItems.createDashboard.title', descriptionKey: 'card.operationGuideCard.guideItems.createDashboard.description', link:'/visualization/kanban' },
      ],
      guideListAdmin: [
        {
          titleKey: 'card.operationGuideAdmin.guideItems.createTenant.title',
          descriptionKey: 'card.operationGuideAdmin.guideItems.createTenant.description',
          link: '/management/user' // Example link, adjust if needed
        },
        {
          titleKey: 'card.operationGuideAdmin.guideItems.configureNotification.title',
          descriptionKey: 'card.operationGuideAdmin.guideItems.configureNotification.description',
          link: '/management/notification'
        },
        {
          titleKey: 'card.operationGuideAdmin.guideItems.configurePlugin.title',
          descriptionKey: 'card.operationGuideAdmin.guideItems.configurePlugin.description',

        },
      ]
    },
    iCardViewDefault: {
      w: 3,
      h:5,
      minW: 2,
      minH:2
    }
  }
} as ICardDefine;