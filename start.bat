@echo off
setlocal
set APPDIR=%~dp0
cd /d %APPDIR%
echo =============================
echo   Iniciando SebaBiblio
set PATH=%APPDIR%\node_modules\.bin;%PATH%
if not exist node_modules (
  echo Instalando dependencias...
  call npm install
)
echo Lanzando aplicacion...
call npm start
if %ERRORLEVEL% neq 0 (
  echo Error al iniciar la aplicacion.
  pause
  exit /b %ERRORLEVEL%
)
echo =============================
echo   SebaBiblio finalizado
pause
endlocal
