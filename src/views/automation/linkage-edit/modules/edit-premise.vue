<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { NButton, NFlex, useMessage } from 'naive-ui';
import type { FormInst } from 'naive-ui';
// import { IosAlert, IosRefresh } from '@vicons/ionicons4';
import { repeat } from 'seemly';
import { deviceGroupTree } from '@/service/api';
import {
  configMetricsConditionMenu,
  deviceConfigAll,
  deviceListAll,
  deviceMetricsConditionMenu
} from '@/service/api/automation';
import { $t } from '@/locales';

interface Emits {
  (e: 'conditionChose', data: any): void;
}

const route = useRoute();
const emit = defineEmits<Emits>();

const premiseFormRef = ref<FormInst | null>(null);
const premiseForm = ref({
  ifGroups: [] as any
});

const premiseFormRules = ref({
  ifType: {
    required: true,
    message: $t('common.select'),
    trigger: 'change'
  },
  trigger_conditions_type: {
    required: true,
    message: $t('common.select'),
    trigger: 'change'
  },
  trigger_source: {
    required: true,
    message: $t('common.select'),
    trigger: 'change'
  },
  trigger_param: {
    required: true,
    message: $t('common.select'),
    trigger: 'change'
  },
  trigger_operator: {
    required: true,
    message: $t('common.select'),
    trigger: 'change'
  },
  trigger_value: {
    required: true,
    message: $t('common.input'),
    trigger: 'blur'
  },
  minValue: {
    required: true,
    message: $t('common.input'),
    trigger: 'blur'
  },
  maxValue: {
    required: true,
    message: $t('common.input'),
    trigger: 'blur'
  },
  onceTimeValue: {
    required: true,
    message: $t('common.select')
  },
  expiration_time: {
    required: true,
    message: $t('common.select')
  },
  task_type: {
    required: true,
    message: $t('common.select'),
    trigger: 'change'
  },
  hourTimeValue: {
    required: true,
    message: $t('common.select')
  },
  dayTimeValue: {
    required: true,
    message: $t('common.select')
  },
  weekChoseValue: {
    required: true,
    message: $t('common.select')
  },
  weekTimeValue: {
    required: true,
    message: $t('common.select')
  },
  monthChoseValue: {
    required: true,
    message: $t('common.select')
  },
  monthTimeValue: {
    required: true,
    message: $t('common.select')
  },
  startTimeValue: {
    required: true,
    message: $t('common.select')
  },
  endTimeValue: {
    required: true,
    message: $t('common.select')
  },
  weatherValue: {
    required: true,
    message: $t('common.select'),
    trigger: 'change'
  }
});

// const ifTypeOptions = ref([
//   {
//     label: $t('common.deviceConditions'),
//     value: '1'
//   },
//   {
//     label: $t('common.timeConditions'),
//     value: '2'
//   }
//   // {
//   //   label: '服务条件',
//   //   value: '3'
//   // }
// ]);

const getIfTypeOptions = (ifGroup, ifIndex) => {
  return [
    {
      label: $t('common.deviceConditions'),
      value: '1',
      disabled: ifGroup.some((item) => {
        return (
          (item.trigger_conditions_type === '20' ||
            item.trigger_conditions_type === '21') &&
          ifIndex > 0
        );
      })
    },
    {
      label: $t('common.timeConditions'),
      value: '2'
    }
  ];
};
const ifTypeChange = (ifItem: any, data: any) => {
  ifItem.trigger_conditions_type = null;
  // eslint-disable-next-line no-param-reassign,@typescript-eslint/no-use-before-define
  ifItem = judgeItem.value;
  ifItem.ifType = data;
};

const deviceConditionOptions = ref([
  {
    label: $t('common.singleDevice'),
    value: '10'
  },
  {
    label: $t('common.singleClassDevice'),
    value: '11'
  }
]);
const deviceConfigDisabled = ref(false);
const triggerConditionsTypeChange = (ifItem: any, data: any) => {
  ifItem.trigger_source = null;
  ifItem.trigger_param_type = null;
  ifItem.trigger_param = null;
  ifItem.trigger_param_key = null;
  ifItem.trigger_operator = null;
  ifItem.trigger_value = null;
  ifItem.minValue = null;
  ifItem.maxValue = null;
  deviceConfigDisabled.value = false;

  if (data === '11') {
    deviceConfigDisabled.value = true;
  }
  emit('conditionChose', data);
};

const deviceGroupOptions = ref([] as any);

const getGroup = async () => {
  deviceGroupOptions.value = [];
  const res = await deviceGroupTree({});
  // eslint-disable-next-line array-callback-return
  res.data.map((item: any) => {
    deviceGroupOptions.value.push(item.group);
  });
};

const deviceOptions = ref([] as any);
const queryDevice = ref({
  group_id: null as any,
  device_name: null as any,
  bind_config: 0
});
const btnloading = ref(false);

const selectInstRef = ref({});
const onKeydownEnter = (e) => {
  // selectInstRef.value = true;
  e.preventDefault();

  return false;
};
const onDeviceKeydownEnter = (e: any, ifIndex: number) => {
  selectInstRef.value[ifIndex] = true;
  e.preventDefault();
  return false;
};

