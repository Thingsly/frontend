# TelemetryDataHistoryListFilter Component

This is a Vue 3 component used to provide filtering functionality for the telemetry data history of a specified device. It allows users to filter data by time range (preset or custom) and aggregation methods (time window and aggregation functions), and also provides an option to export the data.

## Features

*   Select a preset time range (e.g., last 1 hour, last 24 hours) or a custom time range.
*   Select the time window for data aggregation (e.g., no aggregation, 30 seconds, 1 minute, 1 hour).
*   When selecting an aggregation window, choose an aggregation function (average, maximum, minimum, sum, difference).
*   Automatically disable incompatible aggregation window options based on the selected time range (e.g., you cannot aggregate by day when querying 1-hour data).
*   Automatically adjust the aggregation window to prevent invalid combinations from being selected.
*   Two display modes are available: `detailed` (displays buttons with labels) and `simple` (displays icon buttons with Tooltips).
*   Optional export button to trigger the data export process.
*   Automatically fetch data when the filter conditions change or the component is mounted.
*   Automatically re-fetch data when the device ID (`deviceId`) or telemetry key (`theKey`) changes.
*   Emit events for data updates (`update:data`) and loading state updates (`update:loading`).

## Props

| Prop               | Type                             | Default     | Description                                                                | Required |
| :----------------- | :------------------------------- | :---------- | :----------------------------------------------------------------------- | :------- |
| `deviceId`         | `string`                         | -           | The device ID for querying data.                                           | Yes      |
| `theKey`           | `string`                         | -           | The telemetry data key to query.                                           | Yes      |
| `showExportButton` | `boolean`                        | `false`     | Whether to show the export button.                                         | No       |
| `displayMode`      | `'detailed' \| 'simple'`         | `'detailed'`| The display mode of the component: `'detailed'` displays full buttons, `'simple'` displays icon buttons with Tooltips. | No       |

## Emits

| Event Name        | Parameter Type       | Description                                                                |
| :---------------- | :------------------- | :----------------------------------------------------------------------- |
| `update:data`     | `TimeSeriesItem[]`   | Emitted when the filtered data has been loaded, passing the fetched time series data array. |
| `update:loading`  | `boolean`            | Emitted when the loading state changes (true for loading, false for finished). |
| `update:filterParams` | `FilterParams`     | Emitted when the filter parameters are ready (used for data fetching or export). Parent components can listen to this event to get the current filter conditions. |

## TimeSeriesItem Structure

```typescript
interface TimeSeriesItem {
  x: number; // Timestamp (in milliseconds)
  x2?: number; // Optional second timestamp (for difference aggregation, etc.)
  y: number; // Telemetry value
}
```

## Usage Example

```vue
<script setup lang="ts">
import { ref } from 'vue';
import TelemetryDataHistoryListFilter from '@/components/TelemetryDataHistoryListFilter/index.vue';

const deviceId = ref('your-device-id');
const telemetryKey = ref('temperature');
const historyData = ref([]);
const isLoading = ref(false);

const handleDataUpdate = (data) => {
  historyData.value = data;
  console.log('Data updated:', data);
};

const handleLoadingUpdate = (loading) => {
  isLoading.value = loading;
  console.log('Loading state:', loading);
};
</script>

<template>
  <div>
    <h2>Telemetry Data for {{ telemetryKey }}</h2>
    <TelemetryDataHistoryListFilter
      :device-id="deviceId"
      :the-key="telemetryKey"
      :show-export-button="true"
      display-mode="detailed"
      @update:data="handleDataUpdate"
      @update:loading="handleLoadingUpdate"
    />

    <div v-if="isLoading">
      Loading data...
    </div>
    <div v-else>
      <pre>{{ JSON.stringify(historyData, null, 2) }}</pre>
    </div>
  </div>
</template>
```

## Note

- The component depends on Naive UI (`naive-ui`) and `@vicons/material` icon libraries. Ensure these dependencies are installed and configured properly.

- The component relies on an API service function named `telemetryDataHistoryList` to fetch data, as well as a `useLoading` hook and a `createLogger`utility function. Make sure these services and utilities are available and paths are correct.

- The export function (`handleExport`) currently only logs to the console and shows a message (`window.$message`). The actual file download logic may need to be implemented according to the backend API's response.

- Internationalization (i18n) is currently marked as // TODO and should be implemented based on project requirements.