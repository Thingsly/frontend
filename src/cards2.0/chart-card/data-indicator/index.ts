import { defineAsyncComponent } from 'vue';
import poster from '@/components/panel/chart-card/demo/poster.png';
import type { CardItem } from '@/cards2.0/card';

export default {
  cardItemBase: {
    type: 'chart', // Card type: 'system' | 'plugins' | 'chart'
    id: 'chart-demo', // Unique card identifier; follow the card_type_cardName naming convention to avoid conflicts
    cardName: 'Numeric Indicator',
    sourceNumber: 1, // Number of data entries; must be limited — plan this during card development
    basicSettings: {
      defaultTitle: '123', // Card title — use internationalized titles when possible
      showTitle: false
    }, // Initial title — optional
    scene: 'all', // 'mobile' | 'pc' | 'all'; reserved for now, use 'all' by default
    minWH: {
      minW: 2, // Minimum card width — number of columns (default layout has 24 columns)
      minH: 2  // Minimum card height — number of rows (1 row = 30px by default)
    },
    preset: {
      dataSource: {
        origin: 'system',
        sourceNum: 1,
        systemSource: [{}],
        deviceSource: [{}]
      },
      config: {
        name: '123'
      }
    } // Initial configuration — customizable; will be exposed to the card, use as needed
  },
  component: defineAsyncComponent(() => import('./component.vue')),
  poster,
  configForm: defineAsyncComponent(() => import('./card-config.vue'))
} as CardItem;
