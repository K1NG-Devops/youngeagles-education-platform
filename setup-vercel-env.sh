#!/bin/bash

# Setup Vercel Environment Variables for AdSense
echo "Setting up Vercel environment variables..."

vercel env add VITE_ADSENSE_PUBLISHER_ID production
echo "ca-pub-5506438806314781" | vercel env add VITE_ADSENSE_PUBLISHER_ID production

vercel env add VITE_ADSENSE_HEADER_BANNER production
echo "9586077878" | vercel env add VITE_ADSENSE_HEADER_BANNER production

vercel env add VITE_ADSENSE_SIDEBAR_SKYSCRAPER production
echo "8151940224" | vercel env add VITE_ADSENSE_SIDEBAR_SKYSCRAPER production

vercel env add VITE_ADSENSE_CONTENT_RECTANGLE production
echo "1707587859" | vercel env add VITE_ADSENSE_CONTENT_RECTANGLE production

vercel env add VITE_ADSENSE_FOOTER_BANNER production
echo "3546766216" | vercel env add VITE_ADSENSE_FOOTER_BANNER production

vercel env add VITE_ADSENSE_MOBILE_BANNER production
echo "5122452205" | vercel env add VITE_ADSENSE_MOBILE_BANNER production

vercel env add VITE_ADSENSE_IN_FEED_NATIVE production
echo "6408743271" | vercel env add VITE_ADSENSE_IN_FEED_NATIVE production

vercel env add VITE_ADSENSE_IN_ARTICLE_NATIVE production
echo "4668276193" | vercel env add VITE_ADSENSE_IN_ARTICLE_NATIVE production

vercel env add VITE_ADSENSE_MAIN_DISPLAY production
echo "2894237519" | vercel env add VITE_ADSENSE_MAIN_DISPLAY production

vercel env add NODE_ENV production
echo "production" | vercel env add NODE_ENV production

vercel env add VITE_NODE_ENV production
echo "production" | vercel env add VITE_NODE_ENV production

echo "Environment variables set! Deploy your project to see the changes."
