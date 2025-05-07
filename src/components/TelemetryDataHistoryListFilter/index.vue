<script setup lang="ts">
import { reactive, ref, watch, onMounted, computed } from 'vue';
import { telemetryDataHistoryList } from '@/service/api/device';
import { useLoading } from '~/packages/hooks';
import { createLogger } from '@/utils/logger';
import { NSpace, NDatePicker, NButton, NTooltip, NPopselect, NIcon } from 'naive-ui';
import {
  WorkspacesFilled,
  DateRangeSharp,
  FormatOverlineFilled,
  ImportExportOutlined
} from '@vicons/material';

const logger = createLogger('TelemetryFilter');


const props = withDefaults(defineProps<{
  deviceId: string;
  theKey: string;
  showExportButton?: boolean;
  displayMode?: 'detailed' | 'simple'; // 'detailed' for button, 'simple' for icon
}>(), {
  showExportButton: false,
  displayMode: 'detailed' // Default to detailed view
});


const emit = defineEmits<{
  (event: 'update:data', data: TimeSeriesItem[]): void;
  (event: 'update:loading', isLoading: boolean): void;
  (event: 'update:filterParams', params: FilterParams): void;
}>();



interface FilterParams {
  aggregate_function?: 'avg' | 'max' | 'min' | 'sum' | 'diff';
  aggregate_window?: 'no_aggregate' | '30s' | '1m' | '2m' | '5m' | '10m' | '30m' | '1h' | '3h' | '6h' | '1d' | '7d' | '1mo';
  end_time?: number;
  start_time?: number;
  time_range?: 'custom' | 'last_5m' | 'last_15m' | 'last_30m' | 'last_1h' | 'last_3h' | 'last_6h' | 'last_12h' | 'last_24h' | 'last_3d' | 'last_7d' | 'last_15d' | 'last_30d' | 'last_60d' | 'last_90d' | 'last_6m' | 'last_1y';
}


interface TimeSeriesItem {

  x: number;
  x2?: number;
  y: number;
}

// --- Constants and Helper Functions (Moved Up) ---
const windowToSeconds = (window: string): number => {
  if (window === 'no_aggregate') return -1;
  const match = window.match(/^(\d+)([smhdmo]{1,2})$/);
  if (!match) return Infinity;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 24 * 60 * 60;
    case 'mo': return value * 30 * 24 * 60 * 60; // Approximation
    default: return Infinity;
  }
};

// Fix type definition for allAggregateWindowOptions with explicit casting
type AggregateWindowValue = NonNullable<FilterParams['aggregate_window']>; // Alias for clarity

const allAggregateWindowOptions: Array<{ label: string; value: AggregateWindowValue; seconds: number }> = [
  { label: 'No aggregate', value: 'no_aggregate' as AggregateWindowValue, seconds: windowToSeconds('no_aggregate') },
  { label: '30s', value: '30s' as AggregateWindowValue, seconds: windowToSeconds('30s') },
  { label: '1 minute', value: '1m' as AggregateWindowValue, seconds: windowToSeconds('1m') },
  { label: '2 minutes', value: '2m' as AggregateWindowValue, seconds: windowToSeconds('2m') },
  { label: '5 minutes', value: '5m' as AggregateWindowValue, seconds: windowToSeconds('5m') },
  { label: '10 minutes', value: '10m' as AggregateWindowValue, seconds: windowToSeconds('10m') },
  { label: '30 minutes', value: '30m' as AggregateWindowValue, seconds: windowToSeconds('30m') },
  { label: '1 hour', value: '1h' as AggregateWindowValue, seconds: windowToSeconds('1h') },
  { label: '3 hours', value: '3h' as AggregateWindowValue, seconds: windowToSeconds('3h') },
  { label: '6 hours', value: '6h' as AggregateWindowValue, seconds: windowToSeconds('6h') },
  { label: '1 day', value: '1d' as AggregateWindowValue, seconds: windowToSeconds('1d') },
  { label: '7 days', value: '7d' as AggregateWindowValue, seconds: windowToSeconds('7d') },
  { label: '1 month', value: '1mo' as AggregateWindowValue, seconds: windowToSeconds('1mo') }
].sort((a, b) => a.seconds - b.seconds);