const getDevice = async (groupId: any, name: any) => {
  queryDevice.value.group_id = groupId || null;
  queryDevice.value.device_name = name || null;
  btnloading.value = false;
  deviceOptions.value = [];
  const res = await deviceListAll(queryDevice.value);
  btnloading.value = true;
  deviceOptions.value = res.data || [];
  // if (!deviceOptions.value.length) {
  //   selectInstRef.value = false;
  // }
};

const triggerSourceChange = (ifItem: any, ifIndex: number) => {
  ifItem.trigger_param_type = null;
  ifItem.trigger_param = null;
  ifItem.trigger_param_key = null;
  ifItem.trigger_operator = null;
  ifItem.trigger_value = null;
  ifItem.minValue = null;
  ifItem.maxValue = null;
  selectInstRef.value[ifIndex] = false;
  // ifItem.action_param_type = null;
  // ifItem.action_param = null;
  // ifItem.action_value = null;
};

// const testFocus = () => {
//   setTimeout(() => {
//     queryDeviceName.value[0].focus();
//   }, 100);
// };

const queryDeviceName = ref([] as any);
const handleFocus = (ifIndex: any) => {
  queryDeviceName.value[ifIndex].focus();
};

const deviceConfigOption = ref([]);

const queryDeviceConfig = ref({
  device_config_name: ''
});

const getDeviceConfig = async (name: string) => {
  queryDeviceConfig.value.device_config_name = name || '';
  const res = await deviceConfigAll(queryDeviceConfig.value);
  deviceConfigOption.value = res.data || [];
};

const actionParamShow = async (ifItem: any, data: any) => {
  if (data === true && ifItem.trigger_source) {
    ifItem.triggerParamOptions = [];
    let res = null as any;
    if (ifItem.trigger_conditions_type === '10') {
      res = await deviceMetricsConditionMenu({
        device_id: ifItem.trigger_source
      });
    } else if (ifItem.trigger_conditions_type === '11') {
      res = await configMetricsConditionMenu({
        device_config_id: ifItem.trigger_source
      });
    }
    // eslint-disable-next-line array-callback-return
    if (res.data) {
      // eslint-disable-next-line array-callback-return
      res.data.map((item: any) => {
        item.value = item.data_source_type;
        item.label = `${item.data_source_type}${item.label ? `(${item.label})` : ''}`;

        // eslint-disable-next-line array-callback-return
        item.options.map((subItem: any) => {
          subItem.value = `${item.value}/${subItem.key}`;
          subItem.label = `${subItem.key}${subItem.label ? `(${subItem.label})` : ''}`;
        });
      });
      // eslint-disable-next-line require-atomic-updates
      ifItem.triggerParamOptions = res.data;
    }
    const statusData = {
      value: 'status',
      label: 'status',
      options: [
        {
          value: 'On-line',
          label: 'On-line',
          key: 'On-line'
        },
        {
          value: 'Off-line',
          label: 'Off-line',
          key: 'Off-line'
        },
        {
          value: 'All',
          label: 'All',
          key: 'All'
        }
      ]
    };
    ifItem.triggerParamOptions.push(statusData);
  }
};
const message = useMessage();

const actionValueChange = (ifItem: any) => {
  if (ifItem.trigger_param_type === 'event') {
    try {
      JSON.parse(ifItem.trigger_value);
      if (typeof JSON.parse(ifItem.trigger_value) === 'object') {
        ifItem.inputFeedback = '';
        ifItem.inputValidationStatus = undefined;
      } else {
        message.error($t('common.enterJson'));
        ifItem.inputValidationStatus = 'error';
      }
    } catch (e) {
      message.error($t('common.enterJson'));
      ifItem.inputValidationStatus = 'error';
    }
  }
};

const getTimeConditionOptions = (ifGroup) => {
  return [
    {
      label: $t('common.single'),
      value: '20',
      disabled: ifGroup.some((item) => item.ifType === '1')
    },
    {
      label: $t('common.repeat'),

      value: '21',
      disabled: ifGroup.some((item) => item.ifType === '1')
    },
    {
      label: $t('common.timeFrame'),
      value: '22'
    }
  ];
};
// const timeConditionOptions = ref([
//   {
//     label: $t('common.single'),
//     value: '20'
//   },
//   {
//     label: $t('common.repeat'),
//     value: '21'
//   },
//   {
//     label: $t('common.timeFrame'),
//     value: '22'
//   }
// ]);

const serviceConditionOptions = ref([
  {
    label: $t('common.weather'),
    value: 'weather'
  }
]);

// const deviceOptions = ref([]);

const cycleOptions = ref([
  {
    label: $t('common.everyHour'),
    value: 'HOUR'
  },
  {
    label: $t('common.everyDay'),
    value: 'DAY'
  },
  {
    label: $t('common.weekly'),
    value: 'WEEK'
  },
  {
    label: $t('common.monthly'),
    value: 'MONTH'
  }
]);

const weekOptions = ref([
  {
    label: $t('page.irrigation.time.week.monday'),
    value: '1'
  },
  {
    label: $t('page.irrigation.time.week.tuesday'),
    value: '2'
  },
  {
    label: $t('page.irrigation.time.week.wednesday'),
    value: '3'
  },
  {
    label: $t('page.irrigation.time.week.thursday'),
    value: '4'
  },
  {
    label: $t('page.irrigation.time.week.friday'),
    value: '5'
  },
  {
    label: $t('page.irrigation.time.week.saturday'),
    value: '6'
  },
  {
    label: $t('page.irrigation.time.week.sunday'),
    value: '7'
  }
]);

const weatherOptions = ref([
  {
    label: $t('common.sunrise'),
    value: 'sunrise'
  },
  {
    label: $t('common.sunset'),
    value: 'sunset'
  }
]);

const determineOptions = ref([
  {
    label: $t('common.equal'),
    value: '='
  },
  {
    label: $t('common.unequal'),
    value: '!='
  },
  {
    label: $t('common.pass'),
    value: '>'
  },
  {
    label: $t('common.under'),
    value: '<'
  },
  {
    label: $t('common.greaterOrEqual'),
    value: '>='
  },
  {
    label: $t('common.lessOrEqual'),
    value: '<='
  },
  {
    label: $t('common.between'),
    value: 'between'
  },
  {
    label: $t('common.includeList'),
    value: 'in'
  }
]);

const expirationTimeOptions = ref([
  {
    label: $t('common.minutes5'),
    value: 5
  },
  {
    label: $t('common.minutes10'),
    value: 10
  },
  {
    label: $t('common.minutes30'),
    value: 30
  },
  {
    label: $t('common.hours1'),
    value: 60
  },
  {
    label: $t('common.days1'),
    value: 1440
  }
]);

const mouthRangeOptions = repeat(31, undefined).map((_, i) => ({
  label: String(i + 1),
  value: i + 1
}));
const judgeItem = ref({
  ifType: null,
  trigger_conditions_type: null,
  trigger_source: null,
  trigger_param_type: null,
  trigger_param: null,
  trigger_param_key: null,
  trigger_operator: null,
  trigger_value: null,
  task_type: null,
  params: null,
  execution_time: null,
  expiration_time: null,
  timeValue: null,
  onceTimeValue: null,
  hourTimeValue: null,
  dayTimeValue: null,
  weekTimeValue: null,
  monthTimeValue: null,

  // eslint-disable-next-line no-bitwise
  weekChoseValue: [],
  monthChoseValue: null,

  startTimeValue: null,
  endTimeValue: null,
  minValue: null,
  maxValue: null,
  weatherValue: null,
  deviceGroupId: null,
  triggerParamOptions: []
});
// interface JudgeItem {
//   ifType: string;
//   trigger_conditions_type: string;
//   trigger_source: string;
//   trigger_param_type: string;
//   trigger_param: string;
//   trigger_operator: string;
//   trigger_value: string;
//   onceTimeValue: string;
//   execution_time: string;
//   expiration_time: string;
//
//   timeValue: string;
//   task_type: string;
//   params: string;
//   hourTimeValue: number;
//   dayTimeValue: number;
//   weekTimeValue: number;
//   monthTimeValue: number;
//   weekChoseValue: (string | number)[] | null | undefined;
//   monthChoseValue: string;
//   startTimeValue: number;
//   endTimeValue: number;
//   minValue: string;
//   maxValue: string;
//   weatherValue: string;
//   deviceGroupId: string;
//   triggerParamOptions: object | any;
// }

// const ifGroups = ref([] as any);

const addIfGroupsSubItem = async (ifGroupIndex: any) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await premiseFormRef.value?.validate();
  premiseForm.value.ifGroups[ifGroupIndex].push(
    JSON.parse(JSON.stringify(judgeItem.value))
  );
};

const deleteIfGroupsSubItem = (ifGroupIndex: any, ifIndex: any) => {
  premiseForm.value.ifGroups[ifGroupIndex].splice(ifIndex, 1);
};

const deleteIfGroupsItem = (ifIndex: any) => {
  premiseForm.value.ifGroups.splice(ifIndex, 1);
};

const addIfGroupItem = (data: any) => {
  // await premiseFormRef.value?.validate();
  const groupObj: any = [];
  if (!data) {
    groupObj.push(JSON.parse(JSON.stringify(judgeItem.value)));
    premiseForm.value.ifGroups.push(groupObj);
  } else {
    groupObj.push(data);
    premiseForm.value.ifGroups.push(groupObj);
  }
};

const ifGroupsData = () => {
  return premiseForm.value.ifGroups;
};
const premiseFormRefReturn = () => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return premiseFormRef.value;
};

defineExpose({
  ifGroupsData,
  premiseFormRefReturn
});

const triggerParamChange = (ifItem: any, data: any) => {
  ifItem.trigger_param_type = data[0].value;
  ifItem.trigger_param = data[1].key;
};

interface Props {
  // eslint-disable-next-line vue/no-unused-properties
  conditionData?: object | any;
  // eslint-disable-next-line vue/no-unused-properties,vue/prop-name-casing
  device_id?: string | any;
  // eslint-disable-next-line vue/no-unused-properties,vue/prop-name-casing
  device_config_id?: string | any;
}

