#!/bin/bash

# Make all app icons and favicons completely round
echo "🎨 Making all logos and icons completely round..."

cd /home/king/Desktop/Working_Site/my-turborepo/apps/react-app

# Function to create round icon
create_round_icon() {
    local input="$1"
    local output="$2"
    local size="$3"
    
    local radius=$((size / 2))
    local center=$((size / 2))
    
    convert "$input" \
        -resize ${size}x${size} \
        -gravity center \
        -extent ${size}x${size} \
        -background none \
        \( +clone -alpha extract -blur 0x1 -threshold 50% \) \
        -compose copy_opacity -composite \
        \( +clone -fill white -colorize 100% -fill black -draw "circle $center,$center $radius,0" \) \
        -alpha off -compose copy_opacity -composite \
        "$output"
}

# Array of icon sizes
icon_sizes=("48" "72" "96" "144" "192" "512")

# Create round app icons from the main logo
for size in "${icon_sizes[@]}"; do
    echo "Creating ${size}x${size} round icon..."
    create_round_icon "public/app-icons/yehc_logo.png" "public/app-icons/icon-${size}x${size}.png" "$size"
done

# Create round favicons
echo "Creating round favicons..."
create_round_icon "public/app-icons/yehc_logo.png" "public/favicon.png" "512"
create_round_icon "public/app-icons/yehc_logo.png" "public/favicon-32x32.png" "32"

# Create round favicon.ico
convert "public/favicon-32x32.png" "public/favicon.ico"

# Create round favicon.svg (using a simple approach)
cat > public/favicon.svg << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="circle">
      <circle cx="256" cy="256" r="256"/>
    </clipPath>
  </defs>
  <image href="/app-icons/yehc_logo.png" width="512" height="512" clip-path="url(#circle)"/>
</svg>
EOF

echo "✅ All icons are now completely round!"
echo "📱 Updated files:"
echo "   - All app icons (48x48 to 512x512)"
echo "   - favicon.png, favicon.ico, favicon-32x32.png"
echo "   - favicon.svg"
echo ""
echo "🎉 Your Young Eagles app now has consistent round branding!"

