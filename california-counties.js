// California Counties Data with City and Zip Code Mappings
const californiaCounties = {
    // Los Angeles County
    'Los Angeles': {
        cities: [
            'Los Angeles', 'Beverly Hills', 'Hollywood', 'West Hollywood', 'Santa Monica', 
            'Pasadena', 'Glendale', 'Burbank', 'Long Beach', 'Torrance', 'El Segundo',
            'Manhattan Beach', 'Redondo Beach', 'Hermosa Beach', 'Culver City', 'Venice',
            'Malibu', 'Calabasas', 'Westwood', 'Brentwood', 'Century City'
        ],
        zipCodes: [
            '90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90010',
            '90011', '90012', '90013', '90014', '90015', '90016', '90017', '90018', '90019',
            '90020', '90021', '90022', '90023', '90024', '90025', '90026', '90027', '90028',
            '90029', '90031', '90032', '90033', '90034', '90035', '90036', '90037', '90038',
            '90039', '90041', '90042', '90043', '90044', '90045', '90046', '90047', '90048',
            '90049', '90056', '90057', '90058', '90059', '90061', '90062', '90063', '90064',
            '90065', '90066', '90067', '90068', '90069', '90071', '90077', '90089', '90094',
            '90095', '90210', '90211', '90212', '90213', '91101', '91102', '91103', '91104',
            '91105', '91106', '91107', '91108', '91109', '91110', '91114', '91115', '91116',
            '91117', '91118', '91121', '91123', '91124', '91125', '91126', '91129', '91131',
            '91182', '91184', '91185', '91188', '91189'
        ]
    },

    // Orange County
    'Orange': {
        cities: [
            'Irvine', 'Newport Beach', 'Santa Ana', 'Anaheim', 'Huntington Beach',
            'Costa Mesa', 'Fullerton', 'Garden Grove', 'Orange', 'Tustin',
            'Fountain Valley', 'Corona del Mar', 'Laguna Beach', 'Mission Viejo',
            'Yorba Linda', 'Brea', 'Placentia', 'Buena Park'
        ],
        zipCodes: [
            '92602', '92603', '92604', '92606', '92612', '92614', '92617', '92618',
            '92620', '92625', '92660', '92661', '92662', '92663', '92701', '92702',
            '92703', '92704', '92705', '92706', '92707', '92708', '92780', '92782',
            '92801', '92802', '92804', '92805', '92806', '92807', '92808'
        ]
    },

    // San Francisco County (City and County of San Francisco)
    'San Francisco': {
        cities: ['San Francisco'],
        zipCodes: [
            '94102', '94103', '94104', '94105', '94107', '94108', '94109', '94110',
            '94111', '94112', '94114', '94115', '94116', '94117', '94118', '94121',
            '94122', '94123', '94124', '94127', '94131', '94132', '94133', '94134', '94158'
        ]
    },

    // Santa Clara County (Silicon Valley)
    'Santa Clara': {
        cities: [
            'San Jose', 'Palo Alto', 'Cupertino', 'Sunnyvale', 'Mountain View',
            'Santa Clara', 'Milpitas', 'Campbell', 'Los Gatos', 'Saratoga',
            'Los Altos', 'Menlo Park', 'Redwood City', 'Foster City'
        ],
        zipCodes: [
            '94301', '94302', '94303', '94304', '94305', '94306', '95014', '95015',
            '94087', '94085', '94086', '94089', '94041', '94043', '95110', '95111',
            '95112', '95113', '95116', '95117', '95118', '95119', '95120', '95121',
            '95122', '95123', '95124', '95125', '95126', '95127', '95128', '95129',
            '95130', '95131', '95132', '95133', '95134', '95135', '95136', '95138',
            '95139', '95148'
        ]
    },

    // San Diego County
    'San Diego': {
        cities: [
            'San Diego', 'Coronado', 'Chula Vista', 'Oceanside', 'Escondido',
            'Carlsbad', 'El Cajon', 'Vista', 'San Marcos', 'Encinitas',
            'National City', 'La Mesa', 'Santee', 'Poway', 'Del Mar'
        ],
        zipCodes: [
            '92101', '92102', '92103', '92104', '92105', '92106', '92107', '92108',
            '92109', '92110', '92111', '92113', '92114', '92115', '92116', '92117',
            '92118', '92119', '92120', '92121', '92122', '92123', '92124', '92126',
            '92127', '92128', '92129', '92130', '92131', '92132', '92134', '92135',
            '92136', '92139', '92140', '92154', '92173'
        ]
    },

    // Sacramento County
    'Sacramento': {
        cities: [
            'Sacramento', 'Elk Grove', 'Folsom', 'Citrus Heights', 'Rancho Cordova',
            'Carmichael', 'Arden-Arcade', 'North Highlands', 'Fair Oaks'
        ],
        zipCodes: [
            '95814', '95815', '95816', '95817', '95818', '95819', '95820', '95821',
            '95822', '95823', '95824', '95825', '95826', '95827', '95828', '95829',
            '95831', '95832', '95833', '95834', '95835', '95837', '95838', '95841', '95842'
        ]
    },

    // Santa Barbara County
    'Santa Barbara': {
        cities: [
            'Santa Barbara', 'Goleta', 'Carpinteria', 'Montecito', 'Summerland',
            'Isla Vista', 'Hope Ranch'
        ],
        zipCodes: [
            '93101', '93102', '93103', '93105', '93106', '93107', '93108', '93109',
            '93110', '93111', '93117', '93118', '93121', '93130', '93140', '93150',
            '93160', '93190', '93199'
        ]
    },

    // Ventura County
    'Ventura': {
        cities: [
            'Ventura', 'Oxnard', 'Thousand Oaks', 'Simi Valley', 'Camarillo',
            'Moorpark', 'Port Hueneme', 'Fillmore', 'Ojai', 'Santa Paula'
        ],
        zipCodes: [
            '93001', '93002', '93003', '93004', '93005', '93006', '93007', '93009',
            '93010', '93011', '93012'
        ]
    },

    // San Luis Obispo County
    'San Luis Obispo': {
        cities: [
            'San Luis Obispo', 'Paso Robles', 'Atascadero', 'Morro Bay', 'Pismo Beach',
            'Arroyo Grande', 'Grover Beach', 'Cambria', 'Cayucos'
        ],
        zipCodes: [
            '93401', '93402', '93403', '93405', '93407', '93408', '93409', '93410'
        ]
    },

    // Alameda County
    'Alameda': {
        cities: [
            'Oakland', 'Fremont', 'Berkeley', 'Hayward', 'Alameda', 'San Leandro',
            'Union City', 'Newark', 'Pleasanton', 'Livermore', 'Dublin', 'Emeryville'
        ],
        zipCodes: [
            '94501', '94502', '94536', '94537', '94538', '94539', '94540', '94541',
            '94542', '94544', '94545', '94546', '94550', '94551', '94552', '94555',
            '94566', '94568', '94577', '94578', '94579', '94580', '94586', '94587',
            '94588', '94601', '94602', '94603', '94605', '94606', '94607', '94608',
            '94609', '94610', '94611', '94612', '94618', '94619', '94621', '94702',
            '94703', '94704', '94705', '94706', '94707', '94708', '94709', '94710'
        ]
    },

    // Contra Costa County
    'Contra Costa': {
        cities: [
            'Concord', 'Richmond', 'Antioch', 'Walnut Creek', 'San Ramon', 'Danville',
            'Martinez', 'Pittsburg', 'Brentwood', 'Oakley', 'Pleasant Hill', 'Lafayette'
        ],
        zipCodes: [
            '94506', '94507', '94509', '94511', '94513', '94516', '94517', '94518',
            '94519', '94520', '94521', '94522', '94523', '94524', '94526', '94527',
            '94528', '94529', '94530', '94531', '94547', '94548', '94549', '94553',
            '94556', '94561', '94563', '94564', '94565', '94569', '94572', '94575',
            '94582', '94583', '94595', '94596', '94597', '94598'
        ]
    }
};

// Helper functions for county operations
function getCaliforniaCounties() {
    return Object.keys(californiaCounties).sort();
}

function getCitiesInCounty(countyName) {
    const county = californiaCounties[countyName];
    return county ? county.cities.sort() : [];
}

function getZipCodesInCounty(countyName) {
    const county = californiaCounties[countyName];
    return county ? county.zipCodes.sort() : [];
}

function getCountyByCity(cityName) {
    for (const [county, data] of Object.entries(californiaCounties)) {
        if (data.cities.some(city => city.toLowerCase() === cityName.toLowerCase())) {
            return county;
        }
    }
    return null;
}

function getCountyByZipCode(zipCode) {
    for (const [county, data] of Object.entries(californiaCounties)) {
        if (data.zipCodes.includes(zipCode)) {
            return county;
        }
    }
    return null;
}

function searchCounties(query) {
    const queryLower = query.toLowerCase();
    return Object.keys(californiaCounties).filter(county => 
        county.toLowerCase().includes(queryLower)
    ).sort();
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        californiaCounties,
        getCaliforniaCounties,
        getCitiesInCounty,
        getZipCodesInCounty,
        getCountyByCity,
        getCountyByZipCode,
        searchCounties
    };
}
