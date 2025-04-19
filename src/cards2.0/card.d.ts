export type CardType = 'system' | 'plugins' | 'chart';
export type SceneType = 'mobile' | 'pc' | 'all';

export interface CardItemBase {
  type: CardType; // Card type
  id: string; // Unique card identifier, use the format: card_type_cardName to avoid issues
  cardName: string; // Card name
  renderID?: string;
  sourceNumber: number; // Number of data entries; must be limited — plan accordingly during development
  basicSettings?: {
    defaultTitle?: string; // Card title — use internationalized titles whenever possible
    showTitle?: boolean;
  }; // Initial title — optional
  scene?: SceneType; // 'mobile' | 'pc' | 'all'; currently unused — can be ignored
  minWH?: {
    minW: number | -1; // Minimum card width — a positive number indicates how many columns it spans (out of 24), -1 means unlimited (calculate manually)
    minH: number | -1; // Minimum card height — a positive number indicates how many rows it spans (each row = 30px), -1 means unlimited (calculate manually)
  };
  preset?: Record<string, any>; // Initial preset configuration — customizable
}

export interface CardItem {
  cardItemBase: CardItemBase;
  poster: any; // Example image — size: 193x120
  component: any; // Card component — typically ./component.vue
  configForm: any; // Card configuration file — typically card-config.vue
}

