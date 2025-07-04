<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { FormInst } from 'naive-ui';
import { NButton, NCard, useDialog } from 'naive-ui';
import moment from 'moment';
import EditAction from '@/views/automation/linkage-edit/modules/edit-action.vue';
import EditPremise from '@/views/automation/linkage-edit/modules/edit-premise.vue';
import {
  sceneAutomationsAdd,
  sceneAutomationsEdit,
  sceneAutomationsInfo
} from '@/service/api/automation';
// import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';
// import {useRouteStore} from "@/store/modules/route";
import { useTabStore } from '@/store/modules/tab';

// const { routerBack } = useRouterPush();
const dialog = useDialog();
const route = useRoute();
const router = useRouter();
const backType = ref(route.query.backType || '');
const configFormRules = ref({
  name: {
    required: true,
    message: $t('generate.enter-scene-linkage-name'),
    trigger: 'blur'
  },
  description: {
    required: false,
    message: $t('generate.sceneLinkDesc'),
    trigger: 'blur'
  },
  trigger_condition_groups: {
    required: true,
    message: $t('generate.addExecutionConditions')
  },
  actions: {
    required: true,
    message: $t('generate.addExecutionAction')
  }
});
const configFormRef = ref<HTMLElement & FormInst>();
const configForm = ref(defaultConfigForm());

const configId = ref(route.query.id || '');
const propsData = ref({
  device_id: route.query.device_id || '',
  device_config_id: route.query.device_config_id || ''
});

function defaultConfigForm() {
  return {
    id: '',
    name: null,
    description: null,
    enabled: 'Y',
    trigger_condition_groups: [],
    actions: []
  };
}
const tabStore = useTabStore();
const editPremise = ref();
const editAction = ref();
const submitData = async () => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  configForm.value.trigger_condition_groups = handleIfData();
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  configForm.value.actions = handleActionData();

  const isTimeRangeError = configForm.value.trigger_condition_groups.some(
    (item: any) => {
      return item.every((subItem) => {
        return subItem.trigger_conditions_type === '22';
      });
    }
  );
  if (isTimeRangeError) {
    window.$message?.error($t('generate.timeRangeWarning'));
    return;
  }

  const isAlarmError =
    configForm.value.trigger_condition_groups.some((item: any) => {
      return item.some((subItem) => {
        return subItem.trigger_conditions_type === '22';
      });
    }) &&
    configForm.value.actions.some((item: any) => {
      return item.actionType === '30';
    });
  if (isAlarmError) {
    window.$message?.error($t('generate.timeTypeWarning'));
    return;
  }
  await configFormRef?.value?.validate();
  await editPremise.value.premiseFormRefReturn()?.validate();
  await editAction.value.actionFormRefReturn()?.validate();
  dialog.warning({
    title: $t('common.tip'),
    content: $t('common.saveSceneInfo'),
    positiveText: $t('device_template.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: async () => {
      if (configId.value) {
        const res = await sceneAutomationsEdit(configForm.value);
        if (!res.error) {
          await tabStore.removeTab(route.path);
          if (backType.value === 'device') {
            router.replace({
              path: '/device/details',
              query: { d_id: propsData.value.device_id }
            });
          } else if (backType.value === 'config') {
            router.replace({
              path: '/device/config-detail',
              query: { id: propsData.value.device_config_id }
            });
          } else {
            router.replace({ path: '/automation/scene-linkage' });
          }
        }
      } else {
        const res = await sceneAutomationsAdd(configForm.value);
        if (!res.error) {
          await tabStore.removeTab(route.path);
          if (backType.value === 'device') {
            router.replace({
              path: '/device/details',
              query: { d_id: propsData.value.device_id }
            });
          } else if (backType.value === 'config') {
            router.replace({
              path: '/device/config-detail',
              query: { id: propsData.value.device_config_id }
            });
          } else {
            router.replace({ path: '/automation/scene-linkage' });
          }
        }
      }
    }
  });
};

const conditionsType = ref(null as any);
const conditionChose = (data: any) => {
  if (data) {
    conditionsType.value = data;
  }
};
const automationsInfo = ref(null as any);
const conditionData = ref([] as any);
const actionData = ref([] as any);

const getSceneAutomationsInfo = async () => {
  const res = await sceneAutomationsInfo(configId.value);
  if (res.data) {
    automationsInfo.value = res.data;
    configForm.value = res.data;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    conditionData.value = echoIfData(
      automationsInfo.value.trigger_condition_groups
    );
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    actionData.value = echoActionData(automationsInfo.value.actions);
  }
};

