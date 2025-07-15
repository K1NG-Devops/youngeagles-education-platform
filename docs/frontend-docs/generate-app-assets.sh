#!/bin/bash

# Young Eagles App Asset Generator
# Generates app icons and screenshots for mobile app deployment

echo "🎨 Generating Young Eagles App Assets..."

# Create directories
mkdir -p public/app-icons public/screenshots

# App Icon Sizes (Android)
ICON_SIZES=("48" "72" "96" "144" "192" "512")

# Create SVG icon without white background
cat > public/app-icons/icon-template.svg << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradient Background Circle -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="eagleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#F0F9FF;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background Circle -->
  <circle cx="256" cy="256" r="240" fill="url(#bgGradient)" stroke="#1E40AF" stroke-width="8"/>
  
  <!-- Eagle Silhouette -->
  <g transform="translate(256,256)">
    <!-- Eagle Body -->
    <ellipse cx="0" cy="20" rx="40" ry="80" fill="url(#eagleGradient)"/>
    
    <!-- Eagle Head -->
    <circle cx="0" cy="-60" r="35" fill="url(#eagleGradient)"/>
    
    <!-- Eagle Beak -->
    <path d="M 35,-60 L 50,-55 L 35,-50 Z" fill="#FCD34D"/>
    
    <!-- Eagle Wings -->
    <path d="M -40,0 Q -100,-20 -120,-5 Q -90,10 -40,20 Z" fill="url(#eagleGradient)"/>
    <path d="M 40,0 Q 100,-20 120,-5 Q 90,10 40,20 Z" fill="url(#eagleGradient)"/>
    
    <!-- Eagle Eye -->
    <circle cx="10" cy="-65" r="3" fill="#1F2937"/>
  </g>
  
  <!-- Book/Homework Icon -->
  <g transform="translate(256,380)">
    <rect x="-30" y="-15" width="60" height="30" rx="5" fill="#FFFFFF" stroke="#1E40AF" stroke-width="2"/>
    <line x1="-20" y1="-8" x2="20" y2="-8" stroke="#3B82F6" stroke-width="2"/>
    <line x1="-20" y1="0" x2="20" y2="0" stroke="#3B82F6" stroke-width="2"/>
    <line x1="-20" y1="8" x2="10" y2="8" stroke="#3B82F6" stroke-width="2"/>
  </g>
  
  <!-- App Name -->
  <text x="256" y="450" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF">YOUNG EAGLES</text>
</svg>
EOF

echo "📱 Generated base SVG icon"

# Generate PNG icons using ImageMagick (if available)
if command -v convert &> /dev/null; then
    echo "🔄 Converting SVG to PNG icons..."
    
    for size in "${ICON_SIZES[@]}"; do
        convert public/app-icons/icon-template.svg -resize ${size}x${size} public/app-icons/icon-${size}x${size}.png
        echo "✅ Generated ${size}x${size} icon"
    done
    
    # Generate adaptive icon (Android 8+)
    convert public/app-icons/icon-template.svg -resize 108x108 public/app-icons/adaptive-icon.png
    echo "✅ Generated adaptive icon"
    
    # Generate feature graphic for Play Store
    cat > public/app-icons/feature-graphic.svg << 'EOF'
<svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6"/>
      <stop offset="50%" style="stop-color:#8B5CF6"/>
      <stop offset="100%" style="stop-color:#EC4899"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1024" height="500" fill="url(#bgGrad)"/>
  
  <!-- App Icon -->
  <circle cx="200" cy="250" r="100" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="4"/>
  
  <!-- Eagle in Circle -->
  <g transform="translate(200,250) scale(1.5)">
    <ellipse cx="0" cy="10" rx="25" ry="50" fill="white"/>
    <circle cx="0" cy="-35" r="20" fill="white"/>
    <path d="M 20,-35 L 30,-32 L 20,-30 Z" fill="#FCD34D"/>
    <path d="M -25,0 Q -60,-15 -75,-5 Q -55,5 -25,10 Z" fill="white"/>
    <path d="M 25,0 Q 60,-15 75,-5 Q 55,5 25,10 Z" fill="white"/>
    <circle cx="6" cy="-38" r="2" fill="#1F2937"/>
  </g>
  
  <!-- Title Text -->
  <text x="400" y="200" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white">Young Eagles</text>
  <text x="400" y="280" font-family="Arial, sans-serif" font-size="32" fill="rgba(255,255,255,0.9)">Homework Helper</text>
  <text x="400" y="320" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.8)">Interactive learning for students</text>
  
  <!-- Features -->
  <g transform="translate(400,360)">
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="18" fill="white">📚 Interactive Activities</text>
    <text x="0" y="30" font-family="Arial, sans-serif" font-size="18" fill="white">📤 Easy File Upload</text>
    <text x="300" y="0" font-family="Arial, sans-serif" font-size="18" fill="white">📊 Progress Tracking</text>
    <text x="300" y="30" font-family="Arial, sans-serif" font-size="18" fill="white">🎮 Fun Learning Games</text>
  </g>
</svg>
EOF
    
    # Convert feature graphic
    convert public/app-icons/feature-graphic.svg public/app-icons/feature-graphic-1024x500.png
    echo "✅ Generated feature graphic"
    
else
    echo "⚠️  ImageMagick not found. Please install it to generate PNG icons:"
    echo "   Ubuntu/Debian: sudo apt install imagemagick"
    echo "   macOS: brew install imagemagick"
    echo "   Or use online SVG to PNG converters"
fi

# Create favicon
cp public/app-icons/icon-template.svg public/favicon.svg

# Generate manifest.json for PWA
cat > public/manifest.json << 'EOF'
{
  "name": "Young Eagles - Homework Helper",
  "short_name": "Young Eagles",
  "description": "Interactive homework app for students with activities, file uploads, and progress tracking",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#3B82F6",
  "theme_color": "#3B82F6",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "en",
  "icons": [
    {
      "src": "/app-icons/icon-48x48.png",
      "sizes": "48x48",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/app-icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/app-icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/app-icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/app-icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/app-icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["education", "productivity"],
  "screenshots": [
    {
      "src": "/screenshots/homework-list.png",
      "sizes": "390x844",
      "type": "image/png",
      "platform": "mobile",
      "label": "Homework List View"
    },
    {
      "src": "/screenshots/interactive-activity.png",
      "sizes": "390x844",
      "type": "image/png",
      "platform": "mobile",
      "label": "Interactive Learning Activity"
    }
  ]
}
EOF

echo "✅ Generated PWA manifest"

# Create asset download script
cat > download-app-assets.sh << 'EOF'
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
ASSSETS_EOF

# Create ZIP archive
if command -v zip &> /dev/null; then
    zip -r young-eagles-app-assets.zip young-eagles-app-assets/
    echo "✅ Created young-eagles-app-assets.zip"
else
    tar -czf young-eagles-app-assets.tar.gz young-eagles-app-assets/
    echo "✅ Created young-eagles-app-assets.tar.gz"
fi

echo "📱 App assets package ready for download!"
EOF

chmod +x download-app-assets.sh

echo "🎉 App asset generation complete!"
echo "📁 Generated files:"
echo "   - public/app-icons/ (app icons)"
echo "   - public/manifest.json (PWA manifest)"
echo "   - public/Mobile_App_Conversion_Guide.md (guide)"
echo "   - download-app-assets.sh (package creator)"
echo ""
echo "🚀 Next steps:"
echo "   1. Run: ./download-app-assets.sh"
echo "   2. Download the generated assets package"
echo "   3. Follow the Mobile App Conversion Guide"

