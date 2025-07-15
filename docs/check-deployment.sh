#!/bin/bash

echo "🔍 Checking Deployment Status..."
echo "================================"
echo ""

# Check Frontend (Vercel)
echo "📱 Frontend Status (Vercel):"
if curl -s -o /dev/null -w "%{http_code}" https://my-turborepo-ten-sand.vercel.app/ | grep -q "200"; then
    echo "✅ Frontend is live and responding"
else
    echo "⚠️ Frontend might still be deploying"
fi
echo "🔗 Frontend URL: https://my-turborepo-ten-sand.vercel.app/"
echo ""

# Check Backend (Railway)
echo "🛠️ Backend Status (Railway):"
if curl -s -o /dev/null -w "%{http_code}" https://youngeagles-api-server.up.railway.app/ | grep -q "200"; then
    echo "✅ Backend is live and responding"
else
    echo "⚠️ Backend might still be deploying"
fi
echo "🔗 Backend URL: https://youngeagles-api-server.up.railway.app/"
echo ""

# Test teacher login endpoint
echo "🔐 Testing Teacher Authentication:"
response=$(curl -s -X POST https://youngeagles-api-server.up.railway.app/api/auth/teacher-login \
  -H "Content-Type: application/json" \
  -d '{"email": "dima@youngeagles.org.za", "password": "teacher123"}' \
  -w "%{http_code}")

http_code=$(echo $response | tail -c 4)
if [ "$http_code" = "200" ]; then
    echo "✅ Teacher authentication is working!"
    echo "📧 Test with: dima@youngeagles.org.za / teacher123"
else
    echo "⚠️ Teacher authentication needs setup (HTTP: $http_code)"
    echo "💡 Run teacher password setup script on production"
fi
echo ""

echo "🎉 Deployment Check Complete!"
echo "🧪 Test your apps at the URLs above"