type TimeRangeKey = NonNullable<FilterParams['time_range']>;
const timeRangeMinWindowSeconds: Record<TimeRangeKey, number> = {
  last_5m: -1,
  last_15m: -1,
  last_30m: -1,
  last_1h: -1,
  last_3h: windowToSeconds('30s'),
  last_6h: windowToSeconds('1m'),
  last_12h: windowToSeconds('2m'),
  last_24h: windowToSeconds('5m'),
  last_3d: windowToSeconds('10m'),
  last_7d: windowToSeconds('30m'),
  last_15d: windowToSeconds('1h'),
  last_30d: windowToSeconds('3h'),
  last_60d: windowToSeconds('6h'),
  last_90d: windowToSeconds('1d'),
  last_6m: windowToSeconds('7d'),
  last_1y: windowToSeconds('1mo'),
  custom: -1, // Needs calculation
};

const getMinWindowSecondsForDuration = (durationMs: number): number => {
    const durationHours = durationMs / (1000 * 60 * 60);
    if (durationHours < 3) return timeRangeMinWindowSeconds.last_1h;
    if (durationHours < 6) return timeRangeMinWindowSeconds.last_3h;
    if (durationHours < 12) return timeRangeMinWindowSeconds.last_6h;
    if (durationHours < 24) return timeRangeMinWindowSeconds.last_12h;
    if (durationHours < 3 * 24) return timeRangeMinWindowSeconds.last_24h;
    if (durationHours < 7 * 24) return timeRangeMinWindowSeconds.last_3d;
    if (durationHours < 15 * 24) return timeRangeMinWindowSeconds.last_7d;
    if (durationHours < 30 * 24) return timeRangeMinWindowSeconds.last_15d;
    if (durationHours < 60 * 24) return timeRangeMinWindowSeconds.last_30d;
    if (durationHours < 90 * 24) return timeRangeMinWindowSeconds.last_60d;
    if (durationHours < 180 * 24) return timeRangeMinWindowSeconds.last_90d;
    if (durationHours < 365 * 24) return timeRangeMinWindowSeconds.last_6m;
    return timeRangeMinWindowSeconds.last_1y;
};


const { loading: isLoading, startLoading, endLoading } = useLoading(false);
const { loading: isExporting, startLoading: startExporting, endLoading: endExporting } = useLoading(false); // Separate loading state for export
const timeSeriesData = ref<TimeSeriesItem[]>([]);


const filterParams = reactive<FilterParams>({
  time_range: 'last_1h',
  aggregate_window: 'no_aggregate',
});


const dateRangeRef = ref<[number, number] | null>(null);



const timeRangeOptions = ref([
  { label: 'Custom', value: 'custom' },
  { label: 'Last 5 minutes', value: 'last_5m' },
  { label: 'Last 15 minutes', value: 'last_15m' },
  { label: 'Last 30 minutes', value: 'last_30m' },
  { label: 'Last 1 hour', value: 'last_1h' },
  { label: 'Last 3 hours', value: 'last_3h' },
  { label: 'Last 6 hours', value: 'last_6h' },
  { label: 'Last 12 hours', value: 'last_12h' },
  { label: 'Last 24 hours', value: 'last_24h' },
  { label: 'Last 3 days', value: 'last_3d' },
  { label: 'Last 7 days', value: 'last_7d' },
  { label: 'Last 15 days', value: 'last_15d' },
  { label: 'Last 30 days', value: 'last_30d' },
  { label: 'Last 60 days', value: 'last_60d' },
  { label: 'Last 90 days', value: 'last_90d' },
  { label: 'Last 6 months', value: 'last_6m' },
  { label: 'Last 1 year', value: 'last_1y' }
]);

const aggregateFunctionOptions = ref([
  { label: 'Average', value: 'avg' },
  { label: 'Maximum', value: 'max' },
  { label: 'Minimum', value: 'min' },
  { label: 'Sum', value: 'sum' },
  { label: 'Difference', value: 'diff' }
]);

const currentMinWindowSeconds = computed(() => {
  if (filterParams.time_range === 'custom') {
    if (dateRangeRef.value && dateRangeRef.value.length === 2) {
      const durationMs = dateRangeRef.value[1] - dateRangeRef.value[0];
      return getMinWindowSecondsForDuration(durationMs);
    }
    return -1; // Default for custom if range not set
  }
  return timeRangeMinWindowSeconds[filterParams.time_range ?? 'last_1h'];
});

// Define the type for the computed options explicitly
type AggregateWindowOption = {
    label: string;
    value: FilterParams['aggregate_window'];
    seconds: number;
    disabled: boolean; // Ensure disabled is part of the type
};

// Refined: Disable 'no_aggregate' when minSeconds > -1
const aggregateWindowOptions = computed<AggregateWindowOption[]>(() => {
  const minSeconds = currentMinWindowSeconds.value;
  return allAggregateWindowOptions.map(option => ({
    ...option,
    // Corrected disabled logic
    disabled: (option.value === 'no_aggregate' && minSeconds > -1) ||
              (option.seconds !== -1 && option.seconds < minSeconds)
  }));
});


