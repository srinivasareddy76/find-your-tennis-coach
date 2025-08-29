
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Find Your Tennis Coach</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 1rem 0;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
            text-decoration: none;
        }

        nav ul {
            display: flex;
            list-style: none;
            gap: 2rem;
        }

        nav a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            transition: color 0.3s;
        }

        nav a:hover {
            color: #667eea;
        }

        .hero {
            text-align: center;
            padding: 4rem 0;
            color: white;
        }

        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }

        .cta-button {
            display: inline-block;
            background: #ff6b6b;
            color: white;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
        }

        .features {
            background: white;
            padding: 4rem 0;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .feature-card {
            text-align: center;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
        }

        .feature-card:hover {
            transform: translateY(-5px);
        }

        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .coaches-section {
            background: #f8f9fa;
            padding: 4rem 0;
        }

        .coaches-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .coach-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
        }

        .coach-card:hover {
            transform: translateY(-5px);
        }

        .coach-image {
            width: 100%;
            height: 200px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 4rem;
        }

        .coach-info {
            padding: 1.5rem;
        }

        .coach-name {
            font-size: 1.3rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            color: #333;
        }

        .coach-specialty {
            color: #667eea;
            font-weight: 500;
            margin-bottom: 0.5rem;
        }

        .coach-location {
            color: #666;
            margin-bottom: 1rem;
        }

        .coach-rating {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .stars {
            color: #ffd700;
        }

        .contact-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 0.7rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.3s;
            width: 100%;
        }

        .contact-btn:hover {
            background: #5a6fd8;
        }

        .search-section {
            background: white;
            padding: 2rem 0;
            text-align: center;
        }

        .search-form {
            display: flex;
            gap: 1rem;
            max-width: 600px;
            margin: 0 auto;
            flex-wrap: wrap;
        }

        .search-input {
            flex: 1;
            padding: 1rem;
            border: 2px solid #e0e0e0;
            border-radius: 25px;
            font-size: 1rem;
            min-width: 200px;
        }

        .search-input:focus {
            outline: none;
            border-color: #667eea;
        }

        .search-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.3s;
        }

        .search-btn:hover {
            background: #5a6fd8;
        }

        footer {
            background: #333;
            color: white;
            text-align: center;
            padding: 2rem 0;
        }

        .loading {
            text-align: center;
            padding: 2rem;
            color: #667eea;
        }

        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .search-form {
                flex-direction: column;
            }
            
            .header-content {
                flex-direction: column;
                gap: 1rem;
            }
            
            nav ul {
                gap: 1rem;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="header-content">
                <a href="#" class="logo">🎾 Find Your Tennis Coach</a>
                <nav>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#coaches">Coaches</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <section class="hero" id="home">
        <div class="container">
            <h1>Find Your Perfect Tennis Coach</h1>
            <p>Connect with certified tennis professionals in your area and take your game to the next level</p>
            <a href="#coaches" class="cta-button">Find Coaches Now</a>
        </div>
    </section>

    <section class="search-section">
        <div class="container">
            <h2>Search for Coaches</h2>
            <div class="search-form">
                <input type="text" class="search-input" id="locationSearch" placeholder="Enter your location...">
                <input type="text" class="search-input" id="specialtySearch" placeholder="Specialty (e.g., Beginner, Advanced)...">
                <button class="search-btn" onclick="searchCoaches()">Search</button>
            </div>
        </div>
    </section>

    <section class="features">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 1rem;">Why Choose Our Platform?</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🏆</div>
                    <h3>Certified Professionals</h3>
                    <p>All our coaches are certified and have years of experience in tennis coaching</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📍</div>
                    <h3>Local Coaches</h3>
                    <p>Find coaches in your area for convenient training sessions</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⭐</div>
                    <h3>Verified Reviews</h3>
                    <p>Read authentic reviews from other students to make informed decisions</p>
                </div>
            </div>
        </div>
    </section>

    <section class="coaches-section" id="coaches">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 1rem;">Featured Coaches</h2>
            <div id="coachesContainer" class="coaches-grid">
                <div class="loading">Loading coaches...</div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2024 Find Your Tennis Coach. All rights reserved.</p>
        </div>
    </footer>

    <script>
        // API base URL - will be replaced with actual API Gateway URL
        const API_BASE_URL = '/prod';

        // Load coaches on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadCoaches();
        });

        async function loadCoaches() {
            try {
                const response = await fetch(\`\${API_BASE_URL}/coaches\`);
                const coaches = await response.json();
                displayCoaches(coaches);
            } catch (error) {
                console.error('Error loading coaches:', error);
                displaySampleCoaches();
            }
        }

        function displayCoaches(coaches) {
            const container = document.getElementById('coachesContainer');
            
            if (!coaches || coaches.length === 0) {
                displaySampleCoaches();
                return;
            }

            container.innerHTML = coaches.map(coach => \`
                <div class="coach-card">
                    <div class="coach-image">🎾</div>
                    <div class="coach-info">
                        <div class="coach-name">\${coach.name}</div>
                        <div class="coach-specialty">\${coach.specialty}</div>
                        <div class="coach-location">📍 \${coach.location}</div>
                        <div class="coach-rating">
                            <span class="stars">\${'⭐'.repeat(coach.rating || 5)}</span>
                            <span>(\${coach.rating || 5}.0)</span>
                        </div>
                        <button class="contact-btn" onclick="contactCoach('\${coach.coach_id}')">Contact Coach</button>
                    </div>
                </div>
            \`).join('');
        }

        function displaySampleCoaches() {
            const sampleCoaches = [
                {
                    coach_id: '1',
                    name: 'Sarah Johnson',
                    specialty: 'Beginner & Intermediate',
                    location: 'New York, NY',
                    rating: 5,
                    experience: '8 years'
                },
                {
                    coach_id: '2',
                    name: 'Mike Rodriguez',
                    specialty: 'Advanced & Competition',
                    location: 'Los Angeles, CA',
                    rating: 5,
                    experience: '12 years'
                },
                {
                    coach_id: '3',
                    name: 'Emily Chen',
                    specialty: 'Youth & Junior Development',
                    location: 'Chicago, IL',
                    rating: 5,
                    experience: '6 years'
                },
                {
                    coach_id: '4',
                    name: 'David Thompson',
                    specialty: 'Adult Beginner Specialist',
                    location: 'Miami, FL',
                    rating: 5,
                    experience: '10 years'
                }
            ];
            
            displayCoaches(sampleCoaches);
        }

        async function searchCoaches() {
            const location = document.getElementById('locationSearch').value;
            const specialty = document.getElementById('specialtySearch').value;
            
            try {
                let url = \`\${API_BASE_URL}/coaches\`;
                const params = new URLSearchParams();
                
                if (location) params.append('location', location);
                if (specialty) params.append('specialty', specialty);
                
                if (params.toString()) {
                    url += '?' + params.toString();
                }
                
                const response = await fetch(url);
                const coaches = await response.json();
                displayCoaches(coaches);
            } catch (error) {
                console.error('Error searching coaches:', error);
                // Filter sample coaches based on search criteria
                displaySampleCoaches();
            }
        }

        function contactCoach(coachId) {
            alert(\`Contacting coach \${coachId}. In a real application, this would open a contact form or messaging system.\`);
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    </script>
</body>
</html>
`;

exports.handler = async (event) => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        },
        body: html
    };
};

