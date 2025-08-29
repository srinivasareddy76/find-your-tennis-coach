

import os

def create_tennis_logo():
    """Create a professional tennis logo SVG"""
    svg_content = '''
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ballGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFE135;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FFC107;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="racketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B4513;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#A0522D;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Tennis Racket -->
  <ellipse cx="100" cy="80" rx="45" ry="60" fill="none" stroke="url(#racketGradient)" stroke-width="8"/>
  
  <!-- Racket Strings -->
  <g stroke="#333" stroke-width="1" opacity="0.7">
    <line x1="70" y1="50" x2="130" y2="50"/>
    <line x1="70" y1="65" x2="130" y2="65"/>
    <line x1="70" y1="80" x2="130" y2="80"/>
    <line x1="70" y1="95" x2="130" y2="95"/>
    <line x1="70" y1="110" x2="130" y2="110"/>
    
    <line x1="85" y1="35" x2="85" y2="125"/>
    <line x1="100" y1="30" x2="100" y2="130"/>
    <line x1="115" y1="35" x2="115" y2="125"/>
  </g>
  
  <!-- Racket Handle -->
  <rect x="95" y="140" width="10" height="40" fill="url(#racketGradient)" rx="5"/>
  <rect x="92" y="175" width="16" height="8" fill="#654321" rx="4"/>
  
  <!-- Tennis Ball -->
  <circle cx="150" cy="50" r="20" fill="url(#ballGradient)"/>
  <path d="M 135 45 Q 150 35 165 45" stroke="white" stroke-width="2" fill="none"/>
  <path d="M 135 55 Q 150 65 165 55" stroke="white" stroke-width="2" fill="none"/>
  
  <!-- Text -->
  <text x="100" y="25" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#333">TENNIS</text>
</svg>
'''
    return svg_content

def create_coach_icon():
    """Create a coach/instructor icon SVG"""
    svg_content = '''
<svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="personGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Head -->
  <circle cx="75" cy="40" r="20" fill="url(#personGradient)"/>
  
  <!-- Body -->
  <rect x="60" y="55" width="30" height="40" fill="url(#personGradient)" rx="15"/>
  
  <!-- Arms -->
  <rect x="40" y="60" width="15" height="25" fill="url(#personGradient)" rx="7"/>
  <rect x="95" y="60" width="15" height="25" fill="url(#personGradient)" rx="7"/>
  
  <!-- Legs -->
  <rect x="65" y="90" width="8" height="30" fill="url(#personGradient)" rx="4"/>
  <rect x="77" y="90" width="8" height="30" fill="url(#personGradient)" rx="4"/>
  
  <!-- Tennis Racket in hand -->
  <ellipse cx="110" cy="75" rx="12" ry="15" fill="none" stroke="#8B4513" stroke-width="3"/>
  <line x1="110" y1="90" x2="110" y2="105" stroke="#8B4513" stroke-width="3"/>
  
  <!-- Whistle -->
  <circle cx="75" cy="65" r="3" fill="#FFD700"/>
  <line x1="75" y1="68" x2="75" y2="75" stroke="#333" stroke-width="1"/>
  
  <!-- Cap -->
  <ellipse cx="75" cy="30" rx="22" ry="8" fill="#333"/>
  <rect x="53" y="25" width="44" height="10" fill="#333" rx="5"/>
</svg>
'''
    return svg_content

def create_tennis_court():
    """Create a tennis court diagram SVG"""
    svg_content = '''
<svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="courtPattern" patternUnits="userSpaceOnUse" width="10" height="10">
      <rect width="10" height="10" fill="#2E7D32"/>
      <rect width="5" height="5" fill="#388E3C"/>
    </pattern>
  </defs>
  
  <!-- Court Background -->
  <rect x="20" y="20" width="260" height="160" fill="url(#courtPattern)" stroke="#fff" stroke-width="3"/>
  
  <!-- Center Line -->
  <line x1="150" y1="20" x2="150" y2="180" stroke="white" stroke-width="2"/>
  
  <!-- Service Lines -->
  <line x1="20" y1="80" x2="280" y2="80" stroke="white" stroke-width="2"/>
  <line x1="20" y1="120" x2="280" y2="120" stroke="white" stroke-width="2"/>
  
  <!-- Service Boxes -->
  <line x1="150" y1="80" x2="150" y2="120" stroke="white" stroke-width="2"/>
  
  <!-- Net -->
  <rect x="145" y="20" width="10" height="160" fill="#333" opacity="0.8"/>
  <rect x="140" y="15" width="20" height="10" fill="#654321"/>
  <rect x="140" y="175" width="20" height="10" fill="#654321"/>
  
  <!-- Net Pattern -->
  <g stroke="white" stroke-width="0.5" opacity="0.6">
    <line x1="145" y1="25" x2="155" y2="35"/>
    <line x1="145" y1="35" x2="155" y2="45"/>
    <line x1="145" y1="45" x2="155" y2="55"/>
    <line x1="145" y1="55" x2="155" y2="65"/>
    <line x1="145" y1="65" x2="155" y2="75"/>
    <line x1="145" y1="85" x2="155" y2="95"/>
    <line x1="145" y1="95" x2="155" y2="105"/>
    <line x1="145" y1="105" x2="155" y2="115"/>
    <line x1="145" y1="125" x2="155" y2="135"/>
    <line x1="145" y1="135" x2="155" y2="145"/>
    <line x1="145" y1="145" x2="155" y2="155"/>
    <line x1="145" y1="155" x2="155" y2="165"/>
    <line x1="145" y1="165" x2="155" y2="175"/>
  </g>
</svg>
'''
    return svg_content

