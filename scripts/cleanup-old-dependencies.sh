#!/bin/bash

# Cleanup Script: Remove Firebase and Cloudinary
# Run this ONLY after confirming Bunny migration works!

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Cleanup: Remove Firebase & Cloudinary Dependencies       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Confirm before proceeding
read -p "Have you tested your website and confirmed everything works? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Cleanup cancelled. Test your website first!"
    exit 1
fi

echo ""
echo "📦 Removing npm packages..."
npm uninstall firebase @cloudinary/base @cloudinary/react cloudinary cloudinary-video-player

echo ""
echo "🗑️  Removing Firebase utility file..."
rm -f utils/firebase.utils.js

echo ""
echo "✅ Dependencies removed!"
echo ""
echo "Next steps:"
echo "1. Remove Firebase env variables from .env.local"
echo "2. Remove Cloudinary env variables from .env.local"
echo "3. Commit your changes to Git"
echo ""