const handleIfData = () => {
  const ifGroupsData = JSON.parse(
    JSON.stringify(editPremise.value.ifGroupsData())
  );
  // eslint-disable-next-line array-callback-return
  ifGroupsData.map((ifGroupItem: any) => {
    // eslint-disable-next-line array-callback-return
    ifGroupItem.map((ifItem: any) => {
      // ifItem.expiration_time = moment().format();
      if (
        ifItem.trigger_conditions_type === '10' ||
        ifItem.trigger_conditions_type === '11'
      ) {
        if (ifItem.trigger_operator === 'between') {
          ifItem.trigger_value = `${ifItem.minValue}-${ifItem.maxValue}`;
        }
      }
      if (ifItem.trigger_conditions_type === '22') {
        let trigger_value = '';
        // eslint-disable-next-line array-callback-return
        ifItem.weekChoseValue.map((item: any) => {
          trigger_value += item;
        });
        trigger_value += `|${moment(ifItem.startTimeValue).format('HH:mm:ssZ')}`;
        trigger_value += `|${moment(ifItem.endTimeValue).format('HH:mm:ssZ')}`;
        ifItem.trigger_value = trigger_value;
      }
      if (ifItem.trigger_conditions_type === '20') {
        ifItem.execution_time = moment(ifItem.onceTimeValue).format();
      }
      if (ifItem.trigger_conditions_type === '21') {
        if (ifItem.task_type === 'HOUR') {
          ifItem.params = moment(ifItem.hourTimeValue).format('mm:00Z');
        }
        if (ifItem.task_type === 'DAY') {
          ifItem.params = moment(ifItem.dayTimeValue).format('HH:mm:00Z');
        }
        if (ifItem.task_type === 'WEEK') {
          let params = '';
          // eslint-disable-next-line array-callback-return
          ifItem.weekChoseValue.map((item: any) => {
            params += item;
          });
          ifItem.params = `${params}|${moment(ifItem.weekTimeValue).format('HH:mm:00Z')}`;
        }
        if (ifItem.task_type === 'MONTH') {
          ifItem.params = `${ifItem.monthChoseValue}T${moment(ifItem.monthTimeValue).format(`HH:mm:00Z`)}`;
        }
      }
    });
  });
  return ifGroupsData;
};

const handleActionData = () => {
  const actionGroupsData = JSON.parse(
    JSON.stringify(editAction.value.actionGroupsReturn())
  );
  const actionsData = [] as any;
  // eslint-disable-next-line array-callback-return
  actionGroupsData.map((item: any) => {
    if (item.actionType === '1') {
      // eslint-disable-next-line array-callback-return
      item.actionInstructList.map((instructItem: any) => {
        if (
          instructItem.action_param_type === 'c_telemetry' ||
          instructItem.action_param_type === 'c_attribute' ||
          instructItem.action_param_type === 'c_command'
        ) {
          instructItem.action_value = instructItem.actionValue;
        }

        if (
          instructItem.action_param_type === 'telemetry' ||
          instructItem.action_param_type === 'attributes'
        ) {
          const action_value = {};
          action_value[instructItem.action_param] = instructItem.actionValue;
          instructItem.action_value = JSON.stringify(action_value);
        }

        if (instructItem.action_param_type === 'command') {
          const action_value = {
            method: instructItem.action_param,
            params: instructItem.actionValue
          };
          instructItem.action_value = JSON.stringify(action_value);
        }
        actionsData.push(instructItem);
      });
    } else {
      item.action_type = item.actionType;
      actionsData.push(item);
    }
  });
  return actionsData;
};

const echoIfData = (ifData: any) => {
  // eslint-disable-next-line array-callback-return
  ifData.map((item: any) => {
    // eslint-disable-next-line array-callback-return
    item.map((ifItem: any) => {
      if (
        ifItem.trigger_conditions_type === '10' ||
        ifItem.trigger_conditions_type === '11'
      ) {
        ifItem.ifType = '1';
        if (ifItem.trigger_operator === 'between') {
          ifItem.minValue = ifItem.trigger_value.split('-')[0];
          ifItem.maxValue = ifItem.trigger_value.split('-')[1];
        }
        ifItem.trigger_param_key = `${ifItem.trigger_param_type}/${ifItem.trigger_param}`;
      }
      if (ifItem.trigger_conditions_type === '22') {
        ifItem.ifType = '2';
        const weekChoseValue = ifItem.trigger_value.split('|')[0];
        ifItem.weekChoseValue = weekChoseValue.split('');
        const startTimeValue = `${String(moment().format('yyyy-MM-DD'))} ${ifItem.trigger_value.split('|')[1]}`;
        const endTimeValue = `${String(moment().format('yyyy-MM-DD'))} ${ifItem.trigger_value.split('|')[2]}`;
        ifItem.startTimeValue = moment(startTimeValue).valueOf();
        ifItem.endTimeValue = moment(endTimeValue).valueOf();
      }
      if (ifItem.trigger_conditions_type === '20') {
        ifItem.ifType = '2';
        ifItem.onceTimeValue = moment(ifItem.execution_time).valueOf();
      }
      if (ifItem.trigger_conditions_type === '21') {
        ifItem.ifType = '2';
        if (ifItem.task_type === 'HOUR') {
          const hourTimeValue = `${String(moment().format('yyyy-MM-DD HH'))}:${ifItem.params}`;
          ifItem.hourTimeValue = moment(hourTimeValue).valueOf();
        }
        if (ifItem.task_type === 'DAY') {
          const dayTimeValue = `${String(moment().format('yyyy-MM-DD'))} ${ifItem.params}`;
          ifItem.dayTimeValue = moment(dayTimeValue).valueOf();
        }
        if (ifItem.task_type === 'WEEK') {
          const weekStr = ifItem.params.split('|')[0] || null;
          const timStr = ifItem.params.split('|')[1] || null;
          ifItem.weekChoseValue = weekStr.split('');
          const weekTimeValue = `${String(moment().format('yyyy-MM-DD'))} ${timStr}`;
          ifItem.weekTimeValue = moment(weekTimeValue).valueOf();
        }
        if (ifItem.task_type === 'MONTH') {
          ifItem.monthChoseValue = ifItem.params.split('T')[0] || null;
          const monthTimeStr = ifItem.params.split('T')[1] || null;
          const monthTimeValue = `${String(moment().format('yyyy-MM-DD'))} ${monthTimeStr}`;
          ifItem.monthTimeValue = moment(monthTimeValue).valueOf();
        }
      }
    });
  });
  return ifData;
};

