@echo off
echo ============================================
echo   TRUE STAR BD LIMITED - Setup Script
echo   Premium Digital Marketplace
echo ============================================
echo.

echo [1/5] Installing root dependencies...
echo.

echo [2/5] Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo.

echo [3/5] Installing backend dependencies...
cd backend
call npm install
cd ..
echo.

echo [4/5] Installing AI service dependencies...
cd ai-service
call npm install
cd ..
echo.

echo [5/5] Setting up database...
cd backend
call npx prisma generate
call npx prisma db push
call npx prisma db seed
cd ..
echo.

echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo To start the project:
echo   Option 1 - All services (requires Docker):
echo     docker-compose up
echo.
echo   Option 2 - Manual start (3 terminals):
echo     Terminal 1: cd backend ^&^& npm run dev
echo     Terminal 2: cd frontend ^&^& npm run dev
echo     Terminal 3: cd ai-service ^&^& npm run dev
echo.
echo   Then open: http://localhost:3000
echo.
echo   Login Credentials:
echo   Admin:    admin@truestarbd.com / admin123
echo   Customer: customer@truestarbd.com / admin123
echo   Vendor:   vendor1@truestarbd.com / admin123
echo   Staff:    staff@truestarbd.com / admin123
echo.
pause
