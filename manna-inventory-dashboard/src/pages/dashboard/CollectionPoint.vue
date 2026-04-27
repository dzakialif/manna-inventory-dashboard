<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">
            Persebaran Collection Point
        </div>
        <div class="grid md:grid-cols-2">
            <div class="map py-3 pr-2">
                <div>
                    <div style="width: 100%; height: 315px">
                        <LMap
                            ref="map"
                            v-model:zoom="zoom"
                            :center="center"
                            :use-global-leaflet="false"
                        >
                            <LTileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                layer-type="base"
                                name="OpenStreetMap"
                                attribution="Map data from <a href='https://www.openstreetmap.org/copyright' target='_blank' rel='noopener noreferrer' >OpenStreetMap</a>"
                            ></LTileLayer>

                            <LMarker
                                v-for="(item, index) in data"
                                :key="index"
                                :lat-lng="getMarkerPosition(item.latlong)"
                                :icon="defaultIcon"
                            >
                                <LTooltip
                                    :options="{
                                        permanent: false,
                                        interactive: true,
                                    }"
                                >
                                    {{ item.name }}
                                </LTooltip>
                            </LMarker>
                        </LMap>
                    </div>
                </div>
            </div>
            <div class="pl-3">
                <DataTable
                    :value="data"
                    scrollable
                    scrollHeight="400px"
                    tableStyle="min-width: 50rem"
                    :loading="loading"
                >
                    <Column
                        v-for="col of columns"
                        :key="col.field"
                        :field="col.field"
                        :header="col.name"
                    ></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script>
// import "leaflet/dist/leaflet.css";
// import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";

// export default {
//     components: {
//         LMap,
//         LTileLayer,
//         LMarker,
//         LTooltip,
//     },
//     data() {
//         return {
//             center: { lat: -6.246649, lng: 106.826431 },
//             data: [],
//             loading: true,
//             columns: [
//                 { field: "name", name: "Name" },
//                 { field: "address", name: "Alamat" },
//             ],
//             zoom: 11,
//         };
//     },
//     mounted() {
//         this.getData();
//     },
//     methods: {
//         async getData() {
//             this.loading = true;
//             try {
//                 const response = await this.$http.get(
//                     `${import.meta.env.VITE_API_URL}/collection-point`,
//                 );
//                 response.data.data.collection_points.forEach((point) => {
//                     this.data.push({
//                         name: point.name,
//                         address:
//                             point.address +
//                             ", " +
//                             point.subdistrict_name +
//                             ", " +
//                             point.district_name +
//                             ", " +
//                             point.city_name +
//                             ", " +
//                             point.province_name,
//                         latlong: point.latlong,
//                     });
//                 });

//                 if (this.data && this.data.length > 0) {
//                     const loc = this.data[0].latlong.split(",");
//                     this.center = [parseFloat(loc[0]), parseFloat(loc[1])];
//                 } else {
//                     this.center = [this.center.lat, this.center.lng];
//                 }
//             } catch (error) {
//                 this.center = [this.center.lat, this.center.lng];
//             } finally {
//                 this.loading = false;
//             }
//         },
//         getMarkerPosition(latlong) {
//             try {
//                 const loc = latlong.split(",");
//                 return [parseFloat(loc[0]), parseFloat(loc[1])];
//             } catch (error) {}
//             return null;
//         },
//     },
// };
</script>

<style lang="scss" scoped></style>
