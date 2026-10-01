@echo off
title MEMBUAT APLIKASI PORTABEL PROGRAMKU SD (.EXE)
color 1F

echo =====================================================================
echo           PEMBUAT APLIKASI PORTABEL PROGRAMKU SD (.EXE)
echo           SD NEGERI 3 LOLOAN TIMUR - JEMBRANA, BALI
echo =====================================================================
echo.
echo Sedang menyiapkan berkas dan mengompilasi aplikasi...
echo.

:: 1. Periksa apakah Node.js terpasang
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js belum terpasang di komputer ini!
    echo Silakan unduh dan pasang Node.js terlebih dahulu di: https://nodejs.org
    echo.
    pause
    exit /b
)

:: 2. Pasang dependensi aplikasi dengan legacy-peer-deps agar tidak bentrok versi
echo [1/3] Memeriksa dan memasang dependensi aplikasi...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo.
    echo [INFO] Mencoba pemasangan dengan opsi --force...
    call npm install --force
)

:: 3. Pasang electron & electron-builder
echo.
echo Memasang modul Electron Portable...
call npm install --save-dev electron electron-builder --legacy-peer-deps

:: 4. Jalankan proses build ke format Portable Windows
echo.
echo [2/3] Membangun antarmuka web (Vite Build)...
call npm run build

echo.
echo [3/3] Membungkus menjadi PROGRAMKU_SD_PORTABEL.exe...
call npx electron-builder --win portable

:: 5. Salin skrip pengaturan kunci AI dan file .env ke folder keluaran
if exist dist-portable (
    if exist SETUP_KUNCI_AI.bat (
        copy /Y SETUP_KUNCI_AI.bat dist-portable\SETUP_KUNCI_AI.bat >nul
    )
    if exist .env (
        copy /Y .env dist-portable\.env >nul
    ) else (
        echo GEMINI_API_KEY= > dist-portable\.env
    )
)

echo.
echo =====================================================================
echo [SUKSES!] File portabel berhasil dibuat!
echo.
echo Lokasi Berkas di Komputer Anda:
echo 1. dist-portable\PROGRAMKU_SD_PORTABEL.exe  (Aplikasi Utama)
echo 2. dist-portable\SETUP_KUNCI_AI.bat       (Pengatur Kunci AI Otomatis)
echo 3. dist-portable\.env                    (Berkas Kunci API)
echo.
echo PETUNJUK PENGGUNAAN DI FLASHDISK:
echo 1. Salin isi folder 'dist-portable\' ke dalam Flashdisk Anda.
echo 2. Jika ingin AI Online aktif, klik 2x 'SETUP_KUNCI_AI.bat' di flashdisk
echo    dan masukkan kunci Google Gemini gratis Anda.
echo 3. Klik 2x 'PROGRAMKU_SD_PORTABEL.exe' untuk menjalankan aplikasi!
echo =====================================================================
echo.
pause
