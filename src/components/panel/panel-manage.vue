<script lang="tsx" setup>
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useDialog, useMessage } from 'naive-ui';
import { useFullscreen } from '@vueuse/core';
import { debounce } from 'lodash';
// eslint-disable-next-line vue/prefer-import-from-vue
import type { UnwrapRefSimple } from '@vue/reactivity';
import type { ICardData, ICardFormIns, ICardRender, ICardView } from '@/components/panel/card';
import { PutBoard, deviceTemplateSelect, getBoard } from '@/service/api';
import { localStg } from '@/utils/storage';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import { useWebsocketUtil } from '@/utils/websocketUtil';
import { createLogger } from '@/utils/logger';
const logger = createLogger('PanelManage');

const NO_THEME = '--no--theme--';
const dialog = useDialog();
const message = useMessage();

const props = defineProps<{ panelId: string }>();
const panelDate = ref<Panel.Board>();
const cr = ref<ICardRender>();
const fullui = ref();

const showingCardList = ref(false);
const isEditing = ref(false);
const editingCard = ref(false);
const isSaving = ref(false);
const deviceOptions = ref<UnwrapRefSimple<any>[]>();

const getDeviceOptions = async () => {
  const { data, error } = await deviceTemplateSelect();
  if (!error) {
    deviceOptions.value = data;
  }
};

const { isFullscreen, toggle } = useFullscreen(fullui);
const appStore = useAppStore();
const dataFetched = ref(false);
const layout = ref<ICardView[]>([]);
const theme = ref(NO_THEME);
const preTheme = ref(NO_THEME);
const preLayout = ref<ICardView[]>([]);
const fetchBroad = async () => {
  const { data } = await getBoard(props.panelId);
  if (data) {
    panelDate.value = data;
    if (data.config) {
      const configJson = JSON.parse(data.config);
      // check configJson is an array
      if (Array.isArray(configJson)) {
        updateConfigData(configJson);
        layout.value = configJson;
        preLayout.value = layout.value;
      } else if (typeof configJson === 'object') {
        if (configJson.layout) {
          updateConfigData(configJson.layout);
          layout.value = configJson.layout;
          preLayout.value = layout.value;
        }
        if (configJson.theme) {
          theme.value = configJson.theme;
          preTheme.value = theme.value;
        }
      }
      dataFetched.value = true;
    }
  }
};

/**
 * Todo: Once all config data in server are updated to use unique number as "i" attribute, we can remove this function.
 * Convert a string to a unique number.
 *
 * @param str
 * @returns
 */
function stringToUniqueNumber(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = hash * 31 + str.charCodeAt(i);
  }
  return hash;
}

/**
 * Todo: Once all config data in server are updated to use unique number as "i" attribute, we can remove this function.
 * The attribute "i" of each config data may be a string instead of a number, so we need to convert it to a unique
 * number to avoid Vue's warning.
 *
 * @param configJson
 */
function updateConfigData(configJson: ICardView[]) {
  for (const item of configJson) {
    if (typeof item.i === 'string') {
      item.i = stringToUniqueNumber(item.i);
    }
  }
}

const state = reactive({
  cardData: null as null | ICardData
});

const editView = ref<ICardView | null>();
const formRef = ref<ICardFormIns>();

const toEditMode = () => {
  isEditing.value = true;
};

const quitEditMode = () => {
  if (JSON.stringify(layout.value) !== JSON.stringify(preLayout.value) || preTheme.value !== theme.value) {
    dialog.warning({
      title: $t('card.quitWithoutSave'),
      positiveText: $t('device_template.confirm'),
      negativeText: $t('common.cancel'),
      onPositiveClick: () => {
        isEditing.value = false;
        layout.value = preLayout.value;
        theme.value = preTheme.value;
      }
    });
  } else {
    isEditing.value = false;
  }
};

const token = localStg.get('token');
const { updateComponentsData, closeAllSockets } = useWebsocketUtil(cr, token as string);

const throttledWatcher = debounce(() => {
  updateComponentsData(layout);
}, 300);

const insertCard = (card: ICardData) => {
  cr.value?.addCard(card);
  editView.value = null;
  state.cardData = null;
  toEditMode();
};

const updateCard = (card: ICardData) => {
  if (editView.value) {
    editView.value.data = card;
    throttledWatcher();
  }
};

const updateLayoutData = (data: ICardView[]) => {
  nextTick(() => {
    layout.value = data;
  });
};

const breakpointChanged = (_newBreakpoint: any, newLayout: any) => {
  setTimeout(() => {
    layout.value = newLayout;
  }, 300);
};

const edit = (view: ICardView) => {
  editingCard.value = true;

  editView.value = view;
  state.cardData = view.data || null;

  nextTick(() => {
    formRef.value?.setCard(state.cardData as any);
  });
};
const showCardList = () => {
  showingCardList.value = true;
};

