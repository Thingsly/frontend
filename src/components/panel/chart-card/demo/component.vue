<script setup lang="ts">
import { ref } from 'vue';
import type { ICardData } from '@/components/panel/card';
import { $t } from '@/locales';
import icons from './icon';

const iconMap = new Map(icons.map(c => [c.name, c.value]));

const value = ref(1);
defineProps<{
  card: ICardData;
  // mode: IConfigCtx['view'];
}>();
</script>

<template>
  <div class="h-full flex items-center">
    <component :is="iconMap.get(card.config?.icon || 'm1')" class="text-lg" :style="{ color: card.config?.color }" />
    <span v-if="card.dataSource?.origin === 'system'" class="ml-2">
      {{ $t('card.dataName') }}: {{ card.dataSource.systemSource?.[0]?.name }}
    </span>
    <span class="ml-2">{{ $t('generate.fieldValue') }}: {{ value }}</span>
  </div>
</template>
