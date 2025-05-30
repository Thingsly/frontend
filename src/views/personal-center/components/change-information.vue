<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import type { FormItemRule, FormRules } from 'naive-ui';
import { useNaiveForm } from '@/hooks/common/form';
import { getConfirmPwdRule } from '@/utils/form/rule';
import { changeInformation, passwordModification } from '@/service/api/personal-center';
import { $t } from '@/locales';
import { encryptDataByRsa, generateRandomHexString, validName, validPasswordByExp } from '@/utils/common/tool';

export interface Props {
  visible: boolean;
  type?: 'amend' | 'changePassword';
}

export type ModalType = NonNullable<Props['type']>;

defineOptions({ name: 'TableActionModal' });
const props = withDefaults(defineProps<Props>(), {
  type: 'amend',
  editData: null
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;

  (e: 'modification', name: string): void;
}
const { formRef, validate } = useNaiveForm();
const emit = defineEmits<Emits>();

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});
const title = computed(() => {
  const titles: Record<ModalType, string> = {
    amend: $t('custom.personalCenter.modifyBasicInfo'),
    changePassword: $t('custom.personalCenter.changePassword')
  };
  return titles[props.type];
});
const estimate = computed(() => {
  const titles: Record<ModalType, string> = {
    amend: 'amend',
    changePassword: 'changePassword'
  };
  return titles[props.type];
});

const formData = ref({
  name: '',
  old_password: '',
  password: '',
  passwords: ''
});

const closeModal = () => {
  modalVisible.value = false;
  formData.value.name = '';
};
/**
 * Edit name
 *
 * @param name
 */
const editName = async () => {
  await validate();
  const data = { name: formData.value.name };
  const res = await changeInformation(data);

  if (!res.error) {
    modalVisible.value = false;
    emit('modification', formData.value.name);
  }
};
/** passwordModification */
const password = async () => {
  await validate();
  const data = localStorage.getItem('enableZcAndYzm') ? JSON.parse(localStorage.getItem('enableZcAndYzm')) : [];
  let salt = null;
  let password1 = formData.value.password;
  if (data.find(v => v.name === 'frontend_res')?.enable_flag === 'enable') {
    salt = generateRandomHexString(16);
    password1 = encryptDataByRsa(password1 + salt);
  }
  const param = {
    old_password: formData.value.old_password,
    password: password1,
    salt
  };
  const res = await passwordModification(param);
  if (!res.error) {
    modalVisible.value = false;
    emit('modification');
  }
};

function submit() {
  if (estimate.value === 'amend') {
    editName();
  } else {
    password();
  }
}
const rules: FormRules = {
  name: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (rule && !validName(value)) {
          return new Error($t('custom.personalCenter.nameFieldNotEmpty'));
        }
        return true;
      },
      trigger: ['input', 'blur']
    }
  ],
  password: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (value.length < 8 || value.length > 18) {
          return Promise.reject(rule.message);
        }
        if (!validPasswordByExp(value)) {
          return Promise.reject(rule.message);
        }
        return Promise.resolve();
      },
      message: $t('form.pwd.tip'),
      trigger: ['input', 'blur']
    }
  ],
  passwords: getConfirmPwdRule(toRefs(formData.value).password)
};
</script>

<template>
  <NModal v-model:show="modalVisible" preset="card" :title="title" class="w-500px">
    <NForm ref="formRef" label-placement="left" :model="formData" :rules="rules">
      <NGrid :cols="2" :x-gap="18">
        <NFormItemGridItem v-if="estimate === 'amend'" :span="24" :label="$t('page.manage.user.userName')" path="name">
          <NInput v-model:value="formData.name" />
        </NFormItemGridItem>
        <NFormItemGridItem
          v-if="estimate === 'changePassword'"
          :span="24"
          label-width="100"
          type="password"
          show-password-on="mousedown"
          :label="$t('generate.old-password')"
          path="old_password"
        >
          <NInput v-model:value="formData.old_password" type="password" show-password-on="click" />
        </NFormItemGridItem>
        <NFormItemGridItem
          v-if="estimate === 'changePassword'"
          label-width="100"
          :span="24"
          :label="$t('generate.new-password')"
          path="password"
        >
          <NInput v-model:value="formData.password" type="password" show-password-on="click" />
        </NFormItemGridItem>
        <NFormItemGridItem
          v-if="estimate === 'changePassword'"
          :span="24"
          label-width="100"
          :label="$t('generate.repeat-new-password')"
          path="passwords"
        >
          <NInput v-model:value="formData.passwords" type="password" show-password-on="click" />
        </NFormItemGridItem>
      </NGrid>
      <NSpace class="w-full pt-16px" :size="24" justify="end">
        <NButton class="w-72px" @click="closeModal">{{ $t('generate.cancel') }}</NButton>
        <NButton class="w-72px" type="primary" @click="submit">{{ $t('common.save') }}</NButton>
      </NSpace>
    </NForm>
  </NModal>
</template>

<style scoped></style>
