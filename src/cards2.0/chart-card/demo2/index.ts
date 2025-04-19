import { defineAsyncComponent } from 'vue';
import type { CardItem } from '@/cards2.0/card';
import poster from './poster.png';

export default {
  cardItemBase: {
    type: 'chart', // Card type: 'system' | 'plugins' | 'chart'
    id: 'chart-demo2', // Unique card identifier; use the format card_type_cardName to avoid conflicts
    cardName: 'chart-demo2',
    sourceNumber: 9, // Number of data entries; must be limited — plan ahead during development
    basicSettings: {
      defaultTitle: 'chart-demo2', // Card title — use internationalized strings whenever possible
      showTitle: false
    }, // Initial title — optional

    scene: 'all', // 'mobile' | 'pc' | 'all'; reserved for future use — default to 'all'
    minWH: {
      minW: 10, // Minimum card width — number of columns it spans (total grid: 24 columns)
      minH: 9   // Minimum card height — number of rows it spans (default: 1 row = 30px)
    },
    preset: {} // Initial configuration — customizable; will be exposed to the card component
  },
  poster, // Preview image — dimensions: 193x120
  component: defineAsyncComponent(() => import('./index.vue')), // Card component — usually ./component.vue
  configForm: defineAsyncComponent(() => import('./card-congig-form.vue')) // Card configuration file — usually card-config.vue
} as CardItem;

