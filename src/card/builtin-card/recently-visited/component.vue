<template>
  <div class="p-4 h-full bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col">
    <h3 class="text-base font-semibold mb-3 text-gray-800 dark:text-gray-100 flex-shrink-0">{{ $t('card.recentlyVisited.title') }}</h3>
    <div class="flex-grow overflow-hidden">
      <ul class="space-y-1.5 overflow-y-auto h-full pr-1">
        <li
          v-for="route in visitedRoutes"
          :key="route.path + JSON.stringify(route.query)"
          class="flex items-center cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors duration-150"
          @click="navigateTo(route.path, route.query)"
        >
          <SvgIcon
            v-if="route.icon"
            :icon="route.icon"
            class="w-5 h-5 mr-3 text-blue-500 flex-shrink-0"
          />
          <span v-else class="w-5 h-5 mr-3 flex-shrink-0"></span>
          <span class="text-sm text-gray-700 dark:text-gray-300 truncate mr-2">{{ route.title }}</span>
          <span class="ml-auto text-gray-400 dark:text-gray-500 text-xs">></span>
        </li>
        <li v-if="!visitedRoutes.length" class="text-sm text-gray-500 dark:text-gray-400 px-2 py-4 text-center">
          {{ $t('card.recentlyVisited.noRecords') }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, type LocationQuery } from 'vue-router';
import { $t } from '@/locales';

interface VisitedRoute {
  path: string;
  name: string | symbol | undefined;
  title: string;
  icon?: string;
  i18nKey?: string;
  query?: LocationQuery;
}

const RECENTLY_VISITED_ROUTES_KEY = 'RECENTLY_VISITED_ROUTES';
const visitedRoutes = ref<VisitedRoute[]>([]);
const router = useRouter();

const loadVisitedRoutes = () => {
  try {
    const routesRaw = localStorage.getItem(RECENTLY_VISITED_ROUTES_KEY);
    console.log('routesRaw',routesRaw);

    if (routesRaw) {
      visitedRoutes.value = JSON.parse(routesRaw);
    } else {
      visitedRoutes.value = [];
    }
  } catch (error) {
    console.error('Failed to load recently visited routes: ', error);
    visitedRoutes.value = [];
  }
};

loadVisitedRoutes();

const navigateTo = (path: string, query?: LocationQuery) => {
  router.push({ path, query });
};

onMounted(() => {
  window.addEventListener('storage', (event) => {
    if (event.key === RECENTLY_VISITED_ROUTES_KEY) {
      loadVisitedRoutes();
    }
  });
});

// import { onUnmounted } from 'vue';
// onUnmounted(() => {
//   window.removeEventListener('storage', loadVisitedRoutes);
// });
</script>

<style scoped>
ul::-webkit-scrollbar {
  width: 4px;
}

ul::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}

ul::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>