const fs = require('fs');
const path = 'c:\\\\Users\\\\dzaki alif\\\\OneDrive\\\\Documents\\\\PNJ\\\\skripsi\\\\App\\\\manna-inventory-dashboard\\\\manna-inventory-dashboard\\\\src\\\\pages\\\\barang\\\\Barang.vue';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/import Select from 'primevue\/select';/g, "import Select from 'primevue/select';\nimport CustomSelect from '@/components/CustomSelect.vue';");

content = content.replace(/components: \{\s*Select,\s*\},/g, "components: {\n    Select,\n    CustomSelect,\n  },");

// Replace all Select components inside template #filter
const selectRegex = /<Select([\s\S]*?):pt="\{[\s\S]*?\}"([\s\S]*?)\/>/g;
content = content.replace(selectRegex, (match, p1, p2) => {
  let inner = p1 + p2;
  inner = inner.replace(/class="font-farro"\s*/g, '');
  return `<CustomSelect${inner}/>`;
});

// Remove the global style block that was added
content = content.replace(/<style lang="scss">\s*\/\* Global styles[\s\S]*?<\/style>\s*/g, '');

// Clean up the scoped style block
content = content.replace(/:deep\(\.p-select\.p-focus\),\s*:deep\(\.p-dropdown\.p-focus\)\s*\{[\s\S]*?\}\s*/g, '');

fs.writeFileSync(path, content, 'utf8');
console.log('Done');