const echoActionData = (actionsData: any) => {
  const actionGroupsData = [] as any;
  const actionInstructList = [] as any;
  // eslint-disable-next-line array-callback-return
  actionsData.map((item: any) => {
    if (item.action_type === '10' || item.action_type === '11') {
      item.actionParamOptions = [];
      const actionValueObj = JSON.parse(item.action_value);
      if (
        item.action_param_type === 'c_telemetry' ||
        item.action_param_type === 'c_attribute' ||
        item.action_param_type === 'c_command'
      ) {
        item.actionValue = item.action_value;
      }

      if (
        item.action_param_type === 'telemetry' ||
        item.action_param_type === 'attributes'
      ) {
        item.actionValue = actionValueObj[item.action_param];
      }

      if (item.action_param_type === 'command') {
        item.actionValue = actionValueObj.params;
      }
      actionInstructList.push(item);
    } else {
      item.actionType = item.action_type;
      actionGroupsData.push(item);
    }
  });
  if (actionInstructList.length > 0) {
    const type1Data = {
      actionType: '1',
      actionInstructList
    };
    actionGroupsData.push(type1Data);
  }
  return actionGroupsData;
};
if (configId.value) {
  // eslint-disable-next-line no-unused-expressions
  typeof configId.value === 'string'
    ? (configForm.value.id = configId.value)
    : '';
  getSceneAutomationsInfo();
}
</script>

<template>
  <div class="linkage-edit">
    <NCard
      :bordered="false"
      :title="
        (configId ? $t('common.edit') : $t('common.add')) +
        ' ' + $t('route.automation_scene-linkage')
      "
    >
      <NForm
        ref="configFormRef"
        :model="configForm"
        :rules="configFormRules"
        label-placement="left"
        label-width="100"
        size="small"
      >
        <NFlex>
          <NFormItem
            :label="$t('generate.labelName')"
            path="name"
            class="w-150"
          >
            <NInput
              v-model:value="configForm.name"
              :placeholder="$t('generate.enter-scene-linkage-name')"
            />
          </NFormItem>
          <NFormItem
            :label="$t('generate.description')"
            path="description"
            class="w-150"
          >
            <NInput
              v-model:value="configForm.description"
              type="textarea"
              :placeholder="$t('generate.enter-description')"
              rows="1"
            />
          </NFormItem>
        </NFlex>
        <NFormItem
          :label="$t('generate.if')"
          class="w-100%"
          path="trigger_condition_groups"
          :show-feedback="false"
        >
          <EditPremise
            ref="editPremise"
            :device_id="propsData.device_id"
            :device_config_id="propsData.device_config_id"
            :condition-data="conditionData"
            @condition-chose="conditionChose"
          />
        </NFormItem>
        <n-divider dashed class="divider-class" />
        <NFormItem
          :label="$t('generate.then')"
          class="w-100%"
          path="actions"
          :show-feedback="false"
        >
          <EditAction
            ref="editAction"
            :conditions-type="conditionsType"
            :action-data="actionData"
          />
        </NFormItem>
      </NForm>
      <n-divider class="divider-class" />
      <NFlex justify="center">
        <NButton type="primary" @click="submitData">{{
          $t('generate.save-scene-linkage')
        }}</NButton>
      </NFlex>
    </NCard>
  </div>
</template>

<style scoped></style>
