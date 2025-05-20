@echo off
echo Starting Shakti Margam Application...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js to run this application.
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo npm is not installed. Please install npm to run this application.
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing dependencies...
    npm install
    if %ERRORLEVEL% neq 0 (
        echo Failed to install dependencies.
        exit /b 1
    )
)

REM Check if .env file exists, create if not
if not exist .env (
    echo Creating .env file with default configuration...
    echo REACT_APP_API_URL=http://localhost:3001/api > .env
    echo REACT_APP_OPENAI_API_KEY=your_openai_api_key_here >> .env
    echo REACT_APP_PINECONE_API_KEY=your_pinecone_api_key_here >> .env
    echo REACT_APP_PINECONE_ENVIRONMENT=your_pinecone_environment_here >> .env
    echo REACT_APP_PINECONE_INDEX=your_pinecone_index_here >> .env
    echo.
    echo Please update the .env file with your actual API keys before proceeding.
    timeout /t 5
)

REM Start the application
echo Starting the application...
npm start

exit /b 0
