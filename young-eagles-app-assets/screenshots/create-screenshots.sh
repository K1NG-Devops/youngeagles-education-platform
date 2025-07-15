#!/bin/bash

# Create sample mobile screenshots for Young Eagles App
echo "📱 Creating sample mobile screenshots..."

mkdir -p screenshots

# Create sample screenshots using SVG (can be converted to PNG)

# Screenshot 1: Login Screen
cat > screenshots/01-login-screen.svg << 'EOF'
<svg width="390" height="844" viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <defs>
    <linearGradient id="bgGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6"/>
      <stop offset="100%" style="stop-color:#8B5CF6"/>
    </linearGradient>
  </defs>
  
  <rect width="390" height="844" fill="url(#bgGrad1)"/>
  
  <!-- Phone Status Bar -->
  <rect width="390" height="40" fill="rgba(0,0,0,0.1)"/>
  <text x="20" y="28" font-family="Arial" font-size="14" font-weight="bold" fill="white">9:41</text>
  <text x="350" y="28" font-family="Arial" font-size="14" fill="white">100%</text>
  
  <!-- App Logo -->
  <circle cx="195" cy="150" r="40" fill="white" opacity="0.9"/>
  <text x="195" y="157" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#3B82F6">🦅</text>
  
  <!-- App Title -->
  <text x="195" y="220" text-anchor="middle" font-family="Arial" font-size="28" font-weight="bold" fill="white">Young Eagles</text>
  <text x="195" y="250" text-anchor="middle" font-family="Arial" font-size="16" fill="rgba(255,255,255,0.8)">Homework Helper</text>
  
  <!-- Login Form -->
  <rect x="40" y="320" width="310" height="400" rx="20" fill="white" opacity="0.95"/>
  
  <!-- Email Field -->
  <rect x="60" y="360" width="270" height="45" rx="8" fill="#F3F4F6" stroke="#D1D5DB"/>
  <text x="75" y="388" font-family="Arial" font-size="14" fill="#6B7280">Enter your email</text>
  
  <!-- Password Field -->
  <rect x="60" y="420" width="270" height="45" rx="8" fill="#F3F4F6" stroke="#D1D5DB"/>
  <text x="75" y="448" font-family="Arial" font-size="14" fill="#6B7280">••••••••</text>
  
  <!-- Login Button -->
  <rect x="60" y="490" width="270" height="45" rx="8" fill="#3B82F6"/>
  <text x="195" y="518" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="white">Sign In</text>
  
  <!-- Additional Options -->
  <text x="195" y="570" text-anchor="middle" font-family="Arial" font-size="14" fill="#6B7280">Don't have an account?</text>
  <text x="195" y="590" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#3B82F6">Sign up here</text>
  
  <!-- Footer -->
  <text x="195" y="800" text-anchor="middle" font-family="Arial" font-size="12" fill="rgba(255,255,255,0.6)">Interactive learning for students</text>
</svg>
EOF

# Screenshot 2: Homework List
cat > screenshots/02-homework-list.svg << 'EOF'
<svg width="390" height="844" viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="390" height="844" fill="#F8FAFC"/>
  
  <!-- Status Bar -->
  <rect width="390" height="40" fill="#3B82F6"/>
  <text x="20" y="28" font-family="Arial" font-size="14" font-weight="bold" fill="white">9:41</text>
  <text x="350" y="28" font-family="Arial" font-size="14" fill="white">100%</text>
  
  <!-- Header -->
  <rect width="390" height="80" y="40" fill="#3B82F6"/>
  <text x="20" y="90" font-family="Arial" font-size="20" font-weight="bold" fill="white">📚 Homework Hub</text>
  <text x="20" y="110" font-family="Arial" font-size="14" fill="rgba(255,255,255,0.8)">Your learning journey starts here</text>
  
  <!-- Progress Card -->
  <rect x="20" y="140" width="350" height="80" rx="12" fill="white" stroke="#E5E7EB"/>
  <text x="35" y="165" font-family="Arial" font-size="16" font-weight="bold" fill="#374151">Progress Overview</text>
  <text x="35" y="185" font-family="Arial" font-size="14" fill="#6B7280">Homework Completion: 3/5</text>
  <rect x="35" y="195" width="300" height="8" rx="4" fill="#E5E7EB"/>
  <rect x="35" y="195" width="180" height="8" rx="4" fill="#10B981"/>
  
  <!-- Homework Cards -->
  <!-- Card 1 -->
  <rect x="20" y="240" width="350" height="120" rx="12" fill="white" stroke="#E5E7EB"/>
  <rect x="20" y="240" width="350" height="40" rx="12" fill="linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)"/>
  <text x="35" y="265" font-family="Arial" font-size="16" font-weight="bold" fill="white">Math Practice</text>
  <rect x="300" y="250" width="60" height="20" rx="10" fill="#10B981"/>
  <text x="330" y="263" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="white">✓ Done</text>
  
  <text x="35" y="300" font-family="Arial" font-size="14" fill="#6B7280">Due: Dec 15, 2024</text>
  <text x="35" y="320" font-family="Arial" font-size="12" fill="#8B5CF6">🎮 Interactive Activity</text>
  <text x="35" y="340" font-family="Arial" font-size="12" fill="#374151">Complete the math exercises</text>
  
  <!-- Card 2 -->
  <rect x="20" y="380" width="350" height="120" rx="12" fill="white" stroke="#E5E7EB"/>
  <rect x="20" y="380" width="350" height="40" rx="12" fill="linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)"/>
  <text x="35" y="405" font-family="Arial" font-size="16" font-weight="bold" fill="white">Science Quiz</text>
  <rect x="300" y="390" width="60" height="20" rx="10" fill="#EF4444"/>
  <text x="330" y="403" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="white">⏳ Pending</text>
  
  <text x="35" y="440" font-family="Arial" font-size="14" fill="#6B7280">Due: Dec 18, 2024</text>
  <text x="35" y="460" font-family="Arial" font-size="12" fill="#F59E0B">📝 Written Assignment</text>
  <text x="35" y="480" font-family="Arial" font-size="12" fill="#374151">Answer questions about plants</text>
  
  <!-- Card 3 -->
  <rect x="20" y="520" width="350" height="120" rx="12" fill="white" stroke="#E5E7EB"/>
  <rect x="20" y="520" width="350" height="40" rx="12" fill="linear-gradient(90deg, #10B981 0%, #059669 100%)"/>
  <text x="35" y="545" font-family="Arial" font-size="16" font-weight="bold" fill="white">Reading Exercise</text>
  <rect x="300" y="530" width="60" height="20" rx="10" fill="#3B82F6"/>
  <text x="330" y="543" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="white">📝 Started</text>
  
  <text x="35" y="580" font-family="Arial" font-size="14" fill="#6B7280">Due: Dec 20, 2024</text>
  <text x="35" y="600" font-family="Arial" font-size="12" fill="#10B981">🎮 Memory Game</text>
  <text x="35" y="620" font-family="Arial" font-size="12" fill="#374151">Match words with pictures</text>
  
  <!-- Bottom Navigation -->
  <rect x="0" y="764" width="390" height="80" fill="white" stroke="#E5E7EB"/>
  <circle cx="78" cy="794" r="20" fill="#3B82F6"/>
  <text x="78" y="800" text-anchor="middle" font-family="Arial" font-size="16" fill="white">🏠</text>
  <text x="78" y="820" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="#3B82F6">Home</text>
  
  <text x="156" y="800" text-anchor="middle" font-family="Arial" font-size="16" fill="#6B7280">📚</text>
  <text x="156" y="820" text-anchor="middle" font-family="Arial" font-size="10" fill="#6B7280">Homework</text>
  
  <text x="234" y="800" text-anchor="middle" font-family="Arial" font-size="16" fill="#6B7280">📊</text>
  <text x="234" y="820" text-anchor="middle" font-family="Arial" font-size="10" fill="#6B7280">Progress</text>
  
  <text x="312" y="800" text-anchor="middle" font-family="Arial" font-size="16" fill="#6B7280">⚙️</text>
  <text x="312" y="820" text-anchor="middle" font-family="Arial" font-size="10" fill="#6B7280">Settings</text>
</svg>
EOF

