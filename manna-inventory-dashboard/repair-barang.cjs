const fs = require('fs');
const path = 'c:\\\\Users\\\\dzaki alif\\\\OneDrive\\\\Documents\\\\PNJ\\\\skripsi\\\\App\\\\manna-inventory-dashboard\\\\manna-inventory-dashboard\\\\src\\\\pages\\\\barang\\\\Barang.vue';
let content = fs.readFileSync(path, 'utf8');

// 1. Imports
content = content.replace(/import Select from 'primevue\/select';/g, "import Select from 'primevue/select';\nimport CustomSelect from '@/components/CustomSelect.vue';\nimport RasaSelect from '@/components/RasaSelect.vue';");

// 2. Components
content = content.replace(/components: \{\s*Select,\s*\},/g, "components: {\n    Select,\n    CustomSelect,\n    RasaSelect,\n  },");

// 3. Remove rasaOptions from data
content = content.replace(/\s*rasaOptions:\s*\[\],/g, '');

// 4. Remove fetchRasaDropdown() from mounted
content = content.replace(/\s*this\.fetchRasaDropdown\(\),/g, '');

// 5. Remove fetchRasaDropdown method
content = content.replace(/\s*async fetchRasaDropdown\(\)\s*\{[\s\S]*?catch \(error\)\s*\{[\s\S]*?\}\s*\},/g, '');

// 6. Replace Selects manually using precise replace strings for each column to avoid regex matching across columns

// 6.1 Nama Barang
content = content.replace(/<Select\s+v-model="filterModel\.value"\s+:options="productOptions"[\s\S]*?emptyMessage: \{ class: '!text-black !bg-white' \},\s*\}\"\s*\/>/, 
  `<CustomSelect
            v-model="filterModel.value"
            :options="productOptions"
            optionLabel="label"
            optionValue="value"
            @change="filterCallback()"
            placeholder="Pilih nama barang"
            showClear
            filter
          />`);

// 6.2 Kategori
content = content.replace(/<Select\s+v-model="filterModel\.value"\s+:options="kategoriOptions"[\s\S]*?emptyMessage: \{ class: '!text-black !bg-white' \},\s*\}\"\s*\/>/, 
  `<CustomSelect
            v-model="filterModel.value"
            :options="kategoriOptions"
            optionLabel="name"
            optionValue="categoryId"
            @change="filterCallback()"
            placeholder="Pilih kategori"
            showClear
            filter
          />`);

// 6.3 Ukuran
content = content.replace(/<Select\s+v-model="filterModel\.value"\s+:options="ukuranOptions"[\s\S]*?emptyMessage: \{ class: '!text-black !bg-white' \},\s*\}\"\s*\/>/, 
  `<CustomSelect
            v-model="filterModel.value"
            :options="ukuranOptions"
            optionLabel="label"
            optionValue="value"
            @change="filterCallback()"
            placeholder="Pilih ukuran"
            showClear
            filter
          />`);

// 6.4 Satuan
content = content.replace(/<Select\s+v-model="filterModel\.value"\s+:options="satuanOptions"[\s\S]*?emptyMessage: \{ class: '!text-black !bg-white' \},\s*\}\"\s*\/>/, 
  `<CustomSelect
            v-model="filterModel.value"
            :options="satuanOptions"
            optionLabel="label"
            optionValue="value"
            @change="filterCallback()"
            placeholder="Pilih satuan"
            showClear
          />`);

// 6.5 Rasa
content = content.replace(/<Select\s+v-model="filterModel\.value"\s+:options="rasaOptions"[\s\S]*?emptyMessage: \{ class: '!text-black !bg-white' \},\s*\}\"\s*\/>/, 
  `<RasaSelect
            v-model="filterModel.value"
            @change="filterCallback()"
            placeholder="Pilih rasa"
            showClear
            filter
          />`);

fs.writeFileSync(path, content, 'utf8');
console.log('Barang.vue repaired!');
