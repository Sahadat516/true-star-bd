#!/bin/bash
echo "============================================"
echo "  TRUE STAR BD LIMITED - Setup Script"
echo "  Premium Digital Marketplace"
echo "============================================"
echo ""

echo "[1/3] Installing dependencies..."
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
cd ai-service && npm install && cd ..

echo ""
echo "[2/3] Setting up database..."
cd backend
npx prisma generate
npx prisma db push
npx prisma db seed
cd ..

echo ""
echo "[3/3] Setup Complete!"
echo ""
echo "To start the project:"
echo "  Option 1 - Docker: docker-compose up"
echo "  Option 2 - Manual (3 terminals):"
echo "    Terminal 1: cd backend && npm run dev"
echo "    Terminal 2: cd frontend && npm run dev"
echo "    Terminal 3: cd ai-service && npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "Login Credentials:"
echo "  Admin:    admin@truestarbd.com / admin123"
echo "  Customer: customer@truestarbd.com / admin123"
echo "  Vendor:   vendor1@truestarbd.com / admin123"
echo "  Staff:    staff@truestarbd.com / admin123"
