<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type {
  FormInst,
  SelectOption,
  FormRules,
  SelectGroupOption
} from 'naive-ui';
import { HelpCircle } from '@vicons/ionicons5';
import { router } from '@/router';
import {
  deviceConfigAdd,
  deviceConfigEdit,
  deviceConfigInfo,
  deviceConfigVoucherType,
  deviceProtocalServiceList,
  deviceTemplate,
  protocolPluginConfigForm
} from '@/service/api/device';
import { $t } from '@/locales';
import FormInput from '../config-detail/modules/form.vue';
import { log } from 'node:console';

const route = useRoute();
const configId = ref(route.query.id || null);
const modalTitle = ref('generate.add');
const configForm = ref<Record<string, any>>(defaultConfigForm());
const isEdit = ref(false);

interface Option {
  name: string;
  id: string | number;
  [key: string]: any;
}

const typeOptions = ref<(SelectOption | SelectGroupOption)[]>([]);
const connectOptions = ref<SelectOption[]>([]);
const protocol_config = ref<Record<string, any>>({});
type FormElementType = 'input' | 'table' | 'select';

// import type { FormItemRule } from 'naive-ui';
// type Validate = FormItemRule | FormItemRule[];

interface FormElement {
  type: FormElementType;
  dataKey: string;
  label: string;
  options?: Option[];
  placeholder?: string;
  // validate?: Validate;
  array?: FormElement[];
}
const formElements = ref<FormElement[]>([]);
interface ConfigFormData {
  id: string | number | null;
  additional_info: string | null;
  description: string | null;
  device_conn_type: string | number | null;
  device_template_id: string | number | '' | null;
  device_type: string | number | null;
  name: string | null;
  protocol_config: Record<string, any> | string | null;
  protocol_type: string | number | null;
  remark: string | null;
  voucher_type: string | number | null;
}

function defaultConfigForm(): ConfigFormData {
  return {
    id: null,
    additional_info: null,
    description: null,
    device_conn_type: null,
    device_template_id: '',
    device_type: null,
    name: null,
    protocol_config: null,
    protocol_type: null,
    remark: null,
    voucher_type: null
  };
}

const configFormRules = ref<FormRules>({
  name: {
    required: true,
    message: $t('common.deviceConfigName'),
    trigger: 'blur'
  },
  device_type: {
    required: true,
    message: $t('common.deviceAccessType'),
    trigger: 'change'
  },
  device_conn_type: {
    required: true,
    message: $t('common.deviceConnectionMethod'),
    trigger: 'change'
  }
});

const queryTemplate = ref({
  page: 1,
  page_size: 20,
  total: 0
});
const deviceTemplateOptions = ref([
  { name: () => $t('generate.unbind'), id: '' }
]);

const getDeviceTemplate = () => {
  deviceTemplate(queryTemplate.value).then((res) => {
    deviceTemplateOptions.value = deviceTemplateOptions.value.concat(
      res.data.list
    );
    queryTemplate.value.total = res.data.total;
  });
};

const deviceTemplateScroll = (e: Event) => {
  const currentTarget = e.currentTarget as HTMLElement;
  if (
    currentTarget.scrollTop + currentTarget.offsetHeight >=
    currentTarget.scrollHeight
  ) {
    if (deviceTemplateOptions.value.length + 1 <= queryTemplate.value.total) {
      queryTemplate.value.page += 1;
      getDeviceTemplate();
    }
  }
};

const configFormRef = ref<FormInst>();

const handleClose = () => {
  configFormRef.value?.restoreValidation();
  configForm.value = defaultConfigForm();
  router.go(-1);
};

const handleSubmit = async () => {
  await configFormRef?.value?.validate();

  const postData: ConfigFormData = {
    ...configForm.value,
    protocol_config: JSON.stringify(protocol_config.value || {}),
    id: configForm.value.id,
    additional_info: configForm.value.additional_info,
    description: configForm.value.description,
    device_conn_type: configForm.value.device_conn_type,
    device_template_id: configForm.value.device_template_id,
    device_type: configForm.value.device_type,
    name: configForm.value.name,
    protocol_type: configForm.value.protocol_type,
    remark: configForm.value.remark,
    voucher_type: configForm.value.voucher_type
  };

  if (!configId.value) {
    const res = await deviceConfigAdd(postData);
    if (!res.error) {
      handleClose();
    }
  } else {
    const res = await deviceConfigEdit(postData);
    if (!res.error) {
      handleClose();
    }
  }
};

const getConfig = async () => {
  const res = await deviceConfigInfo({ id: configId.value });
  configForm.value = { ...res.data };

  protocol_config.value = JSON.parse(res.data.protocol_config);
};

watch(
  () => configId.value,
  async (newId) => {
    if (newId) {
      modalTitle.value = 'common.edit';
    }
  }
);
const getProtocolList = async (deviceCode: string | number) => {
  const queryData = { device_type: deviceCode };
  const res = await deviceProtocalServiceList(queryData);
  if (res.data) {
    typeOptions.value = [
      {
        type: 'group',
        label: $t('common.protocol'),
        key: 'protocol',
        children: (res.data.protocol || []).map((p: any) => ({
          label: p.name,
          value: p.service_identifier
        })) as SelectOption[]
      },
      {
        type: 'group',
        label: $t('common.service'),
        key: 'service',
        children: (res.data.service || []).map((s: any) => ({
          label: s.name,
          value: s.service_identifier
        })) as SelectOption[]
      }
    ];
  }
};

const getConfigForm = async (data) => {
  const res = await protocolPluginConfigForm({
    device_type: configForm?.value?.device_type,
    protocol_type: data
  });
  formElements.value = res.data || [];
};

const getVoucherType = async (data: any) => {
  connectOptions.value = [];
  const res = await deviceConfigVoucherType({
    device_type: configForm?.value?.device_type,
    protocol_type: data
  });
  if (res.data) {
    connectOptions.value = Object.keys(res.data).map((key) => {
      return { label: key, value: res.data[key] } as SelectOption;
    });
  }
};

const choseProtocolType = async (data) => {
  configForm.value.voucher_type = null;
  await getVoucherType(data);
  await getConfigForm(data);
};

const deviceTypes = ref([
  {
    value: '1',
    labelKey: 'generate.direct-connected-device',
    helpKey: 'generate.deviceTypeHelp.direct'
  },
  {
    value: '2',
    labelKey: 'generate.gateway',
    helpKey: 'generate.deviceTypeHelp.gateway'
  },
  {
    value: '3',
    labelKey: 'generate.gateway-sub-device',
    helpKey: 'generate.deviceTypeHelp.subDevice'
  }
]);

onMounted(async () => {
  if (configId.value) {
    modalTitle.value = 'common.edit';
    isEdit.value = true;
    await getConfig();
  } else {
    isEdit.value = false;
    modalTitle.value = 'generate.add';
  }
  getDeviceTemplate();
  console.log(1);

  await getProtocolList(configForm?.value.device_type || '1');

  if (configForm.value.protocol_type) {
    await getVoucherType(configForm.value.protocol_type);
    await getConfigForm(configForm.value.protocol_type);
  }
});

// const getPlatform = computed(() => {
//   const { proxy }: any = getCurrentInstance();
//   return proxy.getPlatform();
// });
</script>

<template>
  <div class="overflow-y-auto">
    <NCard :title="`${$t(modalTitle)} ${$t('custom.devicePage.deviceConfig')}`">
      <NForm
        ref="configFormRef"
        :model="configForm"
        :rules="configFormRules"
        label-placement="left"
        label-width="auto"
      >
        <NFormItem
          :label="$t('generate.device-configuration-name')"
          path="name"
          class="w-[600px]"
        >
          <NInput
            v-model:value="configForm.name"
            :placeholder="$t('generate.enter-device-name')"
          />
        </NFormItem>
        <NFormItem
          class="w-[600px]"
          :label="$t('generate.select-device-function-template')"
          path="device_template_id"
        >
          <NSelect
            v-model:value="configForm.device_template_id"
            :options="deviceTemplateOptions"
            filterable
            label-field="name"
            value-field="id"
            @scroll="deviceTemplateScroll"
          ></NSelect>
        </NFormItem>
        <NFormItem
          :label="$t('generate.device-access-type')"
          path="device_type"
        >
          <n-radio-group
            v-model:value="configForm.device_type"
            name="device_type"
            @update:value="
              (v: string | number) => {
                if (!configForm.value) {
                  console.error(
                    'configForm.value is unexpectedly null/undefined in radio group update'
                  );
                  return;
                }
                protocol_config.value = {};
                configForm.value.voucher_type = null;
                configForm.value.protocol_type = null;
                getProtocolList(v);
              }
            "
          >
            <n-space>
              <div v-for="dtype in deviceTypes" :key="dtype.value" class="flex">
                <n-radio :value="dtype.value" :disabled="isEdit">{{
                  $t(dtype.labelKey)
                }}</n-radio>
                <NTooltip
                  trigger="hover"
                  :content-style="{
                    whiteSpace: 'pre-wrap',
                    textAlign: 'left',
                    maxWidth: '400px'
                  }"
                >
                  <template #trigger>
                    <NIcon class="cursor-help ml-1 mr-4">
                      <HelpCircle class="text-6" />
                    </NIcon>
                  </template>
                  {{ $t(dtype.helpKey) }}
                </NTooltip>
              </div>
            </n-space>
          </n-radio-group>
        </NFormItem>

        <template v-if="configForm.device_type">
          <NFormItem
            class="w-[600px]"
            :label="$t('generate.choose-protocol-or-Service')"
            path="protocol_type"
          >
            <NSelect
              v-model:value="configForm.protocol_type"
              :options="typeOptions"
              :placeholder="$t('generate.select-protocol-service')"
              @update:value="choseProtocolType"
            ></NSelect>
          </NFormItem>

          <NFormItem
            v-show="configForm.device_type === '2'"
            class="w-[600px]"
            :label="$t('generate.authentication-type')"
            path="voucher_type"
          >
            <NSelect
              v-model:value="configForm.voucher_type"
              :options="connectOptions"
              :placeholder="$t('generate.select-authentication-type')"
            ></NSelect>
          </NFormItem>
        </template>
        <NFormItem v-if="configForm.device_type === '3'">
          <FormInput
            v-model:protocol-config="protocol_config"
            :form-elements="formElements"
          ></FormInput>
        </NFormItem>
        <NFlex justify="flex-start">
          <NButton type="primary" @click="handleSubmit">{{
            $t('page.login.common.confirm')
          }}</NButton>
        </NFlex>
      </NForm>
    </NCard>
  </div>
</template>

<style lang="scss" scoped>
.w-600 {
  width: 600px;
}
// Add style for cursor
.cursor-help {
  cursor: help;
}
</style>
