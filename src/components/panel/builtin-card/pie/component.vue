<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { NumberAnimationInst } from 'naive-ui';
import * as echarts from 'echarts';
import { totalNumber } from '@/service/api';
import { $t } from '@/locales';
import { createLogger } from '@/utils/logger';
const logger = createLogger('TablePage');
const numberAnimationInstRef = ref<NumberAnimationInst | null>(null);


const deviceNum = ref(0);

const activeNum = ref(0);

const notActiveNum = ref(0);

const activeRateNum = ref(0);


const getData: () => void = async () => {
  try {
    const response: { data: any } = await totalNumber();
    if (response.data) {
      deviceNum.value = response.data.device_total;
      activeNum.value = response.data.device_on;
      notActiveNum.value = deviceNum.value - activeNum.value;

      const rate = activeNum.value === 0 || deviceNum.value === 0 ? 0 : (activeNum.value / deviceNum.value) * 100;
      activeRateNum.value = Number(rate.toFixed(2));
    } else {
      logger.error('Data does not contain the required properties or they are not numbers.');
    }
  } catch (error) {

    logger.error({ 'Error fetching data:': error });
  }
};

getData();

const equipment = ref(null);

const init: () => void = () => {
  const myecharts = echarts.init(equipment.value, null, { renderer: 'svg' });
  const option = {
    title: {
      show: false,
      text: '',
      subtext: '',
      left: 'center'
    },
    color: ['rgb(80,135,236)', 'rgb(104,187,196 )'],
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: false,
      orient: 'vertical',
      left: 'left'
    },
    label: {
      alignTo: 'edge',
      formatter: '{name|{b}}\n{time|{c}}',
      minMargin: 5,
      edgeDistance: 10,
      lineHeight: 15,
      rich: {
        time: {
          fontSize: 10,
          color: '#000'
        }
      }
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: '90%',
        itemStyle: {
          borderRadius: 3,
          borderWidth: 1
        },
        data: [
          { value: 10000, name: $t('dashboard_panel.cardName.active') },
          { value: 5005, name: $t('dashboard_panel.cardName.notActive') }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(255, 255, 255, 0.5)'
          }
        }
      }
    ]
  };
  const dom = document.getElementById('equipment')!;
  const ro = new ResizeObserver(_entries => {
    myecharts.resize();
  });
  ro.observe(dom);
  myecharts.setOption(option);
  // window.onresize = function () {
  //   myecharts.setOption(option);
  //   console.log("The window size has changed.");
  //   myecharts.resize();
  // };
  // 监听图表点击事件
  // myecharts.on('click', params => {
  //   console.log(params.name)
  // })
};

onMounted(() => {
  if (equipment.value) {
    // const myecharts = echarts.init(box.value);
    init();
  }
  return {
    equipment
  };
});
</script>

<template>
  <div>
    <div class="header">
      {{ $t('dashboard_panel.cardName.deviceNumPie') }}
      <n-number-animation ref="numberAnimationInstRef" :to="deviceNum" />
    </div>
    <div class="content-data">
      <div>
        <span>{{ $t('dashboard_panel.cardName.active') }}</span>
        <n-number-animation ref="numberAnimationInstRef" :to="activeNum" />
      </div>
      <div>
        <span>{{ $t('dashboard_panel.cardName.notActive') }}</span>
        <n-number-animation ref="numberAnimationInstRef" :to="notActiveNum" />
      </div>
      <div>
        <span>{{ $t('dashboard_panel.cardName.activationRate') }}</span>
        <span>{{ activeRateNum }}%</span>
      </div>
    </div>
    <div id="equipment" ref="equipment" class="h-full w-full"></div>
  </div>
</template>

<style lang="scss" scoped>
#equipment {
  min-height: 200px;
}

.header {
  font-weight: 900;
}

.content-data {
  // font-size: 20px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;

  span {
    margin-right: 8px;
  }
}
</style>
