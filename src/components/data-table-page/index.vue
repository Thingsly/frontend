<script lang="tsx" setup>
import type { VueElement } from 'vue';
import {
  computed,
  defineProps,
  getCurrentInstance,
  ref,
  watch,
  watchEffect
} from 'vue';
import {
  NButton,
  NDataTable,
  NDatePicker,
  NInput,
  NPopconfirm,
  NSelect,
  NSpace
} from 'naive-ui';
import type { TreeSelectOption } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { $t } from '@/locales';
import { formatDateTime } from '@/utils/common/datetime';
import { createLogger } from '@/utils/logger';
import TencentMap from './modules/tencent-map.vue';
const logger = createLogger('TablePage');
export type theLabel = string | (() => string) | undefined;
export type SearchConfig =
  | {
      key: string;
      label: string;
      type: 'input' | 'date' | 'date-range';
      initValue?: any;
    }
  | {
      key: string;
      label: string;
      type: 'select';
      renderLabel?: any;
      renderTag?: any;
      initValue?: any;
      extendParams?: object;
      options: { label: theLabel; value: any }[];
      labelField?: string;
      valueField?: string;
      loadOptions?: (pattern) => Promise<{ label: theLabel; value: any }[]>;
    }
  | {
      key: string;
      label: string;
      type: 'tree-select';
      initValue?: any;
      options: TreeSelectOption[];
      multiple: boolean;
      loadOptions?: () => Promise<TreeSelectOption[]>;
    };

const props = defineProps<{
  fetchData: (data: any) => Promise<any>;
  columnsToShow:
    | {
        key: string;
        label: theLabel;
        render?: (row: any) => VueElement | string | undefined;
      }[]
    | 'all';
  searchConfigs: SearchConfig[];
  tableActions: Array<{
    theKey?: string;
    label: theLabel;
    callback: any;
  }>;
  topActions: { element: () => JSX.Element }[];
  rowClick?: (row: any) => void;
  initPage?: number;
  initPageSize?: number;
}>();
const { loading, startLoading, endLoading } = useLoading();

const { fetchData, columnsToShow, tableActions, searchConfigs }: any = props;
const isTableView = ref(true);
const dataList = ref([]);
const total = ref(0);
const currentPage = ref(props.initPage || 1);
const pageSize = ref(props.initPageSize || 10);
const searchCriteria: any = ref(
  Object.fromEntries(searchConfigs.map((item) => [item.key, item.initValue]))
);

const getData = async () => {
  startLoading();
  const processedSearchCriteria = Object.fromEntries(
    Object.entries(searchCriteria.value).map(([key, value]) => {
      if (value && Array.isArray(value)) {
        return [
          key,
          value.map((v) => (v instanceof Date ? v.toISOString() : v))
        ];
      }

      return [key, value instanceof Date ? value.toISOString() : value];
    })
  );

  const response = await fetchData({
    page: currentPage.value,
    page_size: pageSize.value,
    ...processedSearchCriteria
  });

  if (!response.error) {
    dataList.value = response.data.list;
    total.value = response.data.total;
  } else {
    logger.error({ 'Error fetching data:': response.error });
  }
  endLoading();
};

const generatedColumns = computed(() => {
  let columns;

  if (dataList.value.length > 0) {
    columns = (
      columnsToShow === 'all' ? Object.keys(dataList.value[0]) : columnsToShow
    ).map((item) => {
      if (item.render) {
        return {
          ...item,
          title: item.label,
          key: item.key,
          render: (row) => item.render(row)
        };
      }
      return {
        ...item,
        title: item.label,
        key: item.key,
        render: (row) => {
          if (item.key === 'ts' && row[item.key]) {
            return formatDateTime(row[item.key]);
          }
          return <>{row[item.key]}</>;
        }
      };
    });

    columns.push({
      title: $t('custom.groupPage.actions'),
      key: 'actions',
      width: 180,
      render: (row) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <NSpace>
            {tableActions.map((action) => {
              if (
                action.theKey === $t('custom.devicePage.delete') ||
                action.theKey === '删除'
              ) {
                return (
                  <NPopconfirm
                    onPositiveClick={async (e) => {
                      e.stopPropagation();
                      await action.callback(row);

                      getData();
                    }}
                  >
                    {{
                      trigger: () => (
                        <NButton type="error" size="small">
                          {typeof action.label === 'function'
                            ? action.label()
                            : action.label || ''}
                        </NButton>
                      ),
                      default: () => $t('common.confirmDelete')
                    }}
                  </NPopconfirm>
                );
              }
              return (
                <NButton
                  type="primary"
                  size="small"
                  onClick={() => action.callback(row)}
                >
                  {typeof action.label === 'function'
                    ? action.label()
                    : action.label || ''}
                </NButton>
              );
            })}
          </NSpace>
        </div>
      )
    });
  }

  return columns || [];
});

