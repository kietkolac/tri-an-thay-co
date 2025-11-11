@echo off
title Tri An Thay Co 20/11 - Localhost
echo.
echo  =================================================
echo  Dang khoi dong web tai: http://127.0.0.1:8080
echo  Thu muc: C:\Users\TheCheemsVN\Documents\my-first-website\src
echo  =================================================
echo.
echo  Neu trinh duyet khong tu mo, vui long truy cap:
echo  ---> http://127.0.0.1:8080 <---
echo.
cd /d "C:\Users\TheCheemsVN\Documents\my-first-website\src"
python -m http.server 8080
pause