const fs = require('fs');
const path = 'c:\\\\Users\\\\dzaki alif\\\\OneDrive\\\\Documents\\\\PNJ\\\\skripsi\\\\App\\\\manna-inventory-dashboard\\\\manna-inventory-dashboard\\\\src\\\\pages\\\\barang\\\\Barang.vue';
let content = fs.readFileSync(path, 'utf8');

// 1. Import RasaSelect
content = content.replace(/import CustomSelect from '@\/components\/CustomSelect.vue';/g, "import CustomSelect from '@/components/CustomSelect.vue';\nimport RasaSelect from '@/components/RasaSelect.vue';");

// 2. Add to components
content = content.replace(/components: \{\s*Select,\s*CustomSelect,\s*\},/g, "components: {\n    Select,\n    CustomSelect,\n    RasaSelect,\n  },");

// 3. Remove rasaOptions from data
content = content.replace(/\s*rasaOptions:\s*\[\],/g, '');

// 4. Remove fetchRasaDropdown() from mounted
content = content.replace(/\s*this\.fetchRasaDropdown\(\),/g, '');

// 5. Remove fetchRasaDropdown method
content = content.replace(/\s*async fetchRasaDropdown\(\)\s*\{[\s\S]*?catch \(error\)\s*\{[\s\S]*?\}\s*\},/g, '');

// 6. Replace CustomSelect with RasaSelect for rasa filter
const rasaRegex = /<CustomSelect([\s\S]*?:options="rasaOptions"[\s\S]*?optionLabel="label"[\s\S]*?optionValue="value"[\s\S]*?)placeholder="Pilih rasa"([\s\S]*?)\/>/g;
content = content.replace(rasaRegex, (match, p1, p2) => {
  return `<RasaSelect
            v-model="filterModel.value"
            @change="filterCallback()"
            placeholder="Pilih rasa"
            showClear
            filter
          />`;
});

fs.writeFileSync(path, content, 'utf8');
console.log('Barang.vue done');