def create_trophy_icon():
    """Create a trophy/achievement icon SVG"""
    svg_content = '''
<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="trophyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#FFA000;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF8F00;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Trophy Base -->
  <rect x="40" y="85" width="40" height="15" fill="url(#trophyGradient)" rx="3"/>
  <rect x="35" y="95" width="50" height="8" fill="#B8860B" rx="4"/>
  
  <!-- Trophy Stem -->
  <rect x="55" y="70" width="10" height="20" fill="url(#trophyGradient)"/>
  
  <!-- Trophy Cup -->
  <path d="M 45 70 L 45 40 Q 45 30 60 30 Q 75 30 75 40 L 75 70 Z" fill="url(#trophyGradient)"/>
  
  <!-- Trophy Handles -->
  <ellipse cx="35" cy="50" rx="8" ry="12" fill="none" stroke="url(#trophyGradient)" stroke-width="4"/>
  <ellipse cx="85" cy="50" rx="8" ry="12" fill="none" stroke="url(#trophyGradient)" stroke-width="4"/>
  
  <!-- Trophy Details -->
  <rect x="50" y="45" width="20" height="3" fill="#B8860B" rx="1"/>
  <rect x="52" y="52" width="16" height="2" fill="#B8860B" rx="1"/>
  
  <!-- Star on top -->
  <polygon points="60,25 62,31 68,31 63,35 65,41 60,37 55,41 57,35 52,31 58,31" fill="#FFD700"/>
</svg>
'''
    return svg_content

def create_location_icon():
    """Create a location/map pin icon SVG"""
    svg_content = '''
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#EE5A52;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Map Pin -->
  <path d="M 50 20 C 35 20 25 30 25 45 C 25 65 50 80 50 80 C 50 80 75 65 75 45 C 75 30 65 20 50 20 Z" fill="url(#pinGradient)"/>
  
  <!-- Pin Center -->
  <circle cx="50" cy="45" r="12" fill="white"/>
  <circle cx="50" cy="45" r="8" fill="url(#pinGradient)"/>
  
  <!-- Tennis Ball in center -->
  <circle cx="50" cy="45" r="6" fill="#FFE135"/>
  <path d="M 46 42 Q 50 40 54 42" stroke="white" stroke-width="1" fill="none"/>
  <path d="M 46 48 Q 50 50 54 48" stroke="white" stroke-width="1" fill="none"/>
</svg>
'''
    return svg_content

def create_star_rating():
    """Create a 5-star rating SVG"""
    svg_content = '''
<svg width="150" height="30" viewBox="0 0 150 30" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FFA000;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 5 Stars -->
  <polygon points="15,5 17,11 23,11 18,15 20,21 15,17 10,21 12,15 7,11 13,11" fill="url(#starGradient)"/>
  <polygon points="45,5 47,11 53,11 48,15 50,21 45,17 40,21 42,15 37,11 43,11" fill="url(#starGradient)"/>
  <polygon points="75,5 77,11 83,11 78,15 80,21 75,17 70,21 72,15 67,11 73,11" fill="url(#starGradient)"/>
  <polygon points="105,5 107,11 113,11 108,15 110,21 105,17 100,21 102,15 97,11 103,11" fill="url(#starGradient)"/>
  <polygon points="135,5 137,11 143,11 138,15 140,21 135,17 130,21 132,15 127,11 133,11" fill="url(#starGradient)"/>
</svg>
'''
    return svg_content

# Create images directory and generate SVG files
os.makedirs('images', exist_ok=True)

# Generate all images
images = {
    'tennis-logo.svg': create_tennis_logo(),
    'coach-icon.svg': create_coach_icon(),
    'tennis-court.svg': create_tennis_court(),
    'trophy-icon.svg': create_trophy_icon(),
    'location-icon.svg': create_location_icon(),
    'star-rating.svg': create_star_rating()
}

for filename, content in images.items():
    with open(f'images/{filename}', 'w') as f:
        f.write(content)

print("Created the following tennis-related images:")
for filename in images.keys():
    print(f"  - images/{filename}")

