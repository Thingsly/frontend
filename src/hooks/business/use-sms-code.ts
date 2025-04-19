import { computed } from 'vue';
import { useLoading } from '@sa/hooks';
import { REG_PHONE } from '@/constants/reg';
import { fetchEmailCodeByEmail, fetchSmsCode } from '@/service/api/auth';
import { $t } from '@/locales';
import useCountDown from './use-count-down';

export default function useSmsCode() {
  const { loading, startLoading, endLoading } = useLoading();
  const { counts, start, isCounting } = useCountDown(60);
  const initLabel = computed(() => $t('page.login.common.getCode'));
  const countingLabel = (second: number) =>
    $t('page.login.common.countingLabel', { second });
  const label = computed(() => {
    let text = initLabel.value;
    if (loading.value) {
      text = '';
    }
    if (isCounting.value) {
      text = countingLabel(counts.value);
    }
    return text;
  });

  function isPhoneValid(phone: string) {
    let valid = true;
    if (phone.trim() === '') {
      window.$message?.error($t('page.login.common.phoneRequired'));
      valid = false;
    } else if (!REG_PHONE.test(phone)) {
      window.$message?.error($t('page.login.common.phoneInvalid'));
      valid = false;
    }
    return valid;
  }

  async function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const valid = emailRegex.test(email);
    if (!valid) {
      window.$message?.error($t('page.login.common.emailInvalid'));
    } else if (email.trim() === '') {
      window.$message?.error($t('page.login.common.emailRequired'));
    }
    return valid;
  }

  /**
   * Get SMS verification code
   *
   * @param phone - Phone number
   */
  async function getSmsCode(phone: string) {
    const valid = isPhoneValid(phone);
    if (!valid || loading.value) return;

    startLoading();
    try {
      const { error, data } = await fetchSmsCode(phone);
      console.log('data', data, error);
      if (!error && data) {
        start();
        window.$message?.success($t('page.login.common.codeSent'));
      } else {
        window.$message?.error($t('page.login.common.codeError'));
      }
    } catch (err) {
      window.$message?.error($t('page.login.common.codeError'));
    } finally {
      endLoading();
    }
  }

  /**
   * Get email verification code
   *
   * @param email - Email address
   */
  async function getSmsCodeByEmail(email: string) {
    const valid = await isValidEmail(email);
    if (!valid || loading.value) return;

    startLoading();
    try {
      const { error, data, code, message } = await fetchEmailCodeByEmail(email);
      if (code === 200 && !error && data) {
        start();
        window.$message?.success($t('page.login.common.codeSent'));
      } else if (code === 200008) {
        window.$message?.error(
          message || $t('page.login.common.emailRegistered')
        );
      } else {
        window.$message?.error(message || $t('page.login.common.codeError'));
      }
    } catch (err) {
      window.$message?.error($t('page.login.common.codeError'));
    } finally {
      endLoading();
    }
  }

  return {
    label,
    start,
    isCounting,
    getSmsCode,
    loading,
    isValidEmail,
    getSmsCodeByEmail
  };
}
