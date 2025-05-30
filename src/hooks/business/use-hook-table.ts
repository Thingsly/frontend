import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import type {
  DataTableBaseColumn,
  DataTableExpandColumn,
  DataTableSelectionColumn,
  PaginationProps
} from 'naive-ui';
import type { TableColumnGroup } from 'naive-ui/es/data-table/src/interface';
import useLoadingEmpty from '../common/use-loading-empty';

/** API request function */
type ApiFn<T = any, R = any> = (args: T) => Promise<App.Service.DEVResponse<R>>;

/** Extracts the parameter type from an API function */
type GetApiFnParameters<T extends ApiFn, R = any> = T extends (
  args: infer P
) => Promise<App.Service.DEVResponse<R>>
  ? P
  : never;

/** Extracts the response data type from an API function */
type GetApiFnReturnType<T extends ApiFn, P = any> = T extends (
  args: P
) => Promise<App.Service.DEVResponse<infer R>>
  ? R
  : never;

/** Data structure returned after transforming the API response for table use */
type Transformer<TableData, Response> = (response: Response) => {
  data: TableData[];
  pageNum: number;
  pageSize: number;
  total: number;
};

/** Updates the API parameters before making a request */
type ApiParamsUpdater<P, R> = (params: P) => R;

/** Pagination parameters */
type PagePropsOfPagination = Pick<PaginationProps, 'page' | 'pageSize'>;

/** Custom column key */
type CustomColumnKey<K = never> = K | 'action';

/** Table column definition */
type HookTableColumn<T = Record<string, unknown>> =
  | (Omit<TableColumnGroup<T>, 'key'> & { key: CustomColumnKey<keyof T> })
  | (Omit<DataTableBaseColumn<T>, 'key'> & { key: CustomColumnKey<keyof T> })
  | DataTableSelectionColumn<T>
  | DataTableExpandColumn<T>;

/** Table configuration */
type HookTableConfig<TableData, Fn extends ApiFn> = {
  /** API request parameters */
  apiParams: GetApiFnParameters<Fn>;
  /** Function to transform API response into table data */
  transformer: Transformer<TableData, GetApiFnReturnType<Fn>>;
  /** Columns for the table */
  columns: () => HookTableColumn<TableData>[];
  /**
   * API parameter updater
   *
   * Used to update pagination-related parameters. If the API request parameters do not include
   * `page` and `pageSize` fields, use this function to inject them.
   *
   * @default p => p
   */
  apiParamsUpdater?: ApiParamsUpdater<
    GetApiFnParameters<Fn> & Partial<PagePropsOfPagination>,
    GetApiFnParameters<Fn>
  >;
  /** Pagination configuration */
  pagination?: PaginationProps;
  /**
   * Whether to execute the request immediately
   *
   * @default true
   */
  immediate?: boolean;
};

/**
 * Generic table hook
 *
 * @param apiFn - The API request function
 * @param config - The table configuration
 */
export default function useHookTable<TableData, Fn extends ApiFn>(
  apiFn: Fn,
  config: HookTableConfig<TableData, Fn>
) {
  const { loading, startLoading, endLoading, empty, setEmpty } =
    useLoadingEmpty();

  const {
    apiParams,
    transformer,
    apiParamsUpdater = (p) => p,
    immediate = true
  } = config;

  const data: Ref<TableData[]> = ref([]);

  function updateData(update: TableData[]) {
    data.value = update;
  }

  const columns = ref(config.columns()) as Ref<HookTableColumn<TableData>[]>;

  const requestParams = ref(apiParams) as Ref<
    HookTableConfig<TableData, Fn>['apiParams']
  >;

  function updateRequestParamsByPagination(p: PagePropsOfPagination) {
    requestParams.value = apiParamsUpdater({ ...requestParams.value, ...p });
  }

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [10, 15, 20, 25, 30],
    onChange: (page: number) => {
      pagination.page = page;

      updateRequestParamsByPagination({ page });
      getData();
    },
    onUpdatePageSize: (pageSize: number) => {
      pagination.pageSize = pageSize;
      pagination.page = 1;

      updateRequestParamsByPagination({ pageSize });
      getData();
    },
    ...config.pagination
  }) as PaginationProps;

  function updatePagination(update: Partial<PaginationProps>) {
    Object.assign(pagination, update);

    updateRequestParamsByPagination({
      page: pagination.page,
      pageSize: pagination.pageSize
    });
  }

  async function getData() {
    startLoading();

    const { data: apiData, error } = await apiFn(requestParams.value);

    if (!error && data) {
      const {
        data: tableData,
        pageNum,
        pageSize,
        total
      } = transformer(apiData);

      updateData(tableData);

      setEmpty(tableData.length === 0);

      updatePagination({ page: pageNum, pageSize, itemCount: total });
    }

    endLoading();
  }

  function reloadColumns() {
    columns.value = config.columns();
  }

  if (immediate) {
    getData();
  }

  return {
    data,
    columns,
    loading,
    empty,
    pagination,
    getData,
    updatePagination,
    reloadColumns
  };
}
