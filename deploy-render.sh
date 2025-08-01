#!/bin/bash

# Render Deployment Script for Live Polling System
# This script helps prepare your application for Render deployment

echo "🚀 Preparing Live Polling System for Render Deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git and push to GitHub first."
    echo "Run these commands:"
    echo "  git init"
    echo "  git add ."
    echo "  git commit -m 'Initial commit'"
    echo "  git remote add origin <your-github-repo-url>"
    echo "  git push -u origin main"
    exit 1
fi

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found. Please ensure the file exists."
    exit 1
fi

# Check if all package.json files exist
if [ ! -f "package.json" ] || [ ! -f "server/package.json" ] || [ ! -f "client/package.json" ]; then
    echo "❌ Missing package.json files. Please ensure all package.json files exist."
    exit 1
fi

echo "✅ All required files found!"

# Check if dependencies are installed
echo "📦 Checking dependencies..."

if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "Installing server dependencies..."
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "Installing client dependencies..."
    cd client && npm install && cd ..
fi

echo "✅ Dependencies installed!"

# Test build process
echo "🔨 Testing build process..."

# Test client build
echo "Building client..."
cd client
if npm run build; then
    echo "✅ Client build successful!"
else
    echo "❌ Client build failed!"
    exit 1
fi
cd ..

echo ""
echo "🎉 Your application is ready for Render deployment!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for Render deployment'"
echo "   git push"
echo ""
echo "2. Go to https://render.com and sign up/login"
echo ""
echo "3. Click 'New +' and select 'Blueprint'"
echo ""
echo "4. Connect your GitHub account and select this repository"
echo ""
echo "5. Render will automatically detect render.yaml and deploy both services"
echo ""
echo "6. After deployment, update the environment variables with the actual URLs:"
echo "   - Backend: Update CLIENT_URL to point to your frontend URL"
echo "   - Frontend: Update REACT_APP_SERVER_URL to point to your backend URL"
echo ""
echo "Your application will be available at:"
echo "   Frontend: https://live-polling-frontend.onrender.com"
echo "   Backend: https://live-polling-backend.onrender.com"
echo ""
echo "📖 For detailed instructions, see RENDER_DEPLOYMENT.md" 