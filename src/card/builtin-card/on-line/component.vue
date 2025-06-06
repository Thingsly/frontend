<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import { createLogger } from '@/utils/logger';
import { $t } from '@/locales';
import { sumData, totalNumber } from '../../../service/api';
import { GradientBg } from './components';
const logger = createLogger('OnLIne');

defineOptions({ name: 'NumCard' });

const authStore = useAuthStore();

const cardData = ref<any>({
  id: 'amount',
  title: $t('card.onlineDev'),
  value: 0,
  unit: $t('card.deviceUnit'),
  colors: ['#865ec0', '#5144b4'],
  icon: 'fa-wifi'
});

const getData: () => void = async () => {
  try {
    const response: { data: any } =
      authStore?.$state.userInfo.authority === 'TENANT_ADMIN' ? await sumData() : await totalNumber();
    if (response.data) {
      cardData.value.value = response.data.device_on;
    } else {
      logger.error('Data does not contain the required properties or they are not numbers.');
    }
  } catch (error) {
    logger.error('Error fetching data:');
  }
};

getData();
</script>

<template>
  <GradientBg class="access" :start-color="cardData.colors[0]" :end-color="cardData.colors[1]">
    <h3 class="text-16px">{{ cardData.title }}</h3>
    <div class="icon-items flex justify-between pt-30px">
      <SvgIcon :icon="cardData.icon" class="text-32px" />
      <CountTo
        :prefix="cardData.unit"
        :start-value="1"
        :end-value="cardData.value"
        class="text-30px text-white dark:text-dark"
      />
    </div>
  </GradientBg>
</template>

<style scoped>
.access {
  width: 100%;
  height: 100%;
  min-width: max-content;
  min-height: max-content;
}

.icon-items {
  align-items: center;
}
</style>
