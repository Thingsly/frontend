import { defineAsyncComponent } from 'vue';
import type { CardItem } from '@/cards2.0/card';
import poster from './water-region.png';

export default {
  cardItemBase: {
    type: 'plugins',
    cardName: 'dashboard_panel.cardName.irrigationArea',
    id: 'plugins-water-region',
    sourceNumber: 0,
    scene: 'all',
    basicSettings: {
      defaultTitle: 'plugins-water-region',
      showTitle: false
    },
    minWH: {
      minW: 14,
      minH: 18
    },
    preset: {}
  },
  component: defineAsyncComponent(() => import('./component.vue')),
  configForm: defineAsyncComponent(() => import('./card-congig-form.vue')),
  poster
} as CardItem;
