cd /d %~dp0
.\nssm.exe start dpl-web
.\nssm.exe status dpl-web
echo "Press any key to continue..."
pause