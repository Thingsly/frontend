<script setup lang="ts">
import type { Component } from 'vue';
import { $t } from '@/locales';
import { BaiduMap, GaodeMap, TencentMap, OpenStreetMap } from './components';

interface Map {
  id: string;
  label: string;
  component: Component;
}

const maps: Map[] = [
  { id: 'openstreet', label: $t('custom.plugin.openstreetMap'), component: OpenStreetMap },
  { id: 'gaode', label: $t('custom.plugin.gaodeMap'), component: GaodeMap },
  { id: 'tencent', label: $t('custom.plugin.tencentMap'), component: TencentMap },
  { id: 'baidu', label: $t('custom.plugin.baiduMap'), component: BaiduMap }
];
</script>

<template>
  <div class="h-full">
    <NCard
      :title="$t('generate.map-plugin')"
      :bordered="false"
      class="h-full rounded-8px shadow-sm"
      content-style="overflow:hidden"
    >
      <NTabs type="line" class="h-full flex-col-stretch" pane-class="flex-1-hidden">
        <NTabPane v-for="item in maps" :key="item.id" :name="item.id" :tab="item.label">
          <component :is="item.component" />
        </NTabPane>
      </NTabs>
    </NCard>
  </div>
</template>

<style scoped></style>