const showAggregateFunction = computed(() => filterParams.aggregate_window !== 'no_aggregate');

// *** ADDED: Computed properties for selected labels ***
const selectedTimeRangeLabel = computed(() => {
  return timeRangeOptions.value.find(opt => opt.value === filterParams.time_range)?.label ?? 'Select time'; // Fallback text
});

const selectedAggregateWindowLabel = computed(() => {
  // Use allAggregateWindowOptions to find the label based on value
  return allAggregateWindowOptions.find(opt => opt.value === filterParams.aggregate_window)?.label ?? 'Select Interval'; // Fallback text
});

const selectedAggregateFunctionLabel = computed(() => {
  if (!showAggregateFunction.value) return ''; // Don't compute if not shown
  return aggregateFunctionOptions.value.find(opt => opt.value === filterParams.aggregate_function)?.label ?? 'Select Method'; // Fallback text
});

const fetchData = async (isExport = false) => {
  if (!props.deviceId || !props.theKey) {
    logger.warn('Device ID or Key is missing, skipping fetch.');
    timeSeriesData.value = [];
    emit('update:data', []);
    return;
  }

  startLoading();
  emit('update:loading', true);

  const params: any = {
    device_id: props.deviceId,
    key: props.theKey,
    ...filterParams,
  };

  
  if (params.time_range !== 'custom') {
    delete params.start_time;
    delete params.end_time;
  }
  if (params.aggregate_window === 'no_aggregate') {
    delete params.aggregate_function;
  } else if (!params.aggregate_function) {
    params.aggregate_function = 'avg'; 
  }

  if (isExport) {
    params.is_export = true;
  }

  try {
    logger.info(`Fetching telemetry data (${isExport ? 'Export' : 'Display'}). Params:`, JSON.parse(JSON.stringify(params))); // Log clean params
    
    const response: { data: TimeSeriesItem[] | null; error: any } = await telemetryDataHistoryList(params);
    logger.info('API Response:', response);

    if (response && response.data && !response.error) {
      if (isExport) {
        // TODO: Handle export file download (e.g., using response.data.filePath)
        logger.info('Export successful:', response.data);
        window.$message?.success('Export task has started'); // Example user feedback
      } else {
        const receivedData: TimeSeriesItem[] = (response.data || []) as TimeSeriesItem[];
        timeSeriesData.value = receivedData;
        emit('update:data', timeSeriesData.value);
      }
    } else {
      logger.error('API Error or invalid response:', response?.error);
      if (!isExport) { // Only clear data/show error for display fetches
         timeSeriesData.value = [];
         emit('update:data', []);
         window.$message?.error(`Failed to fetch data: ${response?.error?.message || 'Unknown error'}`);
      } else {
         window.$message?.error(`Export failed: ${response?.error?.message || 'Unknown error'}`);
      }
    }
  } catch (error: any) {
    logger.error('Fetch exception:', error);
     if (!isExport) {
        timeSeriesData.value = [];
        emit('update:data', []);
         window.$message?.error(`Data fetch error: ${error.message}`);
     } else {
         window.$message?.error(`Export error: ${error.message}`);
     }
  } finally {
    endLoading();
    if (!isExport) emit('update:loading', false);
  }
};

// Watcher for custom date range selection
watch(dateRangeRef, (newRange) => {
  if (newRange && newRange.length === 2) {
    // Force time_range to 'custom' when a date is picked
    if (filterParams.time_range !== 'custom') {
        logger.info('Date range selected, forcing time_range to custom.');
        filterParams.time_range = 'custom';
    }
    // Update start/end times directly
    filterParams.start_time = newRange[0];
    filterParams.end_time = newRange[1];
    // Fetch data will be triggered by the time_range watcher if it changed,
    // or we trigger it manually if time_range was already 'custom'
    if (filterParams.time_range === 'custom') {
        logger.info('Custom date range updated, triggering validation and fetch.');
        // Manually trigger validation/fetch since time_range didn't change
        validateAndFetch();
    }
  } else if (filterParams.time_range === 'custom') {
      // Only clear times if the mode is actually 'custom' and the range was cleared
      delete filterParams.start_time;
      delete filterParams.end_time;
      logger.info('Custom date range cleared. Fetch prevented.');
      // Prevent fetching invalid state
      // Optionally clear existing data:
      // timeSeriesData.value = [];
      // emit('update:data', []);
  }
}, { deep: true });