const props = withDefaults(defineProps<Props>(), {
  // eslint-disable-next-line vue/require-valid-default-prop
  conditionData: [],
  device_id: '',
  device_config_id: ''
});

const onTapInput = (item: any, ifIndex: number) => {
  if (item.group_id || item.device_name) {
    getDevice(item.group_id, item.device_name);
  } else {
    selectInstRef.value[ifIndex] = true;
  }
};

watch(
  () => props.conditionData,
  (newValue) => {
    if (newValue) {
      premiseForm.value.ifGroups = props.conditionData;
    }
  }
);
const configId = ref(route.query.id || null);
onMounted(() => {
  getGroup();
  getDevice(null, null);
  getDeviceConfig('');
  if (!configId.value) {
    const judgeItemData = JSON.parse(JSON.stringify(judgeItem.value));
    if (props.device_id) {
      judgeItemData.ifType = '1';
      judgeItemData.trigger_conditions_type = '10';
      judgeItemData.trigger_source = props.device_id;
      // eslint-disable-next-line array-callback-return
    } else if (props.device_config_id) {
      judgeItemData.ifType = '1';
      judgeItemData.trigger_conditions_type = '11';
      judgeItemData.trigger_source = props.device_config_id;
      deviceConfigDisabled.value = true;
    }
    emit('conditionChose', judgeItemData.trigger_conditions_type);
    addIfGroupItem(judgeItemData);
  }
});

watch(
  premiseForm.value.ifGroups,
  () => {
    // selectInstRef.value = false;
  },
  { deep: true }
);
</script>

