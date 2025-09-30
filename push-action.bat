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
echo Generando artefacto ejecutable...
call npm run build-windows
if %ERRORLEVEL% neq 0 (
  echo Error al generar el artefacto.
  pause
  exit /b %ERRORLEVEL%
)
echo =============================
echo   Actualización y build finalizados
pause
endlocal
