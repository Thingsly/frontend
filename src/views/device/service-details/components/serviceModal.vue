<script setup lang="ts">
import { ref } from 'vue';
// import { useMessage } from "naive-ui";
import { createServiceDrop, getServiceAccessForm, putServiceDrop } from '@/service/api/plugin.ts';
import { $t } from '@/locales';
import FormInput from './form.vue';

// const message = useMessage();
const isEdit = ref<any>(false);
const emit = defineEmits(['getList', 'isEdit']);
const serviceModals = ref<any>(false);
const formRef = ref<any>(null);

const service_plugin_id = ref<any>('');
const formElements = ref<any>([]);
const defaultForm = {
  name: '',
  service_plugin_id: '',
  voucher: {},
  vouchers: {}
};
const form = ref<any>({ ...defaultForm });
const rules = ref<any>({
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: 'Please enter the access point name'
  }
});
const openModal: (id: any, row?: any) => void = async (id, row) => {
  if (row) {
    isEdit.value = true;
    Object.assign(form.value, row);
    Object.assign(form.value.vouchers, JSON.parse(row.voucher));
  }
  service_plugin_id.value = id;
  form.value.service_plugin_id = id;
  const data = await getServiceAccessForm({
    service_plugin_id: service_plugin_id.value
  });
  if (data.data) {
    formElements.value = data.data;
    serviceModals.value = true;
  }
};
const close: () => void = () => {
  serviceModals.value = false;
  form.value = { ...defaultForm };
  form.value.vouchers = {};
};

const submitSevice: () => void = async () => {
  form.value.voucher = JSON.stringify(form.value.vouchers);
  formRef.value?.validate(async errors => {
    if (errors) return;
    const data: any = isEdit.value ? await putServiceDrop(form.value) : await createServiceDrop(form.value);
    serviceModals.value = false;
    const id = isEdit.value ? form.value.id : data.data.id;
    emit('isEdit', form.value.voucher, id, isEdit.value);
    form.value = { ...defaultForm };
    form.value.vouchers = {};
  });
};

defineExpose({ openModal });
</script>

<template>
  <n-modal
    v-model:show="serviceModals"
    preset="dialog"
    :title="$t('card.addNewAccessPoint')"
    class="w"
    @after-leave="close"
  >
    <n-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <n-form-item :label="$t('card.accessPointName')" path="name">
        <n-input v-model:value="form.name" placeholder="Please enter the access point name" />
      </n-form-item>
    </n-form>
    <div class="box">
      <FormInput v-model:protocol-config="form.vouchers" :form-elements="formElements"></FormInput>
    </div>
    <div class="footer">
      <NButton type="primary" class="btn" @click="submitSevice">{{ $t('card.saveNext') }}</NButton>
      <NButton @click="close">{{ $t('common.cancel') }}</NButton>
    </div>
  </n-modal>
</template>

<style lang="scss" scoped>
.selectType {
  width: 100%;
}
.footer {
  display: flex;
  flex-direction: row-reverse;
  .btn {
    margin-left: 10px;
  }
}
.box {
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
.w {
  width: 70% !important;
  margin-top: 15vh;
  height: max-content !important;
  max-height: 800px !important;
  overflow: auto;
}
</style>
