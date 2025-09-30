@echo off
setlocal
set APPDIR=%~dp0
cd /d %APPDIR%
echo =============================
echo   Actualizando SebaBiblio
set PATH=%APPDIR%\node_modules\.bin;%PATH%
if not exist node_modules (
  echo Instalando dependencias...
  call npm install
)
echo Obteniendo última versión...
git pull origin main
if %ERRORLEVEL% neq 0 (
  echo Error al actualizar desde GitHub.
  pause
  exit /b %ERRORLEVEL%
)
echo Generando instalador .exe...
call npx electron-builder --win --x64
if %ERRORLEVEL% neq 0 (
  echo Error al generar el instalador.
  pause
  exit /b %ERRORLEVEL%
)
echo =============================
echo   Instalador generado en /dist
pause
endlocal