// Main watcher for time_range changes and cascading validation
watch(() => filterParams.time_range, (newTimeRange, oldTimeRange) => {
  logger.info(`Time range changed: ${oldTimeRange} -> ${newTimeRange}`);

  // 1. Clear custom date range if switching away from 'custom'
  // Also clears start/end times implicitly
  if (newTimeRange !== 'custom') {
    dateRangeRef.value = null;
    // No need to delete start/end here, as dateRangeRef watcher handles it if cleared,
    // and they are ignored by fetchData if time_range is not 'custom'
  }

  // Trigger validation and potential fetch
  validateAndFetch();

});

// Watch aggregate_window separately to handle function default
watch(() => filterParams.aggregate_window, (newWindow) => {
    logger.info(`Aggregate window changed to: ${newWindow}`);
    // Adjust aggregate_function (logic remains the same)
    if (newWindow === 'no_aggregate') {
        delete filterParams.aggregate_function;
    } else if (!filterParams.aggregate_function) {
        filterParams.aggregate_function = 'avg';
    }
    // Trigger validation and fetch/emit after aggregate window changes
    validateAndFetch();
});

// *** ADD THIS WATCHER ***
// Watch aggregate_function separately to trigger update
watch(() => filterParams.aggregate_function, (newFunction) => {
    // Check if the function is relevant (i.e., window is not 'no_aggregate')
    if (filterParams.aggregate_window !== 'no_aggregate') {
        logger.info(`Aggregate function changed to: ${newFunction}, triggering validation.`);
        // Trigger validation and fetch/emit
        validateAndFetch();
    } else {
        // This case shouldn't happen if logic is correct, but log if it does
        logger.warn(`Aggregate function changed (${newFunction}) while window is 'no_aggregate'. Ignoring.`);
    }
});

// Central validation and fetch triggering function (Refined)
const validateAndFetch = () => {
    const minSeconds = currentMinWindowSeconds.value;
    const currentWindowSeconds = windowToSeconds(filterParams.aggregate_window ?? 'no_aggregate');
    let windowChanged = false;

    // *** Corrected Check Order and Logic ***
    // 1. Check if 'no_aggregate' is selected when it's forbidden
    if (minSeconds > -1 && currentWindowSeconds === -1) {
        const firstValidOption = aggregateWindowOptions.value.find(opt => !opt.disabled && opt.value !== 'no_aggregate');
        const newWindow = firstValidOption ? firstValidOption.value : '30s'; // Fallback to 30s
         if (filterParams.aggregate_window !== newWindow) {
            logger.info(`Aggregate window 'no_aggregate' is invalid. Resetting to '${newWindow}'.`);
            filterParams.aggregate_window = newWindow as FilterParams['aggregate_window'];
            windowChanged = true;
         }
    }
    // 2. Check if a specific interval is selected but is now too small
    else if (currentWindowSeconds !== -1 && currentWindowSeconds < minSeconds) {
        const firstValidOption = aggregateWindowOptions.value.find(opt => !opt.disabled);
        const newWindow = firstValidOption ? firstValidOption.value : 'no_aggregate';
        if (filterParams.aggregate_window !== newWindow) {
            logger.info(`Aggregate window '${filterParams.aggregate_window}' invalid (too small). Resetting to '${newWindow}'.`);
            filterParams.aggregate_window = newWindow as FilterParams['aggregate_window'];
            windowChanged = true;
        }
    }

    // Adjust aggregate_function (logic remains the same)
    if (filterParams.aggregate_window === 'no_aggregate') {
        delete filterParams.aggregate_function;
    } else if (!filterParams.aggregate_function || windowChanged) {
        filterParams.aggregate_function = 'avg';
    }

    // Fetch data if parameters are valid (logic remains the same)
    if (filterParams.time_range === 'custom' && (!filterParams.start_time || !filterParams.end_time)) {
        logger.info('Validation complete. Waiting for custom date range selection...');
        // Even if waiting, emit the current valid (but incomplete for custom) params
        emit('update:filterParams', JSON.parse(JSON.stringify(filterParams)));
    } else {
        logger.info('Validation complete. Triggering fetchData and emitting filterParams.');
        // Emit the validated and complete parameters before fetching data
        emit('update:filterParams', JSON.parse(JSON.stringify(filterParams)));
        fetchData();
    }
};

// Watch props separately (remains the same)
watch(() => [props.deviceId, props.theKey], (newVal, oldVal) => {
  if (newVal[0] && newVal[1] && (newVal[0] !== oldVal[0] || newVal[1] !== oldVal[1])) {
     logger.info('Device ID or Key changed, fetching data...');
     validateAndFetch(); // Validate and fetch when props change
  }
}, { immediate: false });