# Screenshot 3: Interactive Activity
cat > screenshots/03-interactive-activity.svg << 'EOF'
<svg width="390" height="844" viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <defs>
    <linearGradient id="activityBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B5CF6"/>
      <stop offset="100%" style="stop-color:#3B82F6"/>
    </linearGradient>
  </defs>
  
  <rect width="390" height="844" fill="url(#activityBg)"/>
  
  <!-- Status Bar -->
  <rect width="390" height="40" fill="rgba(0,0,0,0.1)"/>
  <text x="20" y="28" font-family="Arial" font-size="14" font-weight="bold" fill="white">9:41</text>
  <text x="350" y="28" font-family="Arial" font-size="14" fill="white">100%</text>
  
  <!-- Header -->
  <text x="195" y="80" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="white">🎮 Color Matching Game</text>
  <text x="195" y="105" text-anchor="middle" font-family="Arial" font-size="14" fill="rgba(255,255,255,0.8)">Drag the color names to the correct circles</text>
  
  <!-- Game Area -->
  <rect x="20" y="130" width="350" height="500" rx="20" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)"/>
  
  <!-- Color Circles -->
  <circle cx="120" cy="200" r="30" fill="#EF4444" stroke="white" stroke-width="3"/>
  <circle cx="270" cy="200" r="30" fill="#3B82F6" stroke="white" stroke-width="3"/>
  <circle cx="120" cy="280" r="30" fill="#10B981" stroke="white" stroke-width="3"/>
  <circle cx="270" cy="280" r="30" fill="#F59E0B" stroke="white" stroke-width="3"/>
  
  <!-- Draggable Labels -->
  <rect x="60" y="350" width="80" height="35" rx="8" fill="white" stroke="#D1D5DB"/>
  <text x="100" y="372" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#374151">Red</text>
  
  <rect x="250" y="350" width="80" height="35" rx="8" fill="white" stroke="#D1D5DB"/>
  <text x="290" y="372" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#374151">Blue</text>
  
  <rect x="60" y="400" width="80" height="35" rx="8" fill="white" stroke="#D1D5DB"/>
  <text x="100" y="422" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#374151">Green</text>
  
  <rect x="250" y="400" width="80" height="35" rx="8" fill="white" stroke="#D1D5DB"/>
  <text x="290" y="422" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#374151">Yellow</text>
  
  <!-- Instructions -->
  <rect x="40" y="470" width="310" height="60" rx="12" fill="rgba(255,255,255,0.2)"/>
  <text x="195" y="495" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="white">💡 Tip</text>
  <text x="195" y="515" text-anchor="middle" font-family="Arial" font-size="12" fill="rgba(255,255,255,0.9)">Drag each color name to its matching circle</text>
  
  <!-- Progress -->
  <rect x="40" y="550" width="310" height="40" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="195" y="575" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="white">Progress: 2/4 matched ✨</text>
  
  <!-- Submit Button -->
  <rect x="60" y="720" width="270" height="50" rx="12" fill="#10B981"/>
  <text x="195" y="750" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="white">Check Answers</text>
  
  <!-- Back Button -->
  <circle cx="50" cy="70" r="20" fill="rgba(255,255,255,0.2)"/>
  <text x="50" y="77" text-anchor="middle" font-family="Arial" font-size="16" fill="white">←</text>
</svg>
EOF

# Screenshot 4: Success Screen
cat > screenshots/04-success-screen.svg << 'EOF'
<svg width="390" height="844" viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <defs>
    <linearGradient id="successBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10B981"/>
      <stop offset="100%" style="stop-color:#059669"/>
    </linearGradient>
  </defs>
  
  <rect width="390" height="844" fill="url(#successBg)"/>
  
  <!-- Status Bar -->
  <rect width="390" height="40" fill="rgba(0,0,0,0.1)"/>
  <text x="20" y="28" font-family="Arial" font-size="14" font-weight="bold" fill="white">9:41</text>
  <text x="350" y="28" font-family="Arial" font-size="14" fill="white">100%</text>
  
  <!-- Success Animation Area -->
  <circle cx="195" cy="250" r="80" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="4"/>
  <text x="195" y="270" text-anchor="middle" font-family="Arial" font-size="48" fill="white">✓</text>
  
  <!-- Celebration -->
  <text x="195" y="370" text-anchor="middle" font-family="Arial" font-size="32" font-weight="bold" fill="white">🎉 Excellent! 🎉</text>
  <text x="195" y="410" text-anchor="middle" font-family="Arial" font-size="18" fill="rgba(255,255,255,0.9)">All colors matched correctly!</text>
  
  <!-- Stats Card -->
  <rect x="40" y="450" width="310" height="120" rx="16" fill="rgba(255,255,255,0.95)"/>
  <text x="195" y="480" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#374151">Activity Complete</text>
  
  <text x="80" y="510" font-family="Arial" font-size="14" fill="#6B7280">Score:</text>
  <text x="310" y="510" text-anchor="end" font-family="Arial" font-size="14" font-weight="bold" fill="#10B981">100%</text>
  
  <text x="80" y="530" font-family="Arial" font-size="14" fill="#6B7280">Time:</text>
  <text x="310" y="530" text-anchor="end" font-family="Arial" font-size="14" font-weight="bold" fill="#10B981">1:23</text>
  
  <text x="80" y="550" font-family="Arial" font-size="14" fill="#6B7280">Attempts:</text>
  <text x="310" y="550" text-anchor="end" font-family="Arial" font-size="14" font-weight="bold" fill="#10B981">1</text>
  
  <!-- Buttons -->
  <rect x="60" y="600" width="270" height="50" rx="12" fill="white"/>
  <text x="195" y="630" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#10B981">Submit Homework</text>
  
  <rect x="60" y="670" width="125" height="40" rx="8" fill="rgba(255,255,255,0.2)" stroke="white"/>
  <text x="122" y="694" text-anchor="middle" font-family="Arial" font-size="14" fill="white">Try Again</text>
  
  <rect x="205" y="670" width="125" height="40" rx="8" fill="rgba(255,255,255,0.2)" stroke="white"/>
  <text x="267" y="694" text-anchor="middle" font-family="Arial" font-size="14" fill="white">Next Activity</text>
  
  <!-- Footer -->
  <text x="195" y="780" text-anchor="middle" font-family="Arial" font-size="14" fill="rgba(255,255,255,0.8)">Great job! Keep learning! 🌟</text>
