@ECHO OFF

ECHO "Create backup:"
XCOPY .\Data\* .\Backup\* /Y /E

ECHO "Download files:"
winget install --id Git.Git -e --source winget
CALL git clone https://github.com/QQmimo/Batman.git

ECHO "Download dependencies:"
CD Batman
CD client
CALL npm i
CALL npm run build
CD ..
RMDIR /s /q client

ECHO "Apply new files:"
XCOPY .\server .. /Y /E
CD ..
XCOPY .\Backup\* .\Data\* /Y /E

ECHO "Delete temp-files:"
RMDIR /s /q Batman
RMDIR /s /q install.bat