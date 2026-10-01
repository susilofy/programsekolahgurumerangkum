@echo off
title PELUNCUR PROGRAMKU SD
color 2F

echo =====================================================================
echo                PROGRAMKU SD - APLIKASI STANDALONE
echo =====================================================================
echo.
echo Memulai server aplikasi lokal...
echo Tunggu sebentar, aplikasi akan otomatis terbuka di browser...
echo.

:: Jalankan server lokal di latar belakang dan buka browser
start "" http://localhost:3000
npm run dev

pause
