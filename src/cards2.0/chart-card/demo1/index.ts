import { defineAsyncComponent } from 'vue';
import type { CardItem } from '@/cards2.0/card';
import poster from './poster.png';

export default {
  cardItemBase: {
    type: 'chart', // Card type: 'system' | 'plugins' | 'chart'
    id: 'chart-demo1', // Unique card identifier; follow the card_type_cardName naming convention to avoid conflicts
    cardName: 'chart-demo1',
    sourceNumber: 9, // Number of data entries; must be limited — consider this when developing the card
    basicSettings: {
      defaultTitle: 'chart-demo1', // Card title — use internationalized titles when possible
      showTitle: false
    }, // Initial title — optional

    scene: 'all', // 'mobile' | 'pc' | 'all'; reserved for future use — default to 'all'
    minWH: {
      minW: 12, // Minimum card width — the number of columns it spans (default layout: 24 columns)
      minH: 10  // Minimum card height — the number of rows it spans (default: 1 row = 30px)
    },
    preset: {} // Initial settings — customizable and will be exposed to the card; use as needed
  },
  poster, // Example image — dimensions: 193x120
  component: defineAsyncComponent(() => import('./index.vue')), // Card component — typically ./component.vue
  configForm: defineAsyncComponent(() => import('./card-congig-form.vue')) // Card configuration form — typically card-config.vue
} as CardItem;
