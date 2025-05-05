<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { $t } from '@/locales';
import dayjs from 'dayjs';

defineOptions({ name: 'OpenStreetMap' });

const props = defineProps<{
  longitude?: number;
  latitude?: number;
  devices?: any[];
}>();

const emit = defineEmits(['position-selected']);

const domRef = ref<HTMLDivElement>();
let map: L.Map | null = null;
let markers: L.Marker[] = [];

function renderDeviceInfo(device: any) {
  const statusText = {
    1: $t('custom.devicePage.online'),
    0: $t('custom.devicePage.offline')
  } as const;

  return `
    <div class="device-info">
      <h3>${device.name || 'Unknown Device'}</h3>
      <div>${$t('custom.devicePage.lastPushTime')}: ${device.ts ? dayjs(device.ts).format('YYYY-MM-DD HH:mm:ss') : '-'}</div>
      <div>${$t('generate.status')}: ${statusText[device.is_online]}</div>
    </div>
  `;
}

async function renderMap() {
  if (!domRef.value) return;

  // Initialize map
  const center = props.latitude && props.longitude
    ? L.latLng(props.latitude, props.longitude)
    : L.latLng(21.0285, 105.8542); // Hanoi coordinates as default
  map = L.map(domRef.value).setView(center, 11);

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  // Enable features
  map.scrollWheelZoom.enable();
  map.doubleClickZoom.enable();
  map.dragging.enable();
  map.touchZoom.enable();
  map.keyboard.enable();

  // Add click handler
  map.on('click', (e) => {
    emit('position-selected', { lat: e.latlng.lat, lng: e.latlng.lng });
  });

  // Add markers for devices
  if (props.devices?.length) {
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    markers = [];

    // Add new markers
    props.devices.forEach(device => {
      if (device?.location) {
        const locations = device.location.split(',');
        const latitude = Number(locations[1] || 0);
        const longitude = Number(locations[0] || 0);

        if (!Number.isNaN(latitude) && !Number.isNaN(longitude) && latitude !== 0 && longitude !== 0) {
          const marker = L.marker([latitude, longitude]).addTo(map!);
          marker.bindPopup(renderDeviceInfo(device));
          markers.push(marker);
        }
      }
    });

    // Fit bounds to show all markers
    if (markers.length > 0) {
      const group = new L.FeatureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }
}

// Watch for changes in devices
watch(() => props.devices, () => {
  if (map) {
    renderMap();
  }
}, { deep: true });

onMounted(() => {
  renderMap();
});
</script>

<template>
  <div ref="domRef" class="h-full w-full"></div>
</template>

<style scoped>
:deep(.leaflet-container) {
  width: 100%;
  height: 100%;
}

:deep(.device-info) {
  padding: 8px;
  min-width: 200px;
}

:deep(.device-info h3) {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
}

:deep(.device-info div) {
  margin: 4px 0;
  font-size: 14px;
}
</style>
