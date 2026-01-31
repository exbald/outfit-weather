#!/bin/bash
# OutFitWeather - Environment Setup Script
# This script sets up and runs the development environment

set -e  # Exit on error

echo "🌤️  OutFitWeather - Environment Setup"
echo "======================================"
echo ""

# Check Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js 20+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Build the React app if needed
if [ ! -d "dist" ]; then
    echo "🔨 Building React app..."
    npm run build
    echo ""
fi

echo "🚀 Starting development server..."
echo ""
echo "The app will be available at:"
echo "  → Local:   http://localhost:5173"
echo "  → Network: http://$(hostname -I | awk '{print $1}'):5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev
