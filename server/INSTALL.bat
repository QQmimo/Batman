@ECHO OFF
ECHO "Download files:"
CALL git clone https://github.com/QQmimo/Batman.git

ECHO "Download dependencies:"
CD Batman
CD client
CALL npm i
CALL npm run build
CD ..
RMDIR /s /q client
CD server
CALL npm i
CD ..

ECHO "Prepare files:"
XCOPY .\server .. /Y /E
CD ..

ECHO "Delete temp-files:"
RMDIR /s /q Batman
DEL /s INSTALL.bat