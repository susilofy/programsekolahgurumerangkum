# PANDUAN LENGKAP APLIKASI PORTABEL (PROGRAMKU SD)

Dokumen ini menjelaskan cara menghasilkan file **`PROGRAMKU_SD_PORTABEL.exe`** dan menjalankannya langsung dari **Flashdisk** di komputer Windows mana saja tanpa perlu instalasi.

---

## 📁 Berkas Portabel yang Sudah Disediakan

Di dalam proyek ini telah disiapkan seluruh instrumen yang dibutuhkan:
1. **`electron/main.cjs`**: Peluncur desktop Electron yang otomatis mengarahkan penyimpanan data ke folder `data_programku/` di flashdisk dan memuat modul AI (Online Gemini & Offline Smart Generator).
2. **`build-portable.bat`**: Skrip otomatis 1-klik untuk mengunduh modul dan membuat file `.exe`.
3. **`SETUP_KUNCI_AI.bat`**: Alat bantu interaktif 1-klik untuk memasukkan kunci API Google Gemini gratis ke flashdisk.
4. **`JALANKAN_PROGRAMKU.bat`**: Alternatif menjalankan aplikasi langsung di browser lokal.

---

## 🚀 Langkah Membuat File `.exe` Portabel (Untuk Flashdisk)

1. **Pastikan Node.js Terpasang**:
   - Jika belum ada di laptop Anda, unduh dan pasang versi LTS dari [https://nodejs.org](https://nodejs.org).
2. **Jalankan Skrip Otomatis**:
   - Cukup klik 2x berkas **`build-portable.bat`**.
   - Skrip akan otomatis mengompilasi proyek dan membuat file executable.
3. **Hasil File**:
   - Buka folder `dist-portable/`.
   - Di dalamnya sudah tersedia:
     - 📄 **`PROGRAMKU_SD_PORTABEL.exe`** (Aplikasi Utama)
     - ⚙️ **`SETUP_KUNCI_AI.bat`** (Pengatur Kunci AI Otomatis)
     - 🔐 **`.env`** (File Kunci API)

---

## 💾 Cara Menggunakan di Flashdisk

1. **Salin ke Flashdisk**:
   - Salin isi folder **`dist-portable/`** ke dalam flashdisk Anda (misalnya di drive `E:\`).
2. **Jalankan di Komputer Mana Saja**:
   - Tancapkan flashdisk ke laptop/komputer mana pun (Windows 10 atau Windows 11).
   - Klik 2x file **`PROGRAMKU_SD_PORTABEL.exe`**.
3. **Penyimpanan Data Otomatis**:
   - Saat pertama kali dijalankan di flashdisk, aplikasi otomatis membuat folder:
     📂 **`data_programku/`** di samping file `.exe`.
   - Seluruh profil sekolah (**SD Negeri 3 Loloan Timur**), gambar **KOP Surat**, **Logo**, daftar guru, dan draf program kegiatan akan **tersimpan 100% di dalam flashdisk**.

---

## 🤖 Pengaturan Fitur AI (Online & Offline)

Aplikasi memiliki 2 mode AI:
1. **Mode Offline (Otomatis & Tanpa Internet)**:
   - Jika komputer tidak terhubung ke internet atau belum memiliki API key, tombol **"✨ Buat Program dengan AI"** dan **"🔍 Analisis Program dengan AI"** tetap dapat diklik dan langsung menghasilkan draf program lengkap 13 bab standar Kurikulum Merdeka menggunakan mesin generator cerdas internal.
2. **Mode Online (Google Gemini Asli)**:
   - Dapatkan kunci API gratis di: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
   - Di flashdisk Anda, cukup klik 2x file **`SETUP_KUNCI_AI.bat`** lalu tempel (Paste) kunci API Anda.
   - Aplikasi akan otomatis beralih menggunakan model kecerdasan buatan Google Gemini tercanggih secara live.