const onUpdatePage = (newPage) => {
  currentPage.value = newPage;
  getData();
};
const onUpdatePageSize = (newPageSize) => {
  pageSize.value = newPageSize;
  currentPage.value = 1;
  getData();
};

watch(
  searchCriteria,
  (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      currentPage.value = 1;
      getData();
    }
  },
  { deep: true }
);

watchEffect(() => {
  searchConfigs.map((item: any) => {
    const vals = searchCriteria.value[item.key];
    if (item?.extendParams && vals) {
      item?.options.map((oitem) => {
        if (oitem.dict_value + oitem.device_type === vals) {
          item?.extendParams.map((eitem) => {
            searchCriteria.value[eitem.label] = oitem[eitem.value];
          });
        }
      });
    }
  });
  getData();
});

const handleSearch = () => {
  currentPage.value = 1;
  getData();
};

const handleReset = () => {
  Object.keys(searchCriteria.value).forEach((key) => {
    const config = searchConfigs.find((item) => item.key === key);
    if (config) {
      if (config.type === 'date-range') {
        searchCriteria.value[key] = [];
      } else if (config.type === 'tree-select') {
        searchCriteria.value[key] = config.multiple ? [] : null;
      } else if (config.type === 'select') {
        searchCriteria.value[key] = null;
      } else {
        searchCriteria.value[key] = '';
      }
    }
  });

  handleSearch();
};

const forceChangeParamsByKey = (params: Record<string, any>) => {
  Object.entries(params).forEach(([key, value]) => {
    if (key in searchCriteria.value) {
      searchCriteria.value[key] = value;
    }
  });
  getData();
};

defineExpose({
  forceChangeParamsByKey
});

const handleTreeSelectUpdate = (value, key) => {
  currentPage.value = 1;
  searchCriteria.value[key] = value;
};

const loadOptionsOnMount = async (pattern) => {
  for (const config of searchConfigs) {
    if (config.type === 'select' && config.loadOptions) {
      // eslint-disable-next-line no-await-in-loop
      const opts = await config.loadOptions(pattern);
      config.options = [...config.options, ...opts];
    }
  }
};
const rowProps = (row) => {
  if (props && props.rowClick) {
    return {
      style: 'cursor: pointer;',
      onClick: () => {
        props.rowClick && props.rowClick(row);
      }
    };
  }
  return {};
};
const loadOptionsOnMount2 = async () => {
  for (const config of searchConfigs) {
    if (config.type === 'tree-select' && config.loadOptions) {
      // eslint-disable-next-line no-await-in-loop
      const opts = await config.loadOptions();
      config.options = [...config.options, ...opts];
    }
  }
};

const getPlatform = computed(() => {
  const { proxy }: any = getCurrentInstance();
  return proxy.getPlatform();
});

// const throttledLoadOptionsOnMount = throttle(loadOptionsOnMount, 300);

loadOptionsOnMount('');
loadOptionsOnMount2();

const handleInputChange = () => {
  currentPage.value = 1;
  getData();
};

const filterSelectOption = (pattern: string, option: any) => {
  const label = typeof option.label === 'string' ? option.label : '';
  return label.includes(pattern);
};
</script>

