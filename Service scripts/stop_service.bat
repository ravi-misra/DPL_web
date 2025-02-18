cd /d %~dp0
.\nssm.exe stop dpl-web
.\nssm.exe status dpl-web
echo "Press any key to continue..."
pause