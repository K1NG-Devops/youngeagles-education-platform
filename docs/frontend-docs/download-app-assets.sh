#!/bin/bash
echo "📦 Creating downloadable app assets package..."

# Create assets package
mkdir -p young-eagles-app-assets
cp -r public/app-icons young-eagles-app-assets/
cp -r public/screenshots young-eagles-app-assets/
cp public/manifest.json young-eagles-app-assets/
cp public/Mobile_App_Conversion_Guide.md young-eagles-app-assets/

# Create README for assets
cat > young-eagles-app-assets/README.md << 'ASSETS_EOF'
# Young Eagles App Assets

This package contains all the assets needed to deploy the Young Eagles app to mobile app stores.

## Contents

### App Icons (`app-icons/`)
- `icon-48x48.png` to `icon-512x512.png` - Various sized app icons
- `adaptive-icon.png` - Android adaptive icon
- `feature-graphic-1024x500.png` - Google Play Store feature graphic
- `icon-template.svg` - Source SVG file (editable)

### Screenshots (`screenshots/`)
- Mobile app screenshots for store listings
- Recommended sizes: 390x844 (iPhone), 360x640 (Android)

### Configuration
- `manifest.json` - PWA manifest file
- `Mobile_App_Conversion_Guide.md` - Complete deployment guide

## Usage Instructions

1. Use app icons for your mobile app build process
2. Upload screenshots to app store listings
3. Follow the conversion guide for deployment
4. Customize the manifest.json as needed

## Icon Specifications

### Google Play Store
- High-res icon: 512x512 PNG
- Feature graphic: 1024x500 PNG
- Screenshots: 16:9 or 9:16 ratio

### Apple App Store
- App icon: 1024x1024 PNG
- Screenshots: Various iPhone/iPad sizes

## Need Help?

Refer to the Mobile_App_Conversion_Guide.md for detailed instructions.
ASSETS_EOF

# Create ZIP archive
if command -v zip &> /dev/null; then
    zip -r young-eagles-app-assets.zip young-eagles-app-assets/
    echo "✅ Created young-eagles-app-assets.zip"
else
    tar -czf young-eagles-app-assets.tar.gz young-eagles-app-assets/
    echo "✅ Created young-eagles-app-assets.tar.gz"
fi

echo "📱 App assets package ready for download!"
