import { createApp } from 'vue'
import { Icon } from '@iconify/vue';
import './style.css'
import './assets/fonts.css'
import './assets/styles.scss'
import App from './App.vue'
import "primeicons/primeicons.css";
import './assets/tailwind.css'
import router from './router'

import Lara from "@primeuix/themes/lara";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import DataTable from "primevue/datatable";
import Menu from "primevue/menu";
import Row from "primevue/row";
import ToastService from "primevue/toastservice";

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Lara
    }
})

app.use(ToastService);
app.use(ConfirmationService);
app.component("Icon", Icon);
app.component("Menu", Menu);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("Row", Row);

app.mount('#app')