<script lang="ts" setup>
import { ref } from 'vue';
import type { NumberAnimationInst } from 'naive-ui';
import * as echarts from 'echarts';
import { tenant } from '@/service/api';
import { $t } from '@/locales';
const numberAnimationInstRef = ref<NumberAnimationInst | null>(null);


const equipment = ref(null);


const tenantNum = ref<number>(0);
const user_added_yesterday = ref<number>(0);
const user_added_month = ref<number>(0);
let user_list_month: number[] = [];

const init: () => void = () => {
  // const myecharts = echarts.init(box.value);
  const myecharts = echarts.init(equipment.value, null, { renderer: 'svg' });
  const option = {
    title: {
      show: false
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      show: false
    },
    grid: {
      top: '5%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [
        $t('dashboard_panel.cardName.date.february'),
        $t('dashboard_panel.cardName.date.march'),
        $t('dashboard_panel.cardName.date.april'),
        $t('dashboard_panel.cardName.date.may'),
        $t('dashboard_panel.cardName.date.june')
      ]
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: $t('dashboard_panel.cardName.tenant'),
        type: 'line',
        stack: 'Total',
        data: user_list_month
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
  // myecharts.on('click', params => {
  //   console.log(params.name)
  // })
};

const getData: () => void = async () => {
  try {
    const response: { data: any } = await tenant();
    tenantNum.value = response.data.user_total;
    user_added_yesterday.value = response.data.user_added_yesterday;
    user_added_month.value = response.data.user_added_month;
    user_list_month = response.data.user_list_month.map((item: any) => {
      return item.num;
    });
    if (equipment.value) {
      init();
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

getData();
</script>

<template>
  <div>
    <div class="header">
      {{ $t('dashboard_panel.cardName.tenantNumLine') }}
      <n-number-animation ref="numberAnimationInstRef" :to="tenantNum" />
    </div>
    <div class="content-data">
      <div class="content-data-item">
        <span>{{ $t('dashboard_panel.cardName.yesterdayAdd') }}</span>
        <n-number-animation ref="numberAnimationInstRef" :to="user_added_yesterday" />
      </div>
      <div class="content-data-item">
        <span>{{ $t('dashboard_panel.cardName.lastMonthAdd') }}</span>
        <n-number-animation ref="numberAnimationInstRef" :to="user_added_month" />
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
  margin: 10px 0;

  .content-data-item {
    min-width: 150px;
    max-width: max-content;

    span {
      margin-right: 8px;
    }
  }
}
</style>
