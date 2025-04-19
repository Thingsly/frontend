import { defineAsyncComponent } from 'vue';
import type { CardItem } from '@/cards2.0/card';
import poster from './poster.png';

export default {
  cardItemBase: {
    type: 'plugins', // Card type: 'system' | 'plugins' | 'chart'
    id: 'plugins-demo1', // Unique card identifier; use the format card_type_cardName to avoid conflicts
    cardName: 'plugins-demo1',
    sourceNumber: 0, // Number of data entries; must be limited — plan accordingly during card development
    basicSettings: {
      defaultTitle: 'plugins-demo1', // Card title — use internationalized strings whenever possible
      showTitle: false
    }, // Initial title — optional

    scene: 'all', // 'mobile' | 'pc' | 'all'; reserved field — default to 'all'
    minWH: {
      minW: 3, // Minimum card width — number of columns it spans (total grid: 24 columns)
      minH: 5  // Minimum card height — number of rows it spans (1 row = 30px by default)
    },
    preset: {} // Initial configuration — customizable and exposed to the card component for internal use
  },
  poster, // Example image — size: 193x120
  component: defineAsyncComponent(() => import('./index.vue')), // Card component — typically located at ./component.vue
  configForm: defineAsyncComponent(() => import('./card-congig-form.vue')) // Card configuration form — typically card-config.vue
} as CardItem;

