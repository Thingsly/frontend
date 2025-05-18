<script setup lang="ts">
import { computed, getCurrentInstance, reactive, ref } from 'vue';
import { NButton, useDialog, useMessage } from 'naive-ui';
import { useRoute } from 'vue-router';
import { useTabStore } from '@/store/modules/tab';
import { useRouterPush } from '@/hooks/common/router';
import { deviceConfigDel, deviceConfigEdit } from '@/service/api/device';
import { $t } from '@/locales';

interface Props {
  configInfo?: object | any;
}
const emit = defineEmits(['change']);
const props = withDefaults(defineProps<Props>(), {
  configInfo: null
});
const dialog = useDialog();
const message = useMessage();
const route = useRoute();
const tabStore = useTabStore();
const { routerPush } = useRouterPush();
const deleteConfig = () => {
  dialog.warning({
    title: $t('common.tip'),
    content: $t('common.deleteDeviceConfig'),
    positiveText: $t('device_template.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: async () => {
      const res: any = await deviceConfigDel({ id: props.configInfo.id });

      if (!res || !res.error) {
        message.success($t('custom.grouping_details.operationSuccess'));
        await tabStore.removeTab(route.path);
        await routerPush({ path: '/device/config' });
      }
    }
  });
};
const showModal = ref(false);
const onlinejson = reactive({
  online_timeout: 0,
  heartbeat: 0
});

const onDialogVisble = () => {
  showModal.value = !showModal.value;
};

const onOpenDialogModal = () => {
  onDialogVisble();
  const { online_timeout, heartbeat }: any = JSON.parse(props.configInfo?.other_config || {});
  onlinejson.online_timeout = online_timeout || 0;
  onlinejson.heartbeat = heartbeat || 0;
};

const onSubmit = async () => {
  onDialogVisble();
  const { error }: any = await deviceConfigEdit({
    id: props.configInfo.id,
    other_config: JSON.stringify({
      online_timeout: onlinejson.online_timeout,
      heartbeat: onlinejson.heartbeat
    })
  });
  !error && emit('change');
};
const getPlatform = computed(() => {
  const { proxy }: any = getCurrentInstance();
  return proxy.getPlatform();
});
</script>

<template>
  <div class="flex-col gap-30px p-10px">
    <div class="">
      <div class="m-b-10px">{{ $t('generate.onlineDeviceConfig') }}</div>
      <NButton class="" type="primary" @click="onOpenDialogModal()">{{ $t('generate.configuration') }}</NButton>
    </div>
    <div>
      <div class="m-b-10px color-error-500">{{ $t('generate.delete-device-configuration') }}</div>
      <NButton type="error" @click="deleteConfig">{{ $t('common.delete') }}</NButton>
    </div>

    <n-modal
      v-model:show="showModal"
      preset="dialog"
      :class="getPlatform ? '90%' : 'w-400px'"
      :title="$t('generate.onlineDeviceConfig')"
      :show-icon="false"
    >
      <dl class="m-b-20px flex-col">
        <dt class="m-b-5px font-900">{{ $t('generate.timeoutMinutes') }}</dt>
        <dd class="m-b-10px">
          {{ $t('generate.timeoutThreshold') }}
        </dd>
        <dd class="m-b-20px max-w-220px">
          <n-input-number v-model:value="onlinejson.online_timeout" placeholder=""></n-input-number>
        </dd>
        <dt class="m-b-5px font-900">{{ $t('generate.heartbeatIntervalSeconds') }}</dt>
        <dd class="m-b-10px">{{ $t('generate.heartbeatThreshold') }}</dd>
        <dd class="max-w-220px">
          <n-input-number v-model:value="onlinejson.heartbeat" type="text" placeholder=""></n-input-number>
        </dd>
      </dl>

      <NFlex justify="end">
        <NButton @click="onDialogVisble">{{ $t('generate.cancel') }}</NButton>
        <NButton type="primary" @click="onSubmit">{{ $t('common.save') }}</NButton>
      </NFlex>
    </n-modal>
  </div>
</template>

<style scoped></style>