</svg>
EOF

# Screenshot 5: Progress Dashboard
cat > screenshots/05-progress-dashboard.svg << 'EOF'
<svg width="390" height="844" viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="390" height="844" fill="#F8FAFC"/>
  
  <!-- Status Bar -->
  <rect width="390" height="40" fill="#3B82F6"/>
  <text x="20" y="28" font-family="Arial" font-size="14" font-weight="bold" fill="white">9:41</text>
  <text x="350" y="28" font-family="Arial" font-size="14" fill="white">100%</text>
  
  <!-- Header -->
  <rect width="390" height="80" y="40" fill="#3B82F6"/>
  <text x="20" y="90" font-family="Arial" font-size="20" font-weight="bold" fill="white">📊 Progress Dashboard</text>
  <text x="20" y="110" font-family="Arial" font-size="14" fill="rgba(255,255,255,0.8)">Track your learning journey</text>
  
  <!-- Overall Progress Card -->
  <rect x="20" y="140" width="350" height="100" rx="12" fill="white" stroke="#E5E7EB"/>
  <text x="35" y="165" font-family="Arial" font-size="18" font-weight="bold" fill="#374151">Overall Progress</text>
  <circle cx="320" cy="180" r="25" fill="none" stroke="#E5E7EB" stroke-width="4"/>
  <circle cx="320" cy="180" r="25" fill="none" stroke="#10B981" stroke-width="4" stroke-dasharray="110 47" transform="rotate(-90 320 180)"/>
  <text x="320" y="186" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#10B981">70%</text>
  
  <text x="35" y="195" font-family="Arial" font-size="14" fill="#6B7280">Completed: 14/20 assignments</text>
  <text x="35" y="215" font-family="Arial" font-size="14" fill="#6B7280">This week: 5/7 activities</text>
  
  <!-- Stats Grid -->
  <rect x="20" y="260" width="170" height="80" rx="12" fill="white" stroke="#E5E7EB"/>
  <text x="105" y="285" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#3B82F6">142</text>
  <text x="105" y="305" text-anchor="middle" font-family="Arial" font-size="14" fill="#6B7280">Points Earned</text>
  <text x="105" y="320" text-anchor="middle" font-family="Arial" font-size="12" fill="#10B981">+12 this week</text>
  
  <rect x="200" y="260" width="170" height="80" rx="12" fill="white" stroke="#E5E7EB"/>
  <text x="285" y="285" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#8B5CF6">7</text>
  <text x="285" y="305" text-anchor="middle" font-family="Arial" font-size="14" fill="#6B7280">Day Streak</text>
  <text x="285" y="320" text-anchor="middle" font-family="Arial" font-size="12" fill="#F59E0B">🔥 Keep it up!</text>
  
  <!-- Recent Activities -->
  <text x="20" y="375" font-family="Arial" font-size="18" font-weight="bold" fill="#374151">Recent Activities</text>
  
  <!-- Activity 1 -->
  <rect x="20" y="390" width="350" height="60" rx="12" fill="white" stroke="#E5E7EB"/>
  <circle cx="50" cy="420" r="15" fill="#10B981"/>
  <text x="50" y="426" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="white">✓</text>
  <text x="80" y="410" font-family="Arial" font-size="14" font-weight="bold" fill="#374151">Math Practice</text>
  <text x="80" y="430" font-family="Arial" font-size="12" fill="#6B7280">Completed 2 hours ago</text>
  <text x="350" y="415" text-anchor="end" font-family="Arial" font-size="12" font-weight="bold" fill="#10B981">100%</text>
  <text x="350" y="435" text-anchor="end" font-family="Arial" font-size="10" fill="#10B981">+15 pts</text>
  
  <!-- Activity 2 -->
  <rect x="20" y="460" width="350" height="60" rx="12" fill="white" stroke="#E5E7EB"/>
  <circle cx="50" cy="490" r="15" fill="#3B82F6"/>
  <text x="50" y="496" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="white">🎮</text>
  <text x="80" y="480" font-family="Arial" font-size="14" font-weight="bold" fill="#374151">Color Matching</text>
  <text x="80" y="500" font-family="Arial" font-size="12" fill="#6B7280">In progress</text>
  <text x="350" y="485" text-anchor="end" font-family="Arial" font-size="12" font-weight="bold" fill="#3B82F6">50%</text>
  <text x="350" y="505" text-anchor="end" font-family="Arial" font-size="10" fill="#6B7280">2/4 done</text>
  
  <!-- Activity 3 -->
  <rect x="20" y="530" width="350" height="60" rx="12" fill="white" stroke="#E5E7EB"/>
  <circle cx="50" cy="560" r="15" fill="#EF4444"/>
  <text x="50" y="566" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="white">!</text>
  <text x="80" y="550" font-family="Arial" font-size="14" font-weight="bold" fill="#374151">Science Quiz</text>
  <text x="80" y="570" font-family="Arial" font-size="12" fill="#6B7280">Due tomorrow</text>
  <text x="350" y="555" text-anchor="end" font-family="Arial" font-size="12" font-weight="bold" fill="#EF4444">0%</text>
  <text x="350" y="575" text-anchor="end" font-family="Arial" font-size="10" fill="#EF4444">Not started</text>
  
  <!-- Achievements Section -->
  <text x="20" y="630" font-family="Arial" font-size="18" font-weight="bold" fill="#374151">Latest Achievement</text>
  
  <rect x="20" y="645" width="350" height="70" rx="12" fill="linear-gradient(90deg, #F59E0B 0%, #D97706 100%)"/>
  <text x="50" y="675" font-family="Arial" font-size="24" fill="white">🏆</text>
  <text x="85" y="670" font-family="Arial" font-size="16" font-weight="bold" fill="white">Math Master</text>
  <text x="85" y="690" font-family="Arial" font-size="12" fill="rgba(255,255,255,0.9)">Completed 10 math activities</text>
  <text x="350" y="680" text-anchor="end" font-family="Arial" font-size="12" fill="rgba(255,255,255,0.8)">Just now</text>
  
  <!-- Bottom Navigation -->
  <rect x="0" y="764" width="390" height="80" fill="white" stroke="#E5E7EB"/>
  <text x="78" y="800" text-anchor="middle" font-family="Arial" font-size="16" fill="#6B7280">🏠</text>
  <text x="78" y="820" text-anchor="middle" font-family="Arial" font-size="10" fill="#6B7280">Home</text>
  
  <text x="156" y="800" text-anchor="middle" font-family="Arial" font-size="16" fill="#6B7280">📚</text>
  <text x="156" y="820" text-anchor="middle" font-family="Arial" font-size="10" fill="#6B7280">Homework</text>
  
  <circle cx="234" cy="794" r="20" fill="#3B82F6"/>
  <text x="234" y="800" text-anchor="middle" font-family="Arial" font-size="16" fill="white">📊</text>
  <text x="234" y="820" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="#3B82F6">Progress</text>
  
  <text x="312" y="800" text-anchor="middle" font-family="Arial" font-size="16" fill="#6B7280">⚙️</text>
  <text x="312" y="820" text-anchor="middle" font-family="Arial" font-size="10" fill="#6B7280">Settings</text>
</svg>
EOF

echo "✅ Created 5 sample mobile screenshots"
echo "📱 Screenshots created:"
echo "   1. Login Screen (01-login-screen.svg)"
echo "   2. Homework List (02-homework-list.svg)"
echo "   3. Interactive Activity (03-interactive-activity.svg)"
echo "   4. Success Screen (04-success-screen.svg)"
echo "   5. Progress Dashboard (05-progress-dashboard.svg)"
echo ""
echo "🔄 Converting to PNG for app stores..."

# Convert SVG to PNG if ImageMagick is available
if command -v convert &> /dev/null; then
    for svg_file in screenshots/*.svg; do
        png_file="${svg_file%.svg}.png"
        convert "$svg_file" -resize 390x844 "$png_file"
        echo "✅ Converted $(basename "$svg_file") to PNG"
    done
    echo "🎉 All screenshots converted to PNG format!"
else
    echo "⚠️  ImageMagick not found. SVG files created, use online converter for PNG"
fi

echo "📋 Next steps:"
echo "   1. Use these screenshots in your app store listings"
echo "   2. Customize text and colors as needed"
echo "   3. Test screenshots on different device sizes"

