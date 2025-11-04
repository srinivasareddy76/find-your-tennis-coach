// API base URL - will be replaced with actual API Gateway URL
const API_BASE_URL = '';

// California Zip Codes Data
const californiaZipCodes = {
    // Los Angeles County
    '90210': 'Beverly Hills',
    '90028': 'Hollywood',
    '90036': 'West Hollywood',
    '90046': 'West Hollywood',
    '90069': 'West Hollywood',
    '90048': 'West Hollywood',
    '90211': 'Beverly Hills',
    '90212': 'Beverly Hills',
    '90213': 'Beverly Hills',
    
    // Orange County
    '92602': 'Irvine',
    '92603': 'Irvine',
    '92604': 'Irvine',
    '92606': 'Irvine',
    '92612': 'Irvine',
    '92614': 'Irvine',
    '92617': 'Irvine',
    '92618': 'Irvine',
    '92620': 'Irvine',
    '92625': 'Irvine',
    '92626': 'Irvine',
    '92627': 'Irvine',
    '92630': 'Lake Forest',
    '92660': 'Newport Beach',
    '92661': 'Newport Beach',
    '92662': 'Newport Beach',
    '92663': 'Newport Beach',
    
    // San Francisco
    '94102': 'San Francisco',
    '94103': 'San Francisco',
    '94104': 'San Francisco',
    '94105': 'San Francisco',
    '94107': 'San Francisco',
    '94108': 'San Francisco',
    '94109': 'San Francisco',
    '94110': 'San Francisco',
    '94111': 'San Francisco',
    '94112': 'San Francisco',
    '94114': 'San Francisco',
    '94115': 'San Francisco',
    '94116': 'San Francisco',
    '94117': 'San Francisco',
    '94118': 'San Francisco',
    '94121': 'San Francisco',
    '94122': 'San Francisco',
    '94123': 'San Francisco',
    '94124': 'San Francisco',
    '94127': 'San Francisco',
    '94131': 'San Francisco',
    '94132': 'San Francisco',
    '94133': 'San Francisco',
    '94134': 'San Francisco',
    
    // Santa Clara County
    '95014': 'Cupertino',
    '95015': 'Cupertino',
    '95050': 'Santa Clara',
    '95051': 'Santa Clara',
    '95054': 'Santa Clara',
    '95070': 'Saratoga',
    '95110': 'San Jose',
    '95111': 'San Jose',
    '95112': 'San Jose',
    '95113': 'San Jose',
    '95116': 'San Jose',
    '95117': 'San Jose',
    '95118': 'San Jose',
    '95119': 'San Jose',
    '95120': 'San Jose',
    '95121': 'San Jose',
    '95122': 'San Jose',
    '95123': 'San Jose',
    '95124': 'San Jose',
    '95125': 'San Jose',
    '95126': 'San Jose',
    '95127': 'San Jose',
    '95128': 'San Jose',
    '95129': 'San Jose',
    '95130': 'San Jose',
    '95131': 'San Jose',
    '95132': 'San Jose',
    '95133': 'San Jose',
    '95134': 'San Jose',
    '95135': 'San Jose',
    '95136': 'San Jose',
    '95138': 'San Jose',
    '95139': 'San Jose',
    '95148': 'San Jose',
    
    // San Diego County
    '92101': 'San Diego',
    '92102': 'San Diego',
    '92103': 'San Diego',
    '92104': 'San Diego',
    '92105': 'San Diego',
    '92106': 'San Diego',
    '92107': 'San Diego',
    '92108': 'San Diego',
    '92109': 'San Diego',
    '92110': 'San Diego',
    '92111': 'San Diego',
    '92113': 'San Diego',
    '92114': 'San Diego',
    '92115': 'San Diego',
    '92116': 'San Diego',
    '92117': 'San Diego',
    '92119': 'San Diego',
    '92120': 'San Diego',
    '92121': 'San Diego',
    '92122': 'San Diego',
    '92123': 'San Diego',
    '92124': 'San Diego',
    '92126': 'San Diego',
    '92127': 'San Diego',
    '92128': 'San Diego',
    '92129': 'San Diego',
    '92130': 'San Diego',
    '92131': 'San Diego',
    '92132': 'San Diego',
    '92134': 'San Diego',
    '92135': 'San Diego',
    '92136': 'San Diego',
    '92139': 'San Diego',
    '92140': 'San Diego',
    '92154': 'San Diego',
    '92173': 'San Diego',
    
    // Sacramento Area
    '95814': 'Sacramento',
    '95815': 'Sacramento',
    '95816': 'Sacramento',
    '95817': 'Sacramento',
    '95818': 'Sacramento',
    '95819': 'Sacramento',
    '95820': 'Sacramento',
    '95821': 'Sacramento',
    '95822': 'Sacramento',
    '95823': 'Sacramento',
    '95824': 'Sacramento',
    '95825': 'Sacramento',
    '95826': 'Sacramento',
    '95827': 'Sacramento',
    '95828': 'Sacramento',
    '95829': 'Sacramento',
    '95831': 'Sacramento',
    '95832': 'Sacramento',
    '95833': 'Sacramento',
    '95834': 'Sacramento',
    '95835': 'Sacramento',
    '95837': 'Sacramento',
    '95838': 'Sacramento',
    '95841': 'Sacramento',
    '95842': 'Sacramento'
};

// Load coaches on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    loadCoaches();
    loadCounties();
    setupAutocomplete();
});

async function loadCoaches() {
    console.log('Loading coaches...');
    try {
        const response = await fetch(API_BASE_URL + '/coaches');
        console.log('Response status:', response.status);
        const coaches = await response.json();
        console.log('Coaches loaded:', coaches.length);
        displayCoaches(coaches);
    } catch (error) {
        console.error('Error loading coaches:', error);
        displaySampleCoaches();
    }
}

