# DPL_web

Packaging and moving the application

1. To run puppeteer on without installing over internet, we need to move its .cache directory to the target station along with all the node_modules
2. Puppeteer .cache file in normally located in the HOME directory (windows => %userprofile%)
3. In windows set the follwing environment variables(if using nssm to create a service you can paste the environment variables in the Environment tab also)
   (Note: %~dp0 returns the path to current directory where script is running alongwith the trailing backslash)
   //Set Puppeteer's custom cache directory
   set PUPPETEER_CACHE_DIR=%~dp0.cache\puppeteer

//Prevent Puppeteer from downloading Chromium
set PUPPETEER_SKIP_DOWNLOAD=true

//Set Chromium executable explicitly
set PUPPETEER_EXECUTABLE_PATH=%PUPPETEER_CACHE_DIR%\chrome\win64-<version>\chrome-win64\chrome.exe

where version => the chrome version number in the .cache directory
