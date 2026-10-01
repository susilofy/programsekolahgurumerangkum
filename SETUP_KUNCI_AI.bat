@echo off
title PENGATURAN KUNCI AI GOOGLE GEMINI - PROGRAMKU SD
color 1F

echo =====================================================================
echo          PENGATURAN KUNCI API GOOGLE GEMINI (AI ONLINE)
echo                   PROGRAMKU SD - APLIKASI DESKTOP
echo =====================================================================
echo.
echo Aplikasi PROGRAMKU SD dapat terhubung langsung ke kecerdasan buatan
echo Google Gemini untuk menyusun dan menganalisis program sekolah secara live.
echo.
echo CARA MENDAPATKAN KUNCI API GRATIS:
echo 1. Buka browser dan kunjungi: https://aistudio.google.com/app/apikey
echo 2. Masuk dengan akun Google/Gmail Anda.
echo 3. Klik tombol "Create API Key" lalu salin (Copy) kuncinya.
echo =====================================================================
echo.

set /p USER_KEY="Tempel (Paste) API Key Anda di sini lalu tekan ENTER: "

if "%USER_KEY%"=="" (
    echo.
    echo [INFO] Kunci API tidak diisi. Aplikasi akan tetap berjalan normal
    echo menggunakan Mesin AI Standar Kurikulum Merdeka (Mode Offline).
    echo.
    pause
    exit /b
)

:: Bersihkan spasi atau tanda kutip jika ada
set USER_KEY=%USER_KEY:"=%

:: Tulis ke file .env di folder ini
echo GEMINI_API_KEY=%USER_KEY% > .env

:: Tulis juga ke folder data_programku jika ada
if not exist data_programku mkdir data_programku
echo GEMINI_API_KEY=%USER_KEY% > data_programku\.env

:: Tulis juga ke dist-portable jika ada
if exist dist-portable (
    echo GEMINI_API_KEY=%USER_KEY% > dist-portable\.env
    if not exist dist-portable\data_programku mkdir dist-portable\data_programku
    echo GEMINI_API_KEY=%USER_KEY% > dist-portable\data_programku\.env
)

echo.
echo =====================================================================
echo [BERHASIL!] Kunci API Google Gemini Anda telah tersimpan dengan aman!
echo.
echo Sekarang fitur:
echo - "Buat Program dengan AI"
echo - "Analisis Mutu Program dengan AI"
echo - "Bantu AI Setiap Bagian"
echo Akan langsung menggunakan model tercanggih Google Gemini secara online.
echo =====================================================================
echo.
pause
