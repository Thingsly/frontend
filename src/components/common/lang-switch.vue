<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({
  name: 'LangSwitch'
});

interface Props {
  /** Current language */
  lang: App.I18n.LangType;
  /** Language options */
  langOptions: App.I18n.LangOption[];
  /** Show tooltip */
  showTooltip?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true
});

type Emits = {
  (e: 'changeLang', lang: App.I18n.LangType): void;
};

const emit = defineEmits<Emits>();

const tooltipContent = computed(() => {
  if (!props.showTooltip) return '';

  return $t('icon.lang');
});

// const currentLangText = computed(() => {
//   return props.lang === 'en-US' ? 'EN' : 'VI';
// });

const currentIcon = computed(() => {
  return props.lang === 'en-US' ? 'twemoji:flag-united-states' : 'twemoji:flag-vietnam';
});

function changeLang(lang: App.I18n.LangType) {
  emit('changeLang', lang);
}
</script>

<template>
  <NDropdown :value="lang" :options="langOptions" trigger="hover" @select="changeLang">
    <div>
      <ButtonIcon :tooltip-content="tooltipContent" tooltip-placement="left">
        <!-- <span class="text-16px font-medium">{{ currentLangText }}</span> -->
        <SvgIcon :icon="currentIcon" />
      </ButtonIcon>
    </div>
  </NDropdown>
</template>

<style scoped></style>
