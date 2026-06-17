# Prompt: Revamp UI/UX Dialog Profil User

Gunakan instruksi berikut untuk memperbaiki tampilan pop-up (Dialog) Data User di file `AppTopbar.vue`:

## Tujuan
Membuat tampilan *User Profile Dialog* menjadi lebih modern, elegan, dan *user-friendly* dengan mempertahankan fungsionalitas yang ada (menggunakan PrimeVue dan TailwindCSS).

## Instruksi Perbaikan UI/UX

1. **Tambahkan Header Profil (User Card) yang Menarik**
   - Sebelum komponen `<Tabs>`, tambahkan sebuah *card* atau area *header* kecil yang menampilkan Icon User (`pi pi-user`), Nama User, dan Email.
   - Buat latar belakang area ini menggunakan gradien yang elegan (misalnya `bg-gradient-to-r from-primary/10 to-primary/5`) atau *glassmorphism* agar terlihat *premium*.
   - Letakkan Icon User di dalam lingkaran (seperti *avatar placeholder*) dengan warna *primary* yang menonjol.

2. **Perbaiki Tampilan Form (Edit Profil)**
   - Tambahkan *IconField* dan *InputIcon* pada setiap *input* di form "Edit Profil" (misalnya `pi-user` untuk Nama Lengkap, `pi-phone` untuk Nomor Handphone, dan `pi-envelope` untuk Email) agar konsisten dengan form Kata Sandi.
   - Berikan *styling* yang lebih modern pada input, seperti *border* transparan saat *idle*, dan efek *ring* atau warna spesifik saat *focus*.
   - Khusus untuk input Email yang bersifat *readonly*, berikan visual yang mengindikasikan bahwa *field* tersebut tidak bisa diubah (misalnya `bg-gray-100` atau `opacity-70`).

3. **Perbaiki Tampilan Form (Edit Kata Sandi)**
   - Pertahankan fitur visibilitas kata sandi (ikon mata), namun perbaiki proporsi spasi (padding/margin) antar input.
   - Berikan teks peringatan atau instruksi kata sandi dengan desain yang lebih *subtle* (contoh: ukuran teks `text-xs`, warna `text-gray-500`, dan ikon info `pi-info-circle`).

4. **Poles Tombol Aksi (Batal & Simpan)**
   - Letakkan tombol aksi di bagian bawah form dengan *alignment* ke kanan (`justify-end`).
   - Pastikan tombol "Simpan" menggunakan warna *primary* atau gradien yang selaras dengan tema aplikasi, dan tombol "Batal" memiliki *style* *outline* atau *text-only* agar tidak mengganggu fokus.
   - Tambahkan animasi *hover* (seperti `hover:scale-105` atau transisi warna) pada tombol.

5. **Penyesuaian Gaya PrimeVue & Tailwind**
   - Hapus garis tepi (border) bawaan PrimeVue pada *Tabs* jika dirasa terlalu kaku.
   - Berikan *padding* yang cukup (`p-2` atau `p-4`) di dalam `TabPanel` agar elemen tidak terlihat terlalu sesak.
   - Pastikan tipografi konsisten menggunakan kelas *font* yang sudah ada (misalnya `font-farro`).

## Catatan
Terapkan semua perubahan langsung ke dalam file `src/layouts/AppTopbar.vue` di blok `<Dialog header="Akun">`. Pastikan tidak ada fungsi atau alur logika (seperti validasi, state form, atau pemanggilan API) yang rusak akibat perubahan tampilan ini.
