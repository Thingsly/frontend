<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { $t } from '@/locales';

interface DeviceOption {
  device_id: string;
  device_name: string;

  [key: string]: any;
}

// --- Props (Type-based) ---
interface Props {
  modelValue: string[] | null;
  options: DeviceOption[];
  loading?: boolean;
  hasMore?: boolean;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  loading: false,
  hasMore: true,
  placeholder: () => $t('common.selectPlaceholder') || 'Please select',
  disabled: false,
  clearable: false
});

// --- Emits (Type-based) ---
interface Emits {
  (e: 'update:modelValue', value: string[] | null): void;
  (e: 'loadMore'): void;
  (e: 'initialLoad'): void;
}
const emit = defineEmits<Emits>();

const showPopover = ref(false);
const selectedDeviceIds = ref<string[]>([]);

const selectedOptions = computed(() => {
  if (!selectedDeviceIds.value || selectedDeviceIds.value.length === 0) {
    return [];
  }

  const optionsMap = new Map(props.options.map((opt) => [opt.device_id, opt]));
  return selectedDeviceIds.value
    .map((id) => optionsMap.get(id))
    .filter((opt): opt is DeviceOption => Boolean(opt));
});

const handleLoadMore = () => {
  if (!props.loading && props.hasMore) {
    // console.log('Emitting loadMore');
    emit('loadMore');
  }
};

const handleOptionClick = (deviceId: string) => {
  const index = selectedDeviceIds.value.indexOf(deviceId);
  if (index > -1) {
    selectedDeviceIds.value.splice(index, 1);
  } else {
    selectedDeviceIds.value.push(deviceId);
  }
  emit('update:modelValue', [...selectedDeviceIds.value]);
};

const handlePopoverUpdateShow = (show: boolean) => {
  showPopover.value = show;
  if (show && (!props.options || props.options.length === 0)) {
    // console.log('Popover opened, emitting initialLoad');
    emit('initialLoad');
  }
};

const isSelected = (deviceId: string): boolean => {
  return selectedDeviceIds.value.includes(deviceId);
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal === null) {
      selectedDeviceIds.value = [];
    } else if (Array.isArray(newVal)) {
      if (JSON.stringify(newVal) !== JSON.stringify(selectedDeviceIds.value)) {
        selectedDeviceIds.value = [...newVal];
      }
    }
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <NPopover
    trigger="click"
    placement="bottom-start"
    class="device-select-popover"
    width="trigger"
    :show="showPopover"
    :disabled="props.disabled"
    @update:show="handlePopoverUpdateShow"
  >
    <template #trigger>
      <div
        class="select-trigger-wrapper"
        :class="{ 'is-disabled': props.disabled }"
      >
        <NSelect
          :value="selectedDeviceIds"
          :options="selectedOptions"
          value-field="device_id"
          label-field="device_name"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          :show-arrow="true"
          :show="false"
          clearable
          multiple
          class="select-input"
          @update:value="(value) => emit('update:modelValue', value)"
        />
      </div>
    </template>

    <div class="device-select-popover-content">
      <NInfiniteScroll
        class="options-scroll-container"
        :distance="10"
        @load="handleLoadMore"
      >
        <div
          v-if="props.options && props.options.length > 0"
          class="options-list"
        >
          <div
            v-for="option in props.options"
            :key="option.device_id"
            class="device-option-item"
            :class="{ 'is-selected': isSelected(option.device_id) }"
            @click="handleOptionClick(option.device_id)"
          >
            <NCheckbox
              :checked="isSelected(option.device_id)"
              class="option-checkbox"
            />
            <span class="option-label">{{ option.device_name }}</span>
          </div>
        </div>
        <NEmpty
          v-else-if="!props.loading"
          :description="$t('common.noData') || '暂无数据'"
          class="empty-placeholder"
        />

        <NFlex v-if="props.loading" justify="center" class="loading-indicator">
          <NSpin size="small" />
          <span class="loading-text">{{ $t('card.loading') }}</span>
        </NFlex>

        <NFlex
          v-if="
            !props.loading &&
            !props.hasMore &&
            props.options &&
            props.options.length > 0
          "
          justify="center"
          class="no-more-indicator"
        >
          {{ $t('common.noMoreData') || '没有更多了' }}
        </NFlex>
      </NInfiniteScroll>
    </div>
  </NPopover>
</template>

<style scoped lang="scss">
.device-select-popover {
  padding: 0 !important; // Override default popover padding
  // width: 100%;
  // max-width: 400px;
}

.select-trigger-wrapper {
  position: relative;
  width: 100%;
  // No clear icon styles needed anymore
}

.select-input {
  cursor: pointer;
  width: 100%;
}

.device-select-popover-content {
  max-height: 300px;
  overflow-y: auto;
}

.options-scroll-container {
  // max-height: 300px;
}

.options-list {
  // Optional: Styles for the list container if needed
}

.device-option-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(
      --n-option-color-pending,
      #f0f0f0
    ); // Added fallback color
  }

  // &.is-selected { // Selection indicated by checkbox, avoid background change
  //   font-weight: bold;
  // }
}

.option-checkbox {
  margin-right: 8px;
}

.option-label {
  // Optional: Styles for the label text
}

.empty-placeholder {
  padding: 20px 0;
}

.loading-indicator {
  padding: 10px 0;
}

.loading-text {
  margin-left: 8px;
}

.no-more-indicator {
  padding: 10px 0;
  color: #999;
}
</style>
