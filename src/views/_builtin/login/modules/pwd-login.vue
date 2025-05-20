<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { NAutoComplete } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { $t } from '@/locales';
import { loginModuleRecord } from '@/constants/app';
import { useRouterPush } from '@/hooks/common/router';
import { useNaiveForm } from '@/hooks/common/form';
import { useAuthStore } from '@/store/modules/auth';
import { getFunction } from '@/service/api/setting';
import { createLogger } from '@/utils/logger';

const logger = createLogger('PwdLogin');

defineOptions({
  name: 'PwdLogin'
});

const { locale } = useI18n();
const isRememberPath = ref(true);
const rememberMe = ref(false);
const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();
const showYzm = ref(false);
const showZc = ref(false);

interface FormModel {
  userName: string;
  password: string;
}

const model: FormModel = reactive({
  userName: '',
  password: ''
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^1[3-9]\d{9}$/;

  return {
    userName: [
      {
        required: true,
        message: () => $t('form.userName.required'),
        trigger: ['blur']
      },
      {
        validator: (_rule, value) => {
          if (value && !emailRegex.test(value) && !phoneRegex.test(value)) {
            return Promise.reject(new Error($t('form.userName.invalidFormat')));
          }
          return Promise.resolve();
        },
        message: () => $t('form.userName.invalidFormat'),
        trigger: ['input', 'blur']
      }
    ],
    password: [
      {
        required: true,
        message: () => $t('form.pwd.required'),
        trigger: ['input', 'blur']
      }
    ]
  };
});

const commonDomains = [
  'gmail.com',
  'hust.edu.vn',
  'sis.hust.edu.vn',
  'soict.hust.edu.vn'
];

const emailOptions = computed(() => {
  const userName = model.userName;
  if (!userName || !userName.includes('@')) {
    return [];
  }

  const parts = userName.split('@');
  const username = parts[0];
  const domainInput = parts[1] || '';

  if (username === '') {
    return [];
  }

  const filteredDomains = commonDomains.filter(
    (domain) => domain.startsWith(domainInput) && domain !== domainInput
  );

  return filteredDomains.map((domain) => `${username}@${domain}`);
});

const rememberPath = (e) => {
  logger.info(e);
  isRememberPath.value = !isRememberPath.value;
  localStorage.setItem('isRememberPath', isRememberPath.value ? '1' : '0');
};

async function handleSubmit() {
  if (model.password.length < 6) {
    return;
  }

  await validate();
  await authStore.login(model.userName.trim(), model.password);

  if (rememberMe.value) {
    localStorage.setItem('rememberMe', 'true');
    localStorage.setItem('rememberedUserName', model.userName.trim());
    localStorage.setItem('rememberedPassword', window.btoa(model.password));
  } else {
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('rememberedUserName');
    localStorage.removeItem('rememberedPassword');
  }
}

async function getFunctionOption() {
  const { data } = await getFunction();
  if (data) {
    localStorage.setItem('enableZcAndYzm', JSON.stringify(data));
    showZc.value =
      data.find((v) => v.name === 'enable_reg')?.enable_flag === 'enable';

    showYzm.value =
      data.find((v) => v.name === 'use_captcha')?.enable_flag === 'enable';
  }
}

function loadSavedCredentials() {
  const savedRememberMe = localStorage.getItem('rememberMe');
  if (savedRememberMe === 'true') {
    rememberMe.value = true;
    const savedUserName = localStorage.getItem('rememberedUserName');
    const savedPassword = localStorage.getItem('rememberedPassword');

    if (savedUserName) {
      model.userName = savedUserName;
    }

    if (savedPassword) {
      model.password = window.atob(savedPassword);
    }
  }
}

onMounted(() => {
  const is_remember_rath = localStorage.getItem('isRememberPath');
  if (is_remember_rath === '0' || is_remember_rath === '1') {
    isRememberPath.value = is_remember_rath === '1';
  }
  getFunctionOption();
  loadSavedCredentials();
});
</script>

<script lang="ts">
export default {
  name: 'PwdLogin'
};
</script>

<template>
  <NForm
    ref="formRef"
    :key="locale"
    :model="model"
    :rules="rules"
    size="large"
    :show-label="false"
  >
    <NFormItem path="userName">
      <NAutoComplete
        v-model:value="model.userName"
        :options="emailOptions"
        :placeholder="$t('page.login.common.userNamePlaceholder')"
        clearable
        @keydown.enter="handleSubmit"
      />
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </NFormItem>
    <NSpace vertical :size="24">
      <div class="flex-y-center justify-between">
        <NCheckbox v-model:checked="rememberMe">{{
          $t('page.login.pwdLogin.rememberMe')
        }}</NCheckbox>
        <!--         <NButton quaternary @click="toggleLoginModule('reset-pwd')">-->
        <NButton quaternary @click="toggleLoginModule('reset-pwd')">
          {{ $t('page.login.pwdLogin.forgetPassword') }}
        </NButton>
      </div>
      <NButton
        type="primary"
        size="large"
        round
        block
        :loading="authStore.loginLoading"
        @click="handleSubmit"
      >
        {{ $t('common.confirm') }}
      </NButton>
      <NCheckbox :checked="isRememberPath" @update:checked="rememberPath">
        {{ $t('page.login.common.rememberPath') }}
      </NCheckbox>
      <div class="flex-y-center justify-between gap-12px">
        <NButton
          v-if="showYzm"
          class="flex-1"
          block
          @click="toggleLoginModule('code-login')"
        >
          {{ $t(loginModuleRecord['code-login']) }}
        </NButton>
        <NButton
          v-if="showZc"
          class="flex-1"
          block
          @click="toggleLoginModule('register-email')"
        >
          {{ $t(loginModuleRecord.register) }}
        </NButton>
      </div>
    </NSpace>
    <!-- <OtherAccount @login="handleLoginOtherAccount" /> -->
  </NForm>
</template>

<style scoped></style>
