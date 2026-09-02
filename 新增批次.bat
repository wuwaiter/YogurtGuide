@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "INPUT_FILE=%~dp0batch-input.txt"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 22.12 or later was not found.
  pause
  exit /b 1
)

node scripts\import-batch.mjs --prepare
if errorlevel 1 goto :end

echo.
echo batch-input.txt is ready.
echo Edit it, save with Ctrl+S, close Notepad, then press any key here.
start "" notepad.exe "%INPUT_FILE%"
pause

node scripts\import-batch.mjs --from-default
:end
echo.
pause
