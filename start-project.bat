@echo off
REM Kill processes on ports 3000 and 3001
for %%p in (3000 3001) do (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%p ^| findstr LISTENING') do (
        echo Killing process on port %%p with PID %%a
        taskkill /PID %%a /F
    )
)

REM Clean Next.js build cache
if exist .next (
    echo Deleting .next build cache...
    rmdir /s /q .next
)

REM Start Next.js in dev mode
start cmd /k "npm run dev"

REM Start socket server
cd socket
start cmd /k "node server.js"

echo All done! Two new terminals should open for Next.js and the socket server.
pause