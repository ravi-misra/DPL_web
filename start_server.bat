@echo off
@setlocal enableextensions
@cd /d "%~dp0"
set "params=%*"
cd /d "%~dp0" && ( if exist "%temp%\getadmin.vbs" del "%temp%\getadmin.vbs" ) && fsutil dirty query %systemdrive% 1>nul 2>nul || (  echo Set UAC = CreateObject^("Shell.Application"^) : UAC.ShellExecute "cmd.exe", "/k cd ""%~sdp0"" && %~s0 %params%", "", "runas", 1 >> "%temp%\getadmin.vbs" && "%temp%\getadmin.vbs" && exit /B )

start  "DB Server" "C:/Program Files/MongoDB/Server/5.0/bin/mongod.exe" --dbpath "D:/mongoDB_Data
start  "ODBC" "C:/Program Files/MongoDB/Connector for BI/2.14/bin/mongosqld.exe" --mongo-uri "mongodb://127.0.0.1:27017"
npm start