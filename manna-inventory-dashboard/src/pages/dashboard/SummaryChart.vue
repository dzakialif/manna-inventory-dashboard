<script>
import { useLayout } from '@/layouts/composables/layout';
import { api } from '@/utils/api';
import Chart from 'primevue/chart';
import CustomMonthPicker from '@/components/CustomMonthPicker.vue';

export default {
  components: {
    Chart,
    CustomMonthPicker,
  },
  emits: ['filter-change'],
  data() {
    return {
      chartOptions: null,
      chartData: null,
      topSales: [],
      loading: false,
      selectedDate: null,
    };
  },
  setup() {
    const { getPrimary, getSurface, isDarkTheme } = useLayout();

    function setChartData(data) {
      return {
        labels: data.map((item) => item.productName),
        datasets: [
          {
            type: 'bar',
            label: 'Penjualan (Unit)',
            backgroundColor: '#037D5B',
            data: data.map((item) => item.totalSales),
            barThickness: 32,
          },
        ],
      };
    }

    function setChartOptions() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

      return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        scales: {
          x: {
            stacked: true,
            ticks: { color: textMutedColor },
            grid: { display: false },
          },
          y: {
            stacked: true,
            ticks: { color: textMutedColor },
            grid: { display: false },
          },
        },
      };
    }

    return {
      getPrimary,
      getSurface,
      isDarkTheme,
      setChartData,
      setChartOptions,
    };
  },
  methods: {
    async fetchTopSales() {
      this.loading = true;
      try {
        let month = null;
        let year = null;
        
        if (this.selectedDate) {
          month = this.selectedDate.getMonth() + 1;
          year = this.selectedDate.getFullYear();
        }
        
        const response = await api.get('/transactions/top-sales', {
          params: { month, year },
        });
        
        // Emit initial value on first load
        if (!this.initialEmitDone) {
          this.$emit('filter-change', { month, year });
          this.initialEmitDone = true;
        }
        if (response.data && response.data.data) {
          this.topSales = response.data.data;
        } else {
          this.topSales = [];
        }
        this.chartData = this.setChartData(this.topSales);
      } catch (error) {
        console.error('Gagal memuat data top sales:', error);
        this.topSales = [];
        this.chartData = this.setChartData([]);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.chartOptions = this.setChartOptions();
    this.chartData = this.setChartData([]);
    this.fetchTopSales();
  },
  watch: {
    selectedDate(val) {
      this.fetchTopSales();
      let month = null;
      let year = null;
      if (val) {
        month = val.getMonth() + 1;
        year = val.getFullYear();
      }
      this.$emit('filter-change', { month, year });
    },
    getPrimary() {
      this.chartData = this.setChartData(this.topSales);
      this.chartOptions = this.setChartOptions();
    },
    getSurface() {
      this.chartData = this.setChartData(this.topSales);
      this.chartOptions = this.setChartOptions();
    },
    isDarkTheme() {
      this.chartData = this.setChartData(this.topSales);
      this.chartOptions = this.setChartOptions();
    },
  },
};
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-center mb-4">
      <div class="font-bold font-farro text-xl">
        Top Penjualan Bulanan
        <i v-if="loading" class="pi pi-spin pi-spinner ml-2 text-base text-gray-400"></i>
      </div>
      <div class="flex gap-2">
        <CustomMonthPicker
          v-model="selectedDate"
          placeholder="Pilih Bulan & Tahun"
          style="width: 250px"
          class="cursor-pointer"
        />
      </div>
    </div>

    <div
      v-if="!loading && topSales.length === 0"
      class="flex items-center justify-center h-80 text-gray-400 font-farro text-sm"
    >
      Tidak ada data penjualan untuk bulan ini.
    </div>
    <Chart
      v-else-if="chartData && chartOptions"
      type="bar"
      :data="chartData"
      :options="chartOptions"
      class="h-80 font-farro"
    />
  </div>
</template>

<style lang="scss" scoped>
.card {
  background: white !important;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