<template>
  <n-card>
    <div class="flex flex-col gap-15px rounded-lg">
      <div class="row flex items-end justify-between gap-4">
        <div class="flex flex-1 flex-wrap items-end gap-4">
          <div
            v-for="config in searchConfigs"
            :key="config.key"
            class="flex flex-col gap-2"
            :class="getPlatform ? 'min-w-100%' : ''"
          >
            <template v-if="config.type === 'input'">
              <NInput
                v-model:value="searchCriteria[config.key]"
                size="small"
                :placeholder="$t(config.label)"
                class="input-style"
                @update:value="handleInputChange"
              />
            </template>
            <template v-else-if="config.type === 'date-range'">
              <NDatePicker
                v-model:value="searchCriteria[config.key]"
                size="small"
                type="daterange"
                :placeholder="$t(config.label)"
                class="input-style"
              />
            </template>

            <template v-else-if="config.type === 'select'">
              <NSelect
                v-model:value="searchCriteria[config.key]"
                :value-field="config.valueField"
                :label-field="config.labelField"
                size="small"
                filterable
                :filter="filterSelectOption"
                :options="config.options"
                :render-label="config.renderLabel"
                :render-tag="config.renderTag"
                :placeholder="$t(config.label)"
                class="input-style"
                @update:value="currentPage = 1"
              />
            </template>
            <template v-else-if="config.type === 'date'">
              <NDatePicker
                v-model:value="searchCriteria[config.key]"
                size="small"
                type="date"
                :placeholder="$t(config.label)"
                class="input-style"
              />
            </template>
            <template v-else-if="config.type === 'tree-select'">
              <n-tree-select
                v-model:value="searchCriteria[config.key]"
                size="small"
                filterable
                :options="config.options"
                :multiple="config.multiple"
                class="input-style"
                @update:value="
                  (value) => handleTreeSelectUpdate(value, config.key)
                "
              />
            </template>
          </div>
          <div>
            <NButton
              v-if="0"
              class="btn-style"
              size="small"
              @click="handleSearch"
              >{{ $t('common.search') }}</NButton
            >
            <NButton class="btn-style" size="small" @click="handleReset">{{
              $t('common.reset')
            }}</NButton>
          </div>
        </div>
      </div>

      <div class="h-2px w-full bg-[#f6f9f8]"></div>
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          <component
            :is="action.element"
            v-for="(action, index) in topActions"
            :key="index"
          ></component>
        </div>

        <div>
          <NButton quaternary @click="isTableView = true">
            <template #icon>
              <n-icon class="text-24px">
                <icon-material-symbols:table-rows-narrow-outline-sharp />
              </n-icon>
            </template>
          </NButton>
          <NButton quaternary @click="isTableView = false">
            <template #icon>
              <n-icon class="text-24px">
                <icon-material-symbols:map-rounded />
              </n-icon>
            </template>
          </NButton>
          <NButton quaternary @click="getData">
            <template #icon>
              <n-icon class="text-24px">
                <icon-material-symbols:refresh />
              </n-icon>
            </template>
          </NButton>
        </div>
      </div>

      <div v-if="isTableView" class="overflow-x-auto">
        <NDataTable
          :row-props="rowProps"
          :loading="loading"
          :columns="generatedColumns"
          :data="dataList"
          class="w-full"
        />
      </div>
      <div v-else class="h-525px">
        <TencentMap :devices="dataList" />
      </div>

      <n-pagination
        v-model:page="currentPage"
        v-model:page-size="pageSize"
        class="justify-end"
        :item-count="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        show-size-picker
        @update:page="onUpdatePage"
        @update:page-size="onUpdatePageSize"
      />
    </div>
  </n-card>
</template>

<style scoped lang="scss">
.input-style {
  min-width: 140px;
}

.btn-style {
  @apply hover:bg-[var(--color-primary-hover)] rounded-md shadow;
}

.card-wrapper {
  @apply rounded-lg shadow overflow-hidden;
  margin: 0 auto;
  padding: 16px;
}
</style>
