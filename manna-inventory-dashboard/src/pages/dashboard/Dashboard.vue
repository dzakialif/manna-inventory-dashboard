<script>
import SummaryChart from "@/pages/dashboard/SummaryChart.vue";
import CollectionPoint from "@/pages/dashboard/CollectionPoint.vue";
import StatsWidget from "@/pages/dashboard/StatsWidget.vue";
import ABCAnalysis from "@/pages/dashboard/ABCAnalysis.vue";
import ReorderPointSummary from "@/pages/dashboard/ReorderPointSummary.vue";

export default {
    components: {
        SummaryChart,
        ABCAnalysis,
        ReorderPointSummary,
        StatsWidget
    },
    data() {
        return {
            selectedMonth: null,
            selectedYear: null,
        };
    },
    methods: {
        handleFilterChange(filter) {
            this.selectedMonth = filter.month;
            this.selectedYear = filter.year;
            console.log("Filter diterima di Dashboard:", filter);
            // Anda bisa meneruskan ini ke komponen lain sebagai props jika diperlukan di masa mendatang
        }
    }
};
</script>
<template>
    <div class="grid grid-cols-12 gap-8">
        <StatsWidget />

        <div class="col-span-12">
            <SummaryChart @filter-change="handleFilterChange" />
        </div>
        <div class="col-span-6">
            <ABCAnalysis />
        </div>
        <div class="col-span-6">
            <ReorderPointSummary />
        </div>
    </div>
</template>
