<script setup lang="ts">
import { inject, onMounted } from 'vue';
import CardBaseForm from '@/cards2.0/modules/card-base-form.vue';
import type { CardData, IConfigCtx } from '@/components/tp-kan-ban/kan-ban';

const props = defineProps<{
  data: CardData;
}>();


const ctx = inject<IConfigCtx>('kan-ban-config-ctx')!;

const changeCtxConfig = (key: string, data: any) => {
  ctx.config[key] = { ...data };
}; 

onMounted(() => {
  // ctx.config = {...props.data.config}
  ctx.config = props.data.config;
});
</script>

<template>
  <n-tabs
    class="card-tabs"
    default-value="basic"
    size="large"
    animated
    pane-wrapper-style="margin: 0 -4px"
    pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
  >
    <n-tab-pane name="basic" tab="Basic configuration">
      <CardBaseForm :default-basis-data="props.data.config.basis" :change-ctx-config="changeCtxConfig" />
    </n-tab-pane>
  </n-tabs>
</template>

<style scoped></style>
