export type DeviceSourceItem = {
  cardId?: string;
  deviceId?: string;
  deviceMetrics?: string;
  name?: string;
  metricsId?: string;
  metricsType?: string; // telemetry | attributes | event | command
  metricsDataType?: string; // number | string | boolean
  metricsName?: string;
  metricsOptions?: any[];
  metricsShow: boolean;
  aggregate_function: string;
};

export interface ICardData {
  type?: ICardDefine['type'];
  cardId?: string;

  config?: Record<string, any>;
  title?: string;

  basicSettings?: {
    showTitle?: boolean;
    title?: string;
  };
  layout?: {
    w?: number;
    h?: number;
    minW?: number;
    minH?: number;
  };

  dataSource?: {
    origin: 'system' | 'device';
    sourceNum?: number;
    systemSource?: { type?: number; name?: string }[];
    deviceCount?: number;
    isSupportTimeRange: boolean;
    dataTimeRange: string;
    isSupportAggregate: boolean;
    dataAggregateRange: string;
    deviceSource?: DeviceSourceItem[];
  };
}

export interface ICardView {
  x: number;
  y: number;
  w: number;
  h: number;
  i: number;
  minW?: number;
  minH?: number;
  data?: ICardData;
}

export interface ICardDefine {
  component: any;
  remoteId?: string;
  id: string;
  title: string;
  poster: string;
  type: 'builtin' | 'device' | 'plugin' | 'chart';

  scene?: 'mobile' | 'pc' | 'all';
  configForm?: any;

  preset?: {
    config?: object;
    dataSource?: ICardData['dataSource'];
    basicSettings?: ICardData['basicSettings'];
    iCardViewDefault?: {
      w?: number;
      h?: number;
      minW?: number;
      minH?: number;
    };
  };
}

export interface ICardFormIns {
  setCard: (card?: ICardData | null) => void;
}

export interface IConfigCtx {
  config: Record<string, any>;
  view?: boolean;
}

export interface ICardItem {
  getComponent(): any;
}

export interface ICardRender {
  addCard(data: ICardData): void;
  getCardComponent(cardView: ICardView): ICardItem | null;
}
