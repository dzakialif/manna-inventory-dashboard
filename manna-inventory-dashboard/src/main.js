import { createApp } from 'vue'
import { Icon } from '@iconify/vue';
import './style.css'
import './assets/fonts.css'
import './assets/styles.scss'
import App from './App.vue'
import "primeicons/primeicons.css";
import './assets/tailwind.css'
import router from './router'
import { api } from './utils/api';

import Lara from "@primeuix/themes/lara";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import DataTable from "primevue/datatable";
import Menu from "primevue/menu";
import Row from "primevue/row";
import ToastService from "primevue/toastservice";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";

const app = createApp(App)

app.config.globalProperties.$http = api;

app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Lara,
        options: {
            darkModeSelector: '.app-dark'
        }
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
app.component("Dialog", Dialog);
app.component("Button", Button);
app.component("InputText", InputText);
app.component("IconField", IconField);
app.component("InputIcon", InputIcon);
app.component("Tabs", Tabs);
app.component("TabList", TabList);
app.component("Tab", Tab);
app.component("TabPanels", TabPanels);
app.component("TabPanel", TabPanel);

app.mount('#app')