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
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Header Styles */
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 0;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            text-decoration: none;
            color: white;
        }

        nav ul {
            display: flex;
            list-style: none;
            gap: 2rem;
        }

        nav a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: opacity 0.3s;
        }

        nav a:hover {
            opacity: 0.8;
        }

        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 120px 0 80px;
            margin-top: 70px;
        }

        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
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
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(255, 107, 107, 0.3);
        }

        /* Search Section */
        .search-section {
            background: white;
            padding: 60px 0;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .search-section h2 {
            text-align: center;
            margin-bottom: 2rem;
            color: #333;
            font-size: 2.5rem;
        }

        .search-form {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .search-input-container {
            position: relative;
        }

        .search-input {
            width: 100%;
            padding: 15px;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }

        .search-input:focus {
            outline: none;
            border-color: #667eea;
        }

        .suggestions-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e1e5e9;
            border-top: none;
            border-radius: 0 0 10px 10px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        }

        .suggestion-item {
            padding: 10px 15px;
            cursor: pointer;
            border-bottom: 1px solid #f0f0f0;
        }

        .suggestion-item:hover,
        .suggestion-item.selected {
            background-color: #f8f9fa;
        }

        .checkbox-container {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            padding: 10px;
        }

        .checkbox-container input[type="checkbox"] {
            width: 18px;
            height: 18px;
        }

        .search-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s, transform 0.2s;
        }

        .search-btn:hover {
            background: #5a6fd8;
            transform: translateY(-1px);
        }

        .search-btn.secondary {
            background: #6c757d;
        }

        .search-btn.secondary:hover {
            background: #5a6268;
        }

        .search-tips {
            text-align: center;
            margin-top: 1rem;
            color: #666;
        }

        /* Features Section */
        .features {
            padding: 80px 0;
            background: #f8f9fa;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }

        .feature-card:hover {
            transform: translateY(-5px);
        }

        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .feature-card h3 {
            margin-bottom: 1rem;
            color: #333;
        }

        /* Coaches Section */
        .coaches-section {
            padding: 80px 0;
            background: white;
        }

        .coaches-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .coach-card {
            background: white;
            border-radius: 15px;
            padding: 1.5rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .coach-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }

        .coach-image {
            font-size: 4rem;
            text-align: center;
            margin-bottom: 1rem;
        }

        .coach-name {
            font-size: 1.3rem;
            font-weight: 600;
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
            margin-bottom: 0.5rem;
        }

        .coach-skills {
            color: #28a745;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }

        .coach-availability {
            color: #17a2b8;
            margin-bottom: 1rem;
            font-size: 0.9rem;
        }

        .coach-rating {
            margin-bottom: 1rem;
        }

        .stars {
            color: #ffc107;
            margin-right: 0.5rem;
        }

        .contact-btn {
            width: 100%;
            background: #28a745;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }

        .contact-btn:hover {
            background: #218838;
        }

        .loading {
            text-align: center;
            padding: 2rem;
            color: #666;
            font-size: 1.1rem;
        }

        /* Footer */
        footer {
            background: #333;
            color: white;
            text-align: center;
            padding: 2rem 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2rem;
            }

            .search-form {
                grid-template-columns: 1fr;
            }

            .coaches-grid {
                grid-template-columns: 1fr;
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
                <div class="search-input-container">
                    <input type="text" class="search-input" id="locationSearch" placeholder="Enter city or CA zip code (e.g., Beverly Hills, 90210)...">
                    <div class="suggestions-dropdown" id="suggestionsDropdown"></div>
                </div>
                <select class="search-input" id="countySearch">
                    <option value="">Select County (Optional)</option>
                </select>
                <select class="search-input" id="skillLevelSearch">
                    <option value="">Select Skill Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>
                <input type="text" class="search-input" id="specialtySearch" placeholder="Specialty (e.g., Youth, Competition)...">
            </div>
            <div class="search-form" style="margin-top: 1rem;">
                <label class="checkbox-container">
                    <input type="checkbox" id="weekendAvailable"> Weekend Available
                    <span class="checkmark"></span>
                </label>
                <label class="checkbox-container">
                    <input type="checkbox" id="holidayAvailable"> Holiday Available
                    <span class="checkmark"></span>
                </label>
                <button class="search-btn" onclick="searchCoaches()">Search Coaches</button>
                <button class="search-btn secondary" onclick="clearFilters()">Clear Filters</button>
            </div>
            <div class="search-tips">
                <p><strong>Search Tips:</strong> Search by county (e.g., Los Angeles, Orange), skill level, or specific locations. Use filters for weekend/holiday availability.</p>
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

    <script src="/app.js"></script>
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