async function loadCounties() {
    console.log('Loading counties...');
    try {
        const response = await fetch(API_BASE_URL + '/counties');
        const counties = await response.json();
        console.log('Counties loaded:', counties);
        const countySelect = document.getElementById('countySearch');
        
        counties.forEach(county => {
            const option = document.createElement('option');
            option.value = county;
            option.textContent = county;
            countySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading counties:', error);
        // Fallback to hardcoded counties
        const fallbackCounties = [
            'Los Angeles', 'Orange', 'San Francisco', 'Santa Clara', 'San Diego',
            'Sacramento', 'Santa Barbara', 'Ventura', 'San Luis Obispo',
            'Alameda', 'Contra Costa'
        ];
        const countySelect = document.getElementById('countySearch');
        
        fallbackCounties.forEach(county => {
            const option = document.createElement('option');
            option.value = county;
            option.textContent = county;
            countySelect.appendChild(option);
        });
    }
}

function displayCoaches(coaches) {
    console.log('Displaying coaches:', coaches.length);
    const container = document.getElementById('coachesContainer');
    
    if (!coaches || coaches.length === 0) {
        displaySampleCoaches();
        return;
    }

    container.innerHTML = coaches.map(coach => 
        '<div class="coach-card">' +
            '<div class="coach-image">🎾</div>' +
            '<div class="coach-info">' +
                '<div class="coach-name">' + coach.name + '</div>' +
                '<div class="coach-specialty">' + coach.specialty + '</div>' +
                '<div class="coach-location">📍 ' + coach.location + (coach.county ? ' (' + coach.county + ' County)' : '') + '</div>' +
                '<div class="coach-skills">🏆 ' + (coach.skill_levels ? coach.skill_levels.join(', ') : 'All Levels') + '</div>' +
                '<div class="coach-availability">' +
                    (coach.weekend_available ? '📅 Weekend Available ' : '') +
                    (coach.holiday_available ? '🎉 Holiday Available' : '') +
                '</div>' +
                '<div class="coach-rating">' +
                    '<span class="stars">' + '⭐'.repeat(coach.rating || 5) + '</span>' +
                    '<span>(' + (coach.rating || 5) + '.0)</span>' +
                '</div>' +
                '<button class="contact-btn" onclick="contactCoach(\'' + coach.coach_id + '\')">Contact Coach</button>' +
            '</div>' +
        '</div>'
    ).join('');
}

function displaySampleCoaches() {
    console.log('Displaying sample coaches...');
    const sampleCoaches = [
        {
            coach_id: '1',
            name: 'Sarah Johnson',
            specialty: 'Beginner & Intermediate',
            skill_levels: ['Beginner', 'Intermediate'],
            location: 'Beverly Hills, CA',
            county: 'Los Angeles',
            rating: 5,
            weekend_available: true,
            holiday_available: true,
            experience: '8 years'
        },
        {
            coach_id: '2',
            name: 'Mike Rodriguez',
            specialty: 'Advanced & Competition',
            skill_levels: ['Advanced'],
            location: 'Hollywood, CA',
            county: 'Los Angeles',
            rating: 5,
            weekend_available: true,
            holiday_available: false,
            experience: '12 years'
        },
        {
            coach_id: '3',
            name: 'Emily Chen',
            specialty: 'Youth & Junior Development',
            skill_levels: ['Beginner', 'Intermediate'],
            location: 'San Francisco, CA',
            county: 'San Francisco',
            rating: 5,
            weekend_available: true,
            holiday_available: true,
            experience: '6 years'
        }
    ];
    
    displayCoaches(sampleCoaches);
}

async function searchCoaches() {
    console.log('Searching coaches...');
    const location = document.getElementById('locationSearch').value;
    const county = document.getElementById('countySearch').value;
    const skillLevel = document.getElementById('skillLevelSearch').value;
    const specialty = document.getElementById('specialtySearch').value;
    const weekendAvailable = document.getElementById('weekendAvailable').checked;
    const holidayAvailable = document.getElementById('holidayAvailable').checked;
    
    console.log('Search params:', { location, county, skillLevel, specialty, weekendAvailable, holidayAvailable });
    
    try {
        let url = API_BASE_URL + '/coaches';
        const params = new URLSearchParams();
        
        if (location) params.append('location', location);
        if (county) params.append('county', county);
        if (skillLevel) params.append('skill_level', skillLevel);
        if (specialty) params.append('specialty', specialty);
        if (weekendAvailable) params.append('weekend_available', 'true');
        if (holidayAvailable) params.append('holiday_available', 'true');
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        console.log('Search URL:', url);
        const response = await fetch(url);
        const coaches = await response.json();
        console.log('Search results:', coaches.length);
        displayCoaches(coaches);
    } catch (error) {
        console.error('Error searching coaches:', error);
        displaySampleCoaches();
    }
}

function clearFilters() {
    console.log('Clearing filters...');
    document.getElementById('locationSearch').value = '';
    document.getElementById('countySearch').value = '';
    document.getElementById('skillLevelSearch').value = '';
    document.getElementById('specialtySearch').value = '';
    document.getElementById('weekendAvailable').checked = false;
    document.getElementById('holidayAvailable').checked = false;
    
    // Reload all coaches
    loadCoaches();
}

function contactCoach(coachId) {
    alert('Contacting coach ' + coachId + '. In a real application, this would open a contact form or messaging system.');
}

function setupAutocomplete() {
    // Simplified autocomplete setup
    console.log('Setting up autocomplete...');
}