// Initial validation and fetch on mount
onMounted(() => {
   logger.info('Component mounted, performing initial validation and fetch...');
   validateAndFetch(); // Use central validation function
});

const handleExport = () => {
  if (filterParams.time_range === 'custom' && (!filterParams.start_time || !filterParams.end_time)) {
      window.$message?.warning('Please select a custom time range before exporting');
      return;
  }
  logger.info('Export button clicked.');
  // Emit current params before triggering export fetch
  emit('update:filterParams', JSON.parse(JSON.stringify(filterParams)));
  fetchData(true);
};

</script>

<template>
  <n-space align="center" wrap item-style="margin-bottom: 5px;" :size="4">
    <!-- Time Range Popselect -->
    <n-popselect
      v-model:value="filterParams.time_range"
      :options="timeRangeOptions"
      size="small"
      trigger="click"
    >
      <!-- Detailed Trigger (Button) -->
      <n-button v-if="props.displayMode === 'detailed'" size="small" tertiary>
        {{ selectedTimeRangeLabel }}
      </n-button>
      <!-- Simple Trigger (Icon inside colored circle with Tooltip) -->
      <n-tooltip v-else trigger="hover">
        <template #trigger>
          <div
            style="width: 20px; height: 20px; background-color: #60a5fa; /* Blue */ border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;"
          >
            <n-icon size="14" color="#fff">
              <DateRangeSharp />
            </n-icon>
          </div>
        </template>
        {{ selectedTimeRangeLabel }}
      </n-tooltip>
    </n-popselect>

    <!-- Custom Date Range Picker -->
    <n-date-picker
      v-show="filterParams.time_range === 'custom'"
      v-model:value="dateRangeRef"
      type="datetimerange"
      clearable
      format="yyyy-MM-dd HH:mm:ss"
      placeholder="Select Custom Time Range"
      size="small"
      style="min-width: 280px;"
      :disabled="filterParams.time_range !== 'custom'"
    />

    <!-- Aggregate Window Popselect -->
    <n-popselect
      v-model:value="filterParams.aggregate_window"
      :options="aggregateWindowOptions"
      size="small"
      trigger="click"
    >
       <!-- Detailed Trigger (Button) -->
       <n-button v-if="props.displayMode === 'detailed'" size="small" tertiary>
        {{ selectedAggregateWindowLabel }}
       </n-button>
        <!-- Simple Trigger (Icon inside colored circle with Tooltip) -->
        <n-tooltip v-else trigger="hover">
          <template #trigger>
            <div
              style="width: 20px; height: 20px; background-color: #34d399; /* Green */ border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;"
            >
              <n-icon size="14" color="#fff">
                <WorkspacesFilled />
              </n-icon>
            </div>
          </template>
          {{ selectedAggregateWindowLabel }}
      </n-tooltip>
    </n-popselect>

    <!-- Aggregate Function Popselect -->
    <n-popselect
      v-if="showAggregateFunction"
      v-model:value="filterParams.aggregate_function"
      :options="aggregateFunctionOptions"
      size="small"
      trigger="click"
    >
       <!-- Detailed Trigger (Button) -->
       <n-button v-if="props.displayMode === 'detailed'" size="small" tertiary>
        {{ selectedAggregateFunctionLabel }}
       </n-button>
       <!-- Simple Trigger (Icon inside colored circle with Tooltip) -->
       <n-tooltip v-else trigger="hover">
          <template #trigger>
             <div
               style="width: 20px; height: 20px; background-color: #fbbf24; /* Amber */ border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;"
             >
                <n-icon size="14" color="#fff">
                  <FormatOverlineFilled />
                </n-icon>
             </div>
          </template>
          {{ selectedAggregateFunctionLabel }}
      </n-tooltip>
    </n-popselect>

    <!-- Export Button -->
    <template v-if="props.showExportButton">
      <!-- Detailed Export Button -->
      <n-button
        v-if="props.displayMode === 'detailed'"
        @click="handleExport"
        :loading="isExporting"
        :disabled="isLoading || isExporting"
        type="primary"
        size="small"
        ghost
      >
      Export
      </n-button>
      <!-- Simple Export Button (Icon with Tooltip) -->
      <n-tooltip v-else trigger="hover">
        <template #trigger>
          <n-button
            text
            @click="handleExport"
            :loading="isExporting"
            :disabled="isLoading || isExporting"
            style="font-size: 18px; padding: 2px;"
          >
            <n-icon :component="ImportExportOutlined" />
          </n-button>
        </template>
        Export
      </n-tooltip>
    </template>
  </n-space>
</template>

<style scoped>
/* Optional: Add styles if needed */
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