const savePanel = async () => {
  try {
    isSaving.value = true;
    let resultStr = '';
    if (theme.value !== NO_THEME) {
      resultStr = JSON.stringify({
        layout: layout.value,
        theme: theme.value
      });
    } else {
      resultStr = JSON.stringify(layout.value);
    }

    await PutBoard({
      id: props.panelId,
      config: resultStr,
      name: panelDate.value?.name,
      home_flag: panelDate.value?.home_flag
    });

    preLayout.value = layout.value;
    preTheme.value = theme.value;
    message.success($t('generate.saveSuccess') || 'Dashboard saved successfully');

    // Add a small delay to show the loading effect
    setTimeout(() => {
      isSaving.value = false;
    }, 800);
  } catch (error) {
    console.error('Save panel error:', error);
    message.error($t('generate.saveFail') || 'Failed to save dashboard');
    isSaving.value = false;
  }
};

watch(
  () => layout,
  newLayout => {
    logger.info(newLayout);
    throttledWatcher();
  },
  { deep: true }
);

onMounted(() => {
  fetchBroad();
  getDeviceOptions();
});

onUnmounted(() => {
  closeAllSockets();
});
</script>

<template>
  <div class="w-full px-5 py-5">
    <div
      v-show="!appStore.fullContent"
      class="flex items-center justify-between border-b border-gray-200 px-10px pb-3 dark:border-gray-200/10"
    >
      <div>
        <!--
        <<NButton @click="router.go(-1)">
          <SvgIcon icon="ep:back" class="mr-0.5 text-lg" />
          {{ $t('page.login.common.back') }}
        </NButton>
-->
        <NSpace align="center">
          <span class="text-14px font-medium line-height-normal">
            {{ $t('card.dashboard') }}：{{ panelDate?.name }}
          </span>
          <NButton v-show="isEditing" @mouseover="showCardList">
            <SvgIcon icon="material-symbols:add" class="mr-0.5 text-lg" />
            {{ $t('generate.add-component') }}
          </NButton>
        </NSpace>
      </div>
      <NSpace align="center">
        <!--        <NButton>-->
        <!--          <SvgIcon icon="material-symbols:settings-outline" class="mr-0.5 text-lg" />-->
        <!--        </NButton>-->
        <NDivider vertical />
        <NButton v-if="!isEditing" @click="toEditMode">
          <SvgIcon icon="material-symbols:edit" class="mr-0.5 text-lg" />
          {{ $t('generate.edit') }}
        </NButton>
        <NSelect
          v-if="isEditing"
          v-model:value="theme"
          :consistent-menu-width="false"
          :options="[
            { label: $t('card.minimalistWhiteTheme'), value: NO_THEME },
            { label: $t('card.techBlueTheme'), value: 'theme-tech-blue' },
            { label: $t('card.applePurpleTheme'), value: 'theme-royal-purple' },
            { label: $t('card.msStyleTheme'), value: 'theme-microsoft-style' },
            { label: $t('card.blackTheme'), value: 'theme-cool-black' }
          ]"
        ></NSelect>
        <NButton v-if="isEditing" @click="quitEditMode">{{ $t('card.quitEdit') }}</NButton>
        <NButton v-show="isEditing" :loading="isSaving" :disabled="isSaving" @click="savePanel">
          {{ isSaving ? $t('generate.saving') || 'Saving...' : $t('common.save') }}
        </NButton>
        <FullScreen
          :full="isFullscreen"
          @click="
            () => {
              toggle();
            }
          "
        />
      </NSpace>
    </div>
    <div ref="fullui" class="h-edit-area flex bg-white">
      <n-drawer
        v-model:show="showingCardList"
        :width="300"
        placement="left"
        :show-mask="false"
        style="box-shadow: 0 8px 16px 0 rgba(156, 107, 255, 0.4)"
      >
        <n-drawer-content :title="$t('card.cardList')" class="shadow-sm" closable>
          <CardSelector v-if="showingCardList" class="h-full w-full overflow-auto" @select-card="insertCard" />
        </n-drawer-content>
      </n-drawer>

      <div class="h-full flex-1 overflow-auto">
        <div
          v-if="!layout.length"
          class="h-full flex items-center justify-center text-center text-gray-500 dark:text-gray-400"
        >
          <NEmpty :description="$t('common.componentsAddedYet')"></NEmpty>
        </div>
        <CardRender
          v-if="dataFetched"
          ref="cr"
          :layout="layout"
          :is-preview="!isEditing"
          :col-num="12"
          :default-card-col="4"
          :row-height="85"
          :theme="theme"
          @edit="edit"
          @update:layout="updateLayoutData"
          @breakpoint-changed="breakpointChanged"
        />
      </div>

      <n-drawer
        v-model:show="editingCard"
        :width="500"
        placement="right"
        :show-mask="false"
        style="box-shadow: 0 8px 16px 0 rgba(156, 107, 255, 0.4)"
      >
        <n-drawer-content :title="$t('card.cardConfig')" class="shadow-sm" closable>
          <CardForm
            ref="formRef"
            class="h-full w-full overflow-auto"
            :device-web-chart-config="[]"
            @update="(data: any) => updateCard(data)"
          />
        </n-drawer-content>
      </n-drawer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel {
  @apply border border-transparent;
}
.h-content {
  height: calc(100% - 48px);
}
.h-edit-area {
  height: calc(100% - 30px);
}
</style>
