<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { $t } from '@/locales';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import useSmsCode from '@/hooks/business/use-sms-code';
import { useAuthStore } from '@/store/modules/auth';
import { fetchEmailCode, registerByEmail } from '@/service/api/auth';
import { localStg } from '@/utils/storage';

defineOptions({
  name: 'RegisterPage'
});

const { locale } = useI18n();
const auth = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();

interface FormModel {
  email: string;
  phone: string;
  code: string;
  pwd: string;
}

const model: FormModel = reactive({
  email: '',
  phone: '',
  code: '',
  pwd: ''
});
const { label, isCounting, loading: smsLoading, start } = useSmsCode();

const canSubmit = computed(() => {
  return (
    model.email.trim() !== '' &&
    model.code.trim() !== '' &&
    model.pwd.trim() !== '' &&
    model.pwd.length >= 6
  );
});

const commonDomains = [
  'qq.com',
  '163.com',
  'gmail.com',
  'outlook.com',
  'sina.com',
  'hotmail.com',
  'yahoo.com'
];

const emailOptions = computed(() => {
  const email = model.email;
  if (!email || !email.includes('@')) {
    return [];
  }

  const parts = email.split('@');
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

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  const { formRules } = useFormRules();

  return {
    email: formRules.email,
    phone: formRules.phone,
    code: formRules.code,
    pwd: [
      {
        validator: (_rule, value) => {
          if (value.length < 6) {
            return Promise.reject(new Error($t('form.pwd.tip')));
          }
          if (!/[a-z]/.test(value)) {
            return Promise.reject(new Error($t('form.pwd.tip')));
          }
          return Promise.resolve();
        },
        message: () => $t('form.pwd.tip'),
        trigger: ['input', 'blur']
      }
    ]
  };
});

const agreement = ref(false);
const agreementRef = ref<HTMLElement | null>(null);

function handleSmsCode() {
  fetchEmailCode(model.email)
    .then(() => {
      start();
    })
    .catch((error) => {
      console.error('Failed to send verification code:', error);
    });
}

function handleButtonClick() {
  if (!agreement.value) {
    if (agreementRef.value) {
      agreementRef.value.classList.add('shake-animation');

      setTimeout(() => {
        agreementRef.value?.classList.remove('shake-animation');

        window.$message?.warning($t('page.login.register.agreementRequired'));
      }, 500);
    }
    return;
  }
  handleSubmit();
}

async function handleSubmit() {
  try {
    await validate();

    const resp = (await registerByEmail({
      email: model.email,
      verify_code: model.code,
      password: model.pwd,
      phone_prefix: '+86',
      phone_number: model.phone
    })) as any;

    if (!resp.error) {
      window.$message?.success($t('page.login.register.registerSuccess'));

      if (resp.data && resp.data.token) {
        localStg.set('token', resp.data.token);
        const expires_in = Date.now() + (resp.data.expires_in || 360000) * 1000;
        localStg.set('token_expires_in', expires_in.toString());

        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setTimeout(() => {
          toggleLoginModule('pwd-login');
        }, 1500);
      }
    }
  } catch (error: any) {
    console.error('Registration failed:', error);
  }
}
</script>

<template>
  <NForm
    ref="formRef"
    :key="locale"
    :model="model"
    :rules="rules"
    size="large"
    :show-label="false"
    autocomplete="off"
  >
    <NFormItem path="email">
      <NAutoComplete
        v-model:value="model.email"
        :options="emailOptions"
        :placeholder="$t('page.login.register.emailPlaceholder')"
        clearable
        autocomplete="off"
        @keydown.enter="handleSubmit"
      />
    </NFormItem>
    <NFormItem path="code">
      <div class="w-full flex-y-center">
        <NInput
          v-model:value="model.code"
          :placeholder="$t('page.login.common.codePlaceholder')"
          autocomplete="off"
        />
        <div class="w-18px"></div>
        <NButton
          size="large"
          :disabled="isCounting || !model.email.trim()"
          :loading="smsLoading"
          @click="handleSmsCode"
        >
          {{ label }}
        </NButton>
      </div>
    </NFormItem>
    <NFormItem path="phone">
      <NInput
        v-model:value="model.phone"
        :placeholder="$t('page.login.common.phonePlaceholder')"
        autocomplete="off"
      />
    </NFormItem>

    <NFormItem path="pwd">
      <NInput
        v-model:value="model.pwd"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
        autocomplete="new-password"
      />
    </NFormItem>

    <NSpace vertical :size="18" class="w-full">
      <div ref="agreementRef">
        <LoginAgreement v-model:value="agreement" />
      </div>
      <NButton
        type="primary"
        size="large"
        round
        block
        :loading="auth.loginLoading"
        :disabled="!canSubmit"
        @click="handleButtonClick"
      >
        {{ $t('common.confirm') }}
      </NButton>
      <NButton size="large" round block @click="toggleLoginModule('pwd-login')">
        {{ $t('page.login.common.back') }}
      </NButton>
    </NSpace>
  </NForm>
</template>

<style scoped>
/* 保留这个样式，防止自动填充背景变黄 */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: inherit !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* 添加晃动动画 */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-4px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(4px);
  }
}

.shake-animation {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
</style>