<template>
  <NFlex vertical class="mt-1 w-100%">
    <NForm
      ref="premiseFormRef"
      :model="premiseForm"
      :rules="premiseFormRules"
      :submit-on-enter="false"
      label-placement="left"
      size="small"
      :show-feedback="false"
      @keydown.enter="onKeydownEnter"
    >
      {{ $t('generate.condition-trigger') }}
      <NFlex
        v-for="(ifGroupItem, ifGroupIndex) in premiseForm.ifGroups"
        :key="ifGroupIndex"
        class="w-100%"
      >
        <NCard class="mb-2 w-[calc(100%-78px)]">
          <NFlex
            v-for="(ifItem, ifIndex) in ifGroupItem"
            :key="ifIndex"
            class="ifGroupItem-class mb-2 w-100%"
          >
            <NFlex class="flex-1" align="center">
              <NTag
                v-if="ifIndex !== 0"
                type="success"
                class="tag-class"
                size="small"
                >{{ $t('generate.and') }}</NTag
              >

              <NFormItem
                :show-label="false"
                :path="`ifGroups[${ifGroupIndex}][${ifIndex}].ifType`"
                :rule="premiseFormRules.ifType"
                class="ml-10 max-w-50 w-full"
              >
                <NSelect
                  v-model:value="ifItem.ifType"
                  :options="getIfTypeOptions(ifGroupItem, ifIndex)"
                  :placeholder="$t('common.select')"
                  @update-value="(data) => ifTypeChange(ifItem, data)"
                />
              </NFormItem>
              <NFlex v-if="ifItem.ifType === '1'" class="flex-1">
                <NFormItem
                  :show-label="false"
                  :path="`ifGroups[${ifGroupIndex}][${ifIndex}].trigger_conditions_type`"
                  :rule="premiseFormRules.trigger_conditions_type"
                  class="max-w-50 w-full"
                >
                  <NSelect
                    v-model:value="ifItem.trigger_conditions_type"
                    :options="deviceConditionOptions"
                    :placeholder="$t('common.select')"
                    clearable
                    @update:value="
                      (data) => triggerConditionsTypeChange(ifItem, data)
                    "
                  />
                </NFormItem>
                <template v-if="ifItem.trigger_conditions_type === '10'">
                  <NFormItem
                    :show-label="false"
                    :path="`ifGroups[${ifGroupIndex}][${ifIndex}].trigger_source`"
                    :rule="premiseFormRules.trigger_source"
                    class="max-w-50 w-full"
                  >
                    <NSelect
                      v-model:value="ifItem.trigger_source"
                      :options="deviceOptions"
                      value-field="id"
                      label-field="name"
                      clearable
                      :consistent-menu-width="false"
                      @click.prevent="
                        (e) => {
                          onDeviceKeydownEnter(e, ifIndex);
                        }
                      "
                      @keydown.enter="
                        (e) => {
                          onDeviceKeydownEnter(e, ifIndex);
                        }
                      "
                      @update:value="() => triggerSourceChange(ifItem, ifIndex)"
                    >
                      <template #header>
                        <NFlex align="center" class="w-500px">
                          {{ $t('generate.group') }}
                          <NSelect
                            v-model:value="queryDevice.group_id"
                            :options="deviceGroupOptions"
                            label-field="name"
                            value-field="id"
                            class="max-w-40"
                            clearable
                            :placeholder="$t('common.select')"
                            @keydown.enter="onKeydownEnter"
                            @update:value="
                              (data) => getDevice(data, queryDevice.device_name)
                            "
                          />
                          <NInput
                            ref="queryDeviceName[ifIndex]"
                            v-model:value="queryDevice.device_name"
                            class="flex-1"
                            clearable
                            :placeholder="$t('common.input')"
                            @keydown.enter="onTapInput(queryDevice, ifIndex)"
                            @click="handleFocus(ifIndex)"
                          ></NInput>
                          <NButton
                            :disabled="!btnloading"
                            type="primary"
                            @click.stop="
                              getDevice(
                                queryDevice.group_id,
                                queryDevice.device_name
                              )
                            "
                          >
                            {{ $t('common.search') }}
                          </NButton>
                        </NFlex>
                      </template>
                    </NSelect>
                  </NFormItem>
                </template>
                <template v-if="ifItem.trigger_conditions_type === '11'">
                  <NFormItem
                    :show-label="false"
                    :path="`ifGroups[${ifGroupIndex}][${ifIndex}].trigger_source`"
                    :rule="premiseFormRules.trigger_source"
                    class="max-w-30 w-full"
                  >
                    <NSelect
                      v-model:value="ifItem.trigger_source"
                      :options="deviceConfigOption"
                      label-field="name"
                      value-field="id"
                      :placeholder="$t('common.select')"
                      remote
                      filterable
                      @search="getDeviceConfig"
                      @update:value="() => triggerSourceChange(ifItem, ifIndex)"
                    />
                  </NFormItem>
                </template>
                <template v-if="ifItem.trigger_source">
                  <NFormItem
                    :show-label="false"
                    :path="`ifGroups[${ifGroupIndex}][${ifIndex}].trigger_param`"
                    :rule="premiseFormRules.trigger_param"
                    class="max-w-50 w-full"
                  >
                    <NCascader
                      v-model:value="ifItem.trigger_param_key"
                      :placeholder="$t('common.select')"
                      :options="ifItem.triggerParamOptions"
                      check-strategy="child"
                      children-field="options"
                      size="small"
                      @update:show="(data) => actionParamShow(ifItem, data)"
                      @update:value="
                        (value, option, pathValues) =>
                          triggerParamChange(ifItem, pathValues)
                      "
                    />
                  </NFormItem>
                  <template
                    v-if="
                      ifItem.trigger_param_type === 'telemetry' ||
                      ifItem.trigger_param_type === 'attributes'
                    "
                  >
                    <NFormItem
                      :show-label="false"
                      :path="`ifGroups[${ifGroupIndex}][${ifIndex}].trigger_operator`"
                      :rule="premiseFormRules.trigger_operator"
                      class="max-w-50 w-full"
                    >
                      <NSelect
                        v-model:value="ifItem.trigger_operator"
                        :options="determineOptions"
                      />
                    </NFormItem>
                    <template v-if="ifItem.trigger_operator === 'in'">
                      <NFormItem
                        :show-label="false"
                        :path="`ifGroups[${ifGroupIndex}][${ifIndex}].trigger_value`"
                        :rule="premiseFormRules.trigger_value"
                        class="max-w-50 w-full"
                      >
                        <NInput
                          v-model:value="ifItem.trigger_value"
                          :placeholder="$t('generate.separated-by-commas')"
                        />
                      </NFormItem>
                    </template>
                    <template v-else-if="ifItem.trigger_operator == 'between'">
                      <NFormItem
                        :show-label="false"
                        :path="`ifGroups[${ifGroupIndex}][${ifIndex}].minValue`"
                        :rule="premiseFormRules.minValue"
                        class="max-w-50 w-full"
                      >
                        <NInput
                          v-model:value="ifItem.minValue"
                          :placeholder="$t('generate.min-value')"
                        />
                      </NFormItem>
                      <NFormItem
                        :show-label="false"
                        :path="`ifGroups[${ifGroupIndex}][${ifIndex}].maxValue`"
                        :rule="premiseFormRules.maxValue"
                        class="max-w-40 w-full"
                      >
                        <NInput
                          v-model:value="ifItem.maxValue"
                          :placeholder="$t('generate.max-value')"
                        />
                      </NFormItem>
                    </template>
                    <template v-else>
                      <NFormItem
                        :show-label="false"
                        :path="`ifGroups[${ifGroupIndex}][${ifIndex}].trigger_value`"
                        :rule="premiseFormRules.trigger_value"
                        class="max-w-40 w-full"
                      >
                        <NInput
                          v-model:value="ifItem.trigger_value"
                          :placeholder="$t('generate.value')"
                        />
                      </NFormItem>
                    </template>
                  </template>
                  <!-- <template v-if="ifItem.trigger_param_type === 'attributes'">
                    <NFormItem
                      :show-label="false"
                      :path="`ifGroups[${ifGroupIndex}][${ifIndex}].trigger_value`"
                      :rule="premiseFormRules.trigger_value"
                                       class="max-w-40 w-full"
                                     >
                                       <NInput
                                         v-model:value="ifItem.trigger_value"
                                         :placeholder="$t('common.param') + '，' + $t('common.as') + '：{param1:1}'"
                                         @blur="actionValueChange(ifItem)"
                                       />
                                     </NFormItem>
                                   </template> -->
                  <template v-if="ifItem.trigger_param_type === 'event'">
                    <NFormItem
                      :show-label="false"
                      :path="`ifGroups[${ifGroupIndex}][${ifIndex}].trigger_value`"
                      :rule="premiseFormRules.trigger_value"
                      :validation-status="ifItem.inputValidationStatus"
                      :feedback="ifItem.inputFeedback"
                      class="max-w-40 w-full"
                    >
                      <NInput
                        v-model:value="ifItem.trigger_value"
                        :placeholder="`${$t('common.param')},${$t('common.as')}:{&quot;param1&quot;:1}`"
                        @blur="actionValueChange(ifItem)"
                      />
                    </NFormItem>
                  </template>
                  <template v-if="ifItem.trigger_param_type === 'status'">
                  </template>
                </template>
              </NFlex>
              <NFlex v-if="ifItem.ifType === '2'" class="flex-1">
                <NFormItem
                  :show-label="false"
                  :path="`ifGroups[${ifGroupIndex}][${ifIndex}].trigger_conditions_type`"
                  :rule="premiseFormRules.trigger_conditions_type"
                  class="max-w-35 w-full"
                >
                  <NSelect
                    v-model:value="ifItem.trigger_conditions_type"
                    :options="getTimeConditionOptions(ifGroupItem)"
                    :placeholder="$t('common.select')"
                    @update:value="ifItem.task_type = null"
                  />
                </NFormItem>
                <template v-if="ifItem.trigger_conditions_type === '20'">
                  <NFormItem
                    :show-label="false"
                    :path="`ifGroups[${ifGroupIndex}][${ifIndex}].onceTimeValue`"
                    :rule="premiseFormRules.onceTimeValue"
                    class="max-w-70 w-full"
                  >
                    <n-date-picker
                      v-model:value="ifItem.onceTimeValue"
                      type="datetime"
                      class="w-full"
                      :time-picker-props="{ format: 'HH:mm' }"
                      format="yyyy-MM-dd HH:mm"
                      :placeholder="
                        $t('generate.please-select-day-hour-minute')
                      "
                    />
                  </NFormItem>
                  <NFlex align="center">
                    {{ $t('generate.not-executed') }}
                    <NButton text class="refresh-class">
                      <n-icon>
                        <IosRefresh />
                      </n-icon>
                    </NButton>
                  </NFlex>
                  <!--                  <span class="ml-4"></span>-->
                  <NFormItem
                    :label="$t('generate.expiration-time')"
                    label-width="150px"
                    :path="`ifGroups[${ifGroupIndex}][${ifIndex}].expiration_time`"
                    :rule="premiseFormRules.expiration_time"
                  >
                    <NSelect
                      v-model:value="ifItem.expiration_time"
                      :options="expirationTimeOptions"
                      :placeholder="$t('generate.please-select')"
                      class="w-50"
                    />
                    <n-tooltip placement="top-start" trigger="hover">
                      <template #trigger>
                        <n-icon size="24" class="ml-2">
                          <IosAlert />
                        </n-icon>
                      </template>
                      Invalid after exceeding the execution time
                      {{
                        expirationTimeOptions.find(
                          (data) => ifItem['expiration_time']
                        )?.label || ''
                      }}
                    </n-tooltip>
                  </NFormItem>
                </template>
                <template v-if="ifItem.trigger_conditions_type === '21'">
                  <NFormItem
                    :show-label="false"
                    :path="`ifGroups[${ifGroupIndex}][${ifIndex}].task_type`"
                    :rule="premiseFormRules.task_type"
                    class="max-w-35 w-full"
                  >
                    <NSelect
                      v-model:value="ifItem.task_type"
                      :options="cycleOptions"
                      :placeholder="$t('generate.please-select')"
                      @update:value="
                        () => {
                          ifItem.hourTimeValue = null;
                          ifItem.expiration_time = null;
                          ifItem.dayTimeValue = null;
                          ifItem.weekTimeValue = null;
                          ifItem.monthChoseValue = null;
                          ifItem.weekChoseValue = null;
                          ifItem.monthTimeValue = null;
                        }
                      "
                    />
                  </NFormItem>
                  <template v-if="ifItem.task_type === 'HOUR'">
                    <NFormItem
                      key="hourTimeValue"
                      :show-label="false"
                      :path="`ifGroups[${ifGroupIndex}][${ifIndex}].hourTimeValue`"
                      :rule="premiseFormRules.hourTimeValue"
                      class="max-w-35 w-full"
                    >
                      <NTimePicker
                        v-model:value="ifItem.hourTimeValue"
                        :placeholder="$t('common.select')"
                        class="w-35"
                        format="mm"
                      />
                    </NFormItem>
                    <NFormItem
                      key="expiration_time0"
                      :label="$t('generate.expiration-time')"
                      label-width="150px"
                      :path="`ifGroups[${ifGroupIndex}][${ifIndex}].expiration_time`"
                      :rule="premiseFormRules.expiration_time"
                    >
                      <NSelect
                        v-model:value="ifItem.expiration_time"
                        :options="expirationTimeOptions"
                        :placeholder="$t('generate.please-select')"
                        class="w-35"
                      />
                      <n-tooltip placement="top-start" trigger="hover">
                        <template #trigger>
                          <n-icon size="24" class="ml-2">
                            <IosAlert />
                          </n-icon>
                        </template>
                        Expires after exceeding the execution time
                        {{
                          expirationTimeOptions.find(
                            (data) => ifItem['expiration_time']
                          )?.label || ''
                        }}
                      </n-tooltip>
                    </NFormItem>
                  </template>
                  <template v-if="ifItem.task_type === 'DAY'">
                    <NFormItem
                      key="dayTimeValue"
                      :show-label="false"
                      :path="`ifGroups[${ifGroupIndex}][${ifIndex}].dayTimeValue`"
                      :rule="premiseFormRules.dayTimeValue"
                      class="max-w-35 w-full"
                    >
                      <NTimePicker
                        v-model:value="ifItem.dayTimeValue"
                        :placeholder="$t('common.select')"
                        value-format="HH:mm"
                        class="w-35"
                        format="HH:mm"
                      />
                    </NFormItem>
                    <NFormItem
                      key="expiration_time1"
                      :label="$t('generate.expiration-time')"
                      label-width="150px"
                      :path="`ifGroups[${ifGroupIndex}][${ifIndex}].expiration_time`"
                      :rule="premiseFormRules.expiration_time"
                    >
                      <NSelect
                        v-model:value="ifItem.expiration_time"
                        :options="expirationTimeOptions"
                        :placeholder="$t('generate.please-select')"
                        class="w-35"
                      />
                      <n-tooltip placement="top-start" trigger="hover">
                        <template #trigger>
                          <n-icon size="24" class="ml-2">
                            <IosAlert />
                          </n-icon>
                        </template>
                        Expires after exceeding the execution time
                        {{
                          expirationTimeOptions.find(
                            (data) => ifItem['expiration_time']
                          )?.label || ''
                        }}
                      </n-tooltip>
                    </NFormItem>
                  </template>
                  <template v-if="ifItem.task_type === 'WEEK'">
                    <div class="weekChoseValue-box w-120">
                      <NFormItem
                        key="weekChoseValue"
                        :show-label="false"
                        :path="`ifGroups[${ifGroupIndex}][${ifIndex}].weekChoseValue`"
                        :rule="premiseFormRules.weekChoseValue"
                        :show-feedback="true"
                        class="w-full"
                      >
                        <NCheckboxGroup v-model:value="ifItem.weekChoseValue">
                          <NSpace item-style="display: flex;">
                            <n-checkbox
                              v-for="(weekItem, weekIndex) in weekOptions"
                              :key="weekIndex"
                              :value="weekItem.value"
                              :label="weekItem.label"
                            />
                          </NSpace>
                        </NCheckboxGroup>
                      </NFormItem>
                    </div>
                    <NFormItem
                      key="weekTimeValue"
                      :show-label="false"
                      :path="`ifGroups[${ifGroupIndex}][${ifIndex}].weekTimeValue`"
                      :rule="premiseFormRules.weekTimeValue"
                      class="max-w-35 w-full"
                    >
                      <NTimePicker
                        v-model:value="ifItem.weekTimeValue"
                        :placeholder="$t('common.select')"
                        value-format="HH:mm"
                        class="w-35"
                        format="HH:mm"
                      />
                    </NFormItem>
                    <NFormItem
                      key="expiration_time2"
                      :label="$t('generate.expiration-time')"
                      label-width="150px"
                      :path="`ifGroups[${ifGroupIndex}][${ifIndex}].expiration_time`"
                      :rule="premiseFormRules.expiration_time"
                    >
                      <NSelect
                        v-model:value="ifItem.expiration_time"
                        :options="expirationTimeOptions"
                        :placeholder="$t('generate.please-select')"
                        class="w-35"
                      />
                      <n-tooltip placement="top-start" trigger="hover">
                        <template #trigger>
                          <n-icon size="24" class="ml-2">
                            <IosAlert />
                          </n-icon>
                        </template>
                        Expires after exceeding the execution time
                        {{
                          expirationTimeOptions.find(
                            (data) => ifItem['expiration_time']
                          )?.label || ''
                        }}
                      </n-tooltip>
                    </NFormItem>
                  </template>
                  <template v-if="ifItem.task_type === 'MONTH'">
                    <NFormItem
                      key="monthChoseValue"
                      :show-label="false"
                      :path="`ifGroups[${ifGroupIndex}][${ifIndex}].monthChoseValue`"
                      :rule="premiseFormRules.monthChoseValue"
                      class="max-w-45 w-full"
                    >
                      <NSelect
                        v-model:value="ifItem.monthChoseValue"
                        :options="mouthRangeOptions"
                        :placeholder="$t('generate.please-select-date')"
                        class="w-full"
                      />
                    </NFormItem>
                    <NFormItem
                      key="monthTimeValue"
                      :show-label="false"
                      :path="`ifGroups[${ifGroupIndex}][${ifIndex}].monthTimeValue`"
                      :rule="premiseFormRules.monthTimeValue"
                      class="max-w-35 w-full"
                    >
                      <NTimePicker
                        v-model:value="ifItem.monthTimeValue"
                        :placeholder="$t('common.select')"
                        value-format="HH:mm"
                        class="w-35"
                        format="HH:mm"
                      />
                    </NFormItem>
                    <NFormItem
                      key="expiration_time3"
                      :label="$t('generate.expiration-time')"
                      label-width="150px"
                      :path="`ifGroups[${ifGroupIndex}][${ifIndex}].expiration_time`"
                      :rule="premiseFormRules.expiration_time"
                    >
                      <NSelect
                        v-model:value="ifItem.expiration_time"
                        :options="expirationTimeOptions"
                        :placeholder="$t('generate.please-select')"
                        class="w-35"
                      />
                      <n-tooltip placement="top-start" trigger="hover">
                        <template #trigger>
                          <n-icon size="24" class="ml-2">
                            <IosAlert />
                          </n-icon>
                        </template>
                        Expires after exceeding the execution time
                        {{
                          expirationTimeOptions.find(
                            (data) => ifItem['expiration_time']
                          )?.label || ''
                        }}
                      </n-tooltip>
                    </NFormItem>
                  </template>
                </template>
                <template v-if="ifItem.trigger_conditions_type === '22'">
                  <div class="weekChoseValue-box w-120">
                    <NFormItem
                      :show-label="false"
                      :path="`ifGroups[${ifGroupIndex}][${ifIndex}].weekChoseValue`"
                      :rule="premiseFormRules.weekChoseValue"
                      :show-feedback="true"
                      class="w-full"
                    >
                      <NCheckboxGroup v-model:value="ifItem.weekChoseValue">
                        <NSpace item-style="display: flex;">
                          <NCheckbox
                            v-for="(weekItem, weekIndex) in weekOptions"
                            :key="weekIndex"
                            :value="weekItem.value"
                            :label="weekItem.label"
                          />
                        </NSpace>
                      </NCheckboxGroup>
                    </NFormItem>
                  </div>
                  <NFormItem
                    :show-label="false"
                    :path="`ifGroups[${ifGroupIndex}][${ifIndex}].startTimeValue`"
                    :rule="premiseFormRules.startTimeValue"
                    class="max-w-35 w-full"
                  >
                    <NTimePicker
                      v-model:value="ifItem.startTimeValue"
                      :placeholder="$t('common.select')"
                      value-format="HH:mm:ss"
                      format="HH:mm:ss"
                    />
                  </NFormItem>
                  -
                  <NFormItem
                    :show-label="false"
                    :path="`ifGroups[${ifGroupIndex}][${ifIndex}].endTimeValue`"
                    :rule="premiseFormRules.endTimeValue"
                    class="max-w-35 w-full"
                  >
                    <NTimePicker
                      v-model:value="ifItem.endTimeValue"
                      :placeholder="$t('common.select')"
                      value-format="HH:mm:ss"
                      format="HH:mm:ss"
                    />
                  </NFormItem>
                </template>
              </NFlex>
              <NFlex v-if="ifItem.ifType === '3'" class="flex-1">
                <NFormItem
                  :show-label="false"
                  :path="`ifGroups[${ifGroupIndex}][${ifIndex}].trigger_conditions_type`"
                  :rule="premiseFormRules.trigger_conditions_type"
                  class="max-w-40 w-full"
                >
                  <NSelect
                    v-model:value="ifItem.trigger_conditions_type"
                    :options="serviceConditionOptions"
                    class="max-w-40"
                  />
                </NFormItem>
                <NFormItem
                  :show-label="false"
                  :path="`ifGroups[${ifGroupIndex}][${ifIndex}].weatherValue`"
                  :rule="premiseFormRules.weatherValue"
                  class="max-w-40 w-full"
                >
                  <NSelect
                    v-model:value="ifItem.weatherValue"
                    :options="weatherOptions"
                  />
                </NFormItem>
              </NFlex>
            </NFlex>
            <NFlex class="w-100px">
              <NButton
                v-if="ifIndex === 0"
                type="primary"
                class="absolute right-0"
                @click="addIfGroupsSubItem(ifGroupIndex)"
              >
                {{ $t('generate.add-condition') }}
              </NButton>
              <NButton
                v-if="ifIndex !== 0"
                type="error"
                class="absolute right-0"
                @click="deleteIfGroupsSubItem(ifGroupIndex, ifIndex)"
              >
                {{ $t('generate.delete-condition') }}
              </NButton>
            </NFlex>
          </NFlex>
        </NCard>
        <NButton
          v-if="ifGroupIndex > 0"
          type="error"
          class="relative"
          @click="deleteIfGroupsItem(ifGroupIndex)"
        >
          {{ $t('generate.delete-group') }}
        </NButton>
      </NFlex>
    </NForm>
    <NButton type="primary" class="w-30" @click="addIfGroupItem(null)">{{
      $t('generate.add-group')
    }}</NButton>
  </NFlex>
</template>

<style scoped>
.ifGroupItem-class {
  position: relative;
}

.ifGroupItem-class .tag-class {
  position: absolute;
  top: 5px;
}

.refresh-class {
  font-size: 24px;
}

:deep(.n-card__content) {
  padding: 10px 10px 4px 10px !important;
}

.weekChoseValue-box :deep(.n-form-item-feedback-wrapper) {
  position: absolute;
  top: 20px;
}
</style>
