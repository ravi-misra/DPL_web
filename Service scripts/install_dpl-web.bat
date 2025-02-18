nssm install dpl-web C:\DPL_web\start_server.bat
nssm set dpl-web AppDirectory C:\DPL_web
nssm set dpl-web Description "Web server for Digital Potline"
nssm set dpl-web DisplayName "dpl-web"
nssm set dpl-web Start SERVICE_DELAYED_AUTO_START
