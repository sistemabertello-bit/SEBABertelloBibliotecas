@echo off
echo Construyendo SebaBiblio (portable exe)
call npm install
npx electron-builder --win portable --x64 --ia32 --publish never
pause
