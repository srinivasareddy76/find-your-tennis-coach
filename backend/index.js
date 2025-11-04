
const AWS = require('aws-sdk');

// Initialize DynamoDB client
const dynamodb = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION || 'us-east-1'
});

const tableName = process.env.DYNAMODB_TABLE || 'find-your-tennis-coach-coaches';

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

// California zip codes data for search functionality
const californiaZipCodes = {
    '90210': 'Beverly Hills',
    '90211': 'Beverly Hills',
    '90212': 'Beverly Hills',
    '90213': 'Beverly Hills',
    '90028': 'Hollywood',
    '90038': 'Hollywood',
    '90068': 'Hollywood',
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
    '94158': 'San Francisco',
    '94301': 'Palo Alto',
    '94302': 'Palo Alto',
    '94303': 'Palo Alto',
    '94304': 'Palo Alto',
    '94305': 'Palo Alto',
    '94306': 'Palo Alto',
    '92602': 'Irvine',
    '92603': 'Irvine',
    '92604': 'Irvine',
    '92606': 'Irvine',
    '92612': 'Irvine',
    '92614': 'Irvine',
    '92617': 'Irvine',
    '92618': 'Irvine',
    '92620': 'Irvine',
    '92697': 'Irvine',
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
    '92145': 'San Diego',
    '92147': 'San Diego',
    '92154': 'San Diego',
    '92155': 'San Diego',
    '92158': 'San Diego',
    '92159': 'San Diego',
    '92160': 'San Diego',
    '92161': 'San Diego',
    '92162': 'San Diego',
    '92163': 'San Diego',
    '92165': 'San Diego',
    '92166': 'San Diego',
    '92167': 'San Diego',
    '92168': 'San Diego',
    '92169': 'San Diego',
    '92170': 'San Diego',
    '92171': 'San Diego',
    '92172': 'San Diego',
    '92174': 'San Diego',
    '92175': 'San Diego',
    '92176': 'San Diego',
    '92177': 'San Diego',
    '92179': 'San Diego',
    '92182': 'San Diego',
    '92186': 'San Diego',
    '92187': 'San Diego',
    '92191': 'San Diego',
    '92192': 'San Diego',
    '92193': 'San Diego',
    '92195': 'San Diego',
    '92196': 'San Diego',
    '92197': 'San Diego',
    '92198': 'San Diego',
    '92199': 'San Diego',
    '93101': 'Santa Barbara',
    '93102': 'Santa Barbara',
    '93103': 'Santa Barbara',
    '93105': 'Santa Barbara',
    '93106': 'Santa Barbara',
    '93107': 'Santa Barbara',
    '93108': 'Santa Barbara',
    '93109': 'Santa Barbara',
    '93110': 'Santa Barbara',
    '93111': 'Santa Barbara',
    '93117': 'Santa Barbara',
    '93118': 'Santa Barbara',
    '93120': 'Santa Barbara',
    '93121': 'Santa Barbara',
    '93130': 'Santa Barbara',
    '93140': 'Santa Barbara',
    '93150': 'Santa Barbara',
    '93160': 'Santa Barbara',
    '93190': 'Santa Barbara',
    '95014': 'Cupertino',
    '95015': 'Cupertino',
    '92660': 'Newport Beach',
    '92661': 'Newport Beach',
    '92662': 'Newport Beach',
    '92663': 'Newport Beach',
    '91101': 'Pasadena',
    '91102': 'Pasadena',
    '91103': 'Pasadena',
    '91104': 'Pasadena',
    '91105': 'Pasadena',
    '91106': 'Pasadena',
    '91107': 'Pasadena',
    '91108': 'Pasadena',
    '91109': 'Pasadena',
    '91110': 'Pasadena',
    '91114': 'Pasadena',
    '91115': 'Pasadena',
    '91116': 'Pasadena',
    '91117': 'Pasadena',
    '91118': 'Pasadena',
    '91121': 'Pasadena',
    '91123': 'Pasadena',
    '91124': 'Pasadena',
    '91125': 'Pasadena',
    '91126': 'Pasadena',
    '91129': 'Pasadena',
    '91131': 'Pasadena',
    '91182': 'Pasadena',
    '91184': 'Pasadena',
    '91185': 'Pasadena',
    '91188': 'Pasadena',
    '91189': 'Pasadena'
};

// Sample coaches data for initialization - Enhanced with counties, skill levels, and weekend/holiday availability
const sampleCoaches = [
    {
        coach_id: '1',
        name: 'Sarah Johnson',
        specialty: 'Beginner & Intermediate',
        skill_levels: ['Beginner', 'Intermediate'],
        location: 'Beverly Hills, CA',
        county: 'Los Angeles',
        zip_code: '90210',
        rating: 5,
        experience: '8 years',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0101',
        bio: 'Passionate tennis coach with 8 years of experience helping beginners and intermediate players improve their game.',
        hourly_rate: 75,
        availability: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        weekend_available: true,
        holiday_available: true,
        certifications: ['USPTA Certified', 'CPR Certified']
    },
    {
        coach_id: '2',
        name: 'Mike Rodriguez',
        specialty: 'Advanced & Competition',
        skill_levels: ['Advanced'],
        location: 'Hollywood, CA',
        county: 'Los Angeles',
        zip_code: '90028',
        rating: 5,
        experience: '12 years',
        email: 'mike.rodriguez@email.com',
        phone: '+1-555-0102',
        bio: 'Former professional player turned coach, specializing in competitive tennis and advanced techniques.',
        hourly_rate: 120,
        availability: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
        weekend_available: true,
        holiday_available: false,
        certifications: ['PTR Professional', 'USPTA Master Professional']
    },
    {
        coach_id: '3',
        name: 'Emily Chen',
        specialty: 'Youth & Junior Development',
        skill_levels: ['Beginner', 'Intermediate'],
        location: 'San Francisco, CA',
        county: 'San Francisco',
        zip_code: '94102',
        rating: 5,
        experience: '6 years',
        email: 'emily.chen@email.com',
        phone: '+1-555-0103',
        bio: 'Specialized in youth development with a focus on building strong fundamentals and love for the game.',
        hourly_rate: 60,
        availability: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
        weekend_available: true,
        holiday_available: true,
        certifications: ['USPTA Certified', 'Youth Development Specialist']
    },
    {
        coach_id: '4',
        name: 'David Thompson',
        specialty: 'Adult Beginner Specialist',
        skill_levels: ['Beginner'],
        location: 'Palo Alto, CA',
        county: 'Santa Clara',
        zip_code: '94301',
        rating: 5,
        experience: '10 years',
        email: 'david.thompson@email.com',
        phone: '+1-555-0104',
        bio: 'Patient and encouraging coach who helps adult beginners overcome their fears and enjoy tennis.',
        hourly_rate: 80,
        availability: ['Wednesday', 'Friday', 'Saturday', 'Sunday'],
        weekend_available: true,
        holiday_available: true,
        certifications: ['USPTA Certified', 'Adult Learning Specialist']
    },
    {
        coach_id: '5',
        name: 'Lisa Park',
        specialty: 'Women\'s Tennis & Fitness',
        skill_levels: ['Beginner', 'Intermediate'],
        location: 'Irvine, CA',
        county: 'Orange',
        zip_code: '92602',
        rating: 5,
        experience: '7 years',
        email: 'lisa.park@email.com',
        phone: '+1-555-0105',
        bio: 'Combines tennis coaching with fitness training to help women achieve their health and tennis goals.',
        hourly_rate: 85,
        availability: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
        weekend_available: true,
        holiday_available: false,
        certifications: ['USPTA Certified', 'Fitness Trainer Certified']
    },
    {
        coach_id: '6',
        name: 'Carlos Martinez',
        specialty: 'Clay Court Specialist',
        skill_levels: ['Intermediate', 'Advanced'],
        location: 'San Diego, CA',
        county: 'San Diego',
        zip_code: '92101',
        rating: 5,
        experience: '15 years',
        email: 'carlos.martinez@email.com',
        phone: '+1-555-0106',
        bio: 'European-trained coach specializing in clay court techniques and strategic play.',
        hourly_rate: 100,
        availability: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
        weekend_available: true,
        holiday_available: true,
        certifications: ['RPT Certified', 'European Tennis Academy Graduate']
    },
    {
        coach_id: '7',
        name: 'Jennifer Wilson',
        specialty: 'Beginner & Fitness',
        skill_levels: ['Beginner'],
        location: 'Santa Barbara, CA',
        county: 'Santa Barbara',
        zip_code: '93101',
        rating: 5,
        experience: '5 years',
        email: 'jennifer.wilson@email.com',
        phone: '+1-555-0107',
        bio: 'Enthusiastic coach who combines tennis instruction with fitness training for a complete workout experience.',
        hourly_rate: 70,
        availability: ['Monday', 'Tuesday', 'Friday', 'Sunday'],
        weekend_available: true,
        holiday_available: true,
        certifications: ['USPTA Certified', 'Personal Trainer Certified']
    },
    {
        coach_id: '8',
        name: 'Robert Kim',
        specialty: 'Advanced & Strategy',
        skill_levels: ['Advanced'],
        location: 'Cupertino, CA',
        county: 'Santa Clara',
        zip_code: '95014',
        rating: 5,
        experience: '11 years',
        email: 'robert.kim@email.com',
        phone: '+1-555-0108',
        bio: 'Strategic tennis coach focusing on advanced techniques and mental game development.',
        hourly_rate: 110,
        availability: ['Wednesday', 'Thursday', 'Saturday', 'Sunday'],
        weekend_available: true,
        holiday_available: false,
        certifications: ['PTR Professional', 'Mental Performance Coach']
    },
    {
        coach_id: '9',
        name: 'Amanda Davis',
        specialty: 'Intermediate & Doubles',
        skill_levels: ['Intermediate'],
        location: 'Newport Beach, CA',
        county: 'Orange',
        zip_code: '92660',
        rating: 5,
        experience: '9 years',
        email: 'amanda.davis@email.com',
        phone: '+1-555-0109',
        bio: 'Doubles specialist with extensive experience in intermediate player development and team strategies.',
        hourly_rate: 90,
        availability: ['Monday', 'Wednesday', 'Saturday', 'Sunday'],
        weekend_available: true,
        holiday_available: true,
        certifications: ['USPTA Certified', 'Doubles Strategy Specialist']
    },
    {
        coach_id: '10',
        name: 'James Garcia',
        specialty: 'Youth & Competition',
        skill_levels: ['Beginner', 'Intermediate', 'Advanced'],
        location: 'Pasadena, CA',
        county: 'Los Angeles',
        zip_code: '91101',
        rating: 5,
        experience: '13 years',
        email: 'james.garcia@email.com',
        phone: '+1-555-0110',
        bio: 'Youth development expert with a track record of preparing junior players for competitive tournaments.',
        hourly_rate: 95,
        availability: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
        weekend_available: true,
        holiday_available: true,
        certifications: ['USPTA Master Professional', 'Junior Development Specialist']
    },
    {
        coach_id: '11',
        name: 'Maria Gonzalez',
        specialty: 'All Levels Instructor',
        skill_levels: ['Beginner', 'Intermediate', 'Advanced'],
        location: 'Sacramento, CA',
        county: 'Sacramento',
        zip_code: '95814',
        rating: 5,
        experience: '9 years',
        email: 'maria.gonzalez@email.com',
        phone: '+1-555-0111',
        bio: 'Versatile coach experienced in teaching all skill levels with personalized training approaches.',
        hourly_rate: 85,
        availability: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
        weekend_available: true,
        holiday_available: true,
        certifications: ['USPTA Certified', 'Multi-Level Training Specialist']
    },
    {
        coach_id: '12',
        name: 'Kevin Wong',
        specialty: 'Advanced Competition Coach',
        skill_levels: ['Advanced'],
        location: 'Oakland, CA',
        county: 'Alameda',
        zip_code: '94601',
        rating: 5,
        experience: '14 years',
        email: 'kevin.wong@email.com',
        phone: '+1-555-0112',
        bio: 'Former collegiate player specializing in tournament preparation and advanced competitive strategies.',
        hourly_rate: 115,
        availability: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
        weekend_available: true,
        holiday_available: false,
        certifications: ['PTR Professional', 'Tournament Preparation Specialist']
    },
    {
        coach_id: '13',
        name: 'Rachel Thompson',
        specialty: 'Beginner & Youth Coach',
        skill_levels: ['Beginner'],
        location: 'Ventura, CA',
        county: 'Ventura',
        zip_code: '93001',
        rating: 5,
        experience: '6 years',
        email: 'rachel.thompson@email.com',
        phone: '+1-555-0113',
        bio: 'Specializes in introducing tennis to children and adult beginners with fun, engaging methods.',
        hourly_rate: 65,
        availability: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
        weekend_available: true,
        holiday_available: true,
        certifications: ['USPTA Certified', 'Youth Tennis Development']
    },
    {
        coach_id: '14',
        name: 'Alex Rivera',
        specialty: 'Intermediate Skills Development',
        skill_levels: ['Intermediate'],
        location: 'Concord, CA',
        county: 'Contra Costa',
        zip_code: '94520',
        rating: 5,
        experience: '8 years',
        email: 'alex.rivera@email.com',
        phone: '+1-555-0114',
        bio: 'Focuses on helping intermediate players break through plateaus and advance their game.',
        hourly_rate: 90,
        availability: ['Tuesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        weekend_available: true,
        holiday_available: true,
        certifications: ['USPTA Certified', 'Intermediate Development Specialist']
    },
    {
        coach_id: '15',
        name: 'Sophie Martinez',
        specialty: 'Weekend & Holiday Specialist',
        skill_levels: ['Beginner', 'Intermediate'],
        location: 'San Luis Obispo, CA',
        county: 'San Luis Obispo',
        zip_code: '93401',
        rating: 5,
        experience: '7 years',
        email: 'sophie.martinez@email.com',
        phone: '+1-555-0115',
        bio: 'Dedicated to providing flexible coaching schedules for busy professionals and families.',
        hourly_rate: 80,
        availability: ['Saturday', 'Sunday'],
        weekend_available: true,
        holiday_available: true,
        certifications: ['USPTA Certified', 'Flexible Scheduling Specialist']
    }
];

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const { httpMethod, path, pathParameters, queryStringParameters, body } = event;
    
    try {
        // Handle CORS preflight requests
        if (httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: ''
            };
        }

        // Initialize sample data if table is empty
        await initializeSampleData();

        // Route requests
        switch (httpMethod) {
            case 'GET':
                if (path === '/coaches' || path === '/prod/coaches') {
                    return await getCoaches(queryStringParameters);
                } else if (path === '/zip-codes' || path === '/prod/zip-codes') {
                    return await getZipCodes();
                } else if (path === '/counties' || path === '/prod/counties') {
                    return await getCounties();
                } else if (pathParameters && pathParameters.id) {
                    return await getCoachById(pathParameters.id);
                }
                break;
                
            case 'POST':
                if (path === '/coaches' || path === '/prod/coaches') {
                    return await createCoach(JSON.parse(body || '{}'));
                }
                break;
                
            case 'PUT':
                if (pathParameters && pathParameters.id) {
                    return await updateCoach(pathParameters.id, JSON.parse(body || '{}'));
                }
                break;
                
            case 'DELETE':
                if (pathParameters && pathParameters.id) {
                    return await deleteCoach(pathParameters.id);
                }
                break;
        }
        
        return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Not found' })
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Internal server error', details: error.message })
        };
    }
};

// In-memory storage for testing when DynamoDB is not available
let inMemoryCoaches = null;

async function initializeSampleData() {
    try {
        // Check if table has data
        const scanResult = await dynamodb.scan({
            TableName: tableName,
            Limit: 1
        }).promise();
        
        // If table is empty, add sample data
        if (scanResult.Items.length === 0) {
            console.log('Initializing sample data...');
            
            for (const coach of sampleCoaches) {
                await dynamodb.put({
                    TableName: tableName,
                    Item: coach
                }).promise();
            }
            
            console.log('Sample data initialized successfully');
        }
    } catch (error) {
        console.error('Error initializing sample data (using in-memory storage):', error.message);
        // Use in-memory storage for testing
        inMemoryCoaches = [...sampleCoaches];
    }
}

async function getZipCodes() {
    try {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(californiaZipCodes)
        };
    } catch (error) {
        console.error('Error getting zip codes:', error);
        throw error;
    }
}

async function getCounties() {
    try {
        // California counties list
        const californiaCountiesList = [
            'Los Angeles', 'Orange', 'San Francisco', 'Santa Clara', 'San Diego',
            'Sacramento', 'Santa Barbara', 'Ventura', 'San Luis Obispo',
            'Alameda', 'Contra Costa'
        ];
        
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(californiaCountiesList.sort())
        };
    } catch (error) {
        console.error('Error getting counties:', error);
        throw error;
    }
}

async function getCoaches(queryParams) {
    try {
        let params = {
            TableName: tableName
        };
        
        // Check if search is by zip code, location, or county
        let searchLocation = null;
        let searchZipCode = null;
        let searchCounty = null;
        
        if (queryParams && queryParams.location) {
            const searchTerm = queryParams.location.trim();
            
            // Check if it's a zip code (5 digits)
            if (/^\d{5}$/.test(searchTerm)) {
                searchZipCode = searchTerm;
                // Convert zip code to city name for location search as well
                if (californiaZipCodes[searchTerm]) {
                    searchLocation = californiaZipCodes[searchTerm];
                }
            } else {
                searchLocation = searchTerm;
            }
        }
        
        // Check for county search
        if (queryParams && queryParams.county) {
            searchCounty = queryParams.county.trim();
        }
        
        // Scan all coaches and filter
        const result = await dynamodb.scan(params).promise();
        let coaches = result.Items;
        
        // Filter by location, zip code, or county
        if (searchLocation || searchZipCode || searchCounty) {
            coaches = coaches.filter(coach => {
                let locationMatch = false;
                let zipMatch = false;
                let countyMatch = false;
                
                // Check location match (city name)
                if (searchLocation && coach.location) {
                    locationMatch = coach.location.toLowerCase().includes(searchLocation.toLowerCase());
                }
                
                // Check zip code match
                if (searchZipCode && coach.zip_code) {
                    zipMatch = coach.zip_code === searchZipCode;
                }
                
                // Check county match
                if (searchCounty && coach.county) {
                    countyMatch = coach.county.toLowerCase().includes(searchCounty.toLowerCase());
                }
                
                // If searching by zip code, also check if the city name matches
                if (searchZipCode && coach.location && californiaZipCodes[searchZipCode]) {
                    const cityFromZip = californiaZipCodes[searchZipCode];
                    locationMatch = coach.location.toLowerCase().includes(cityFromZip.toLowerCase());
                }
                
                return locationMatch || zipMatch || countyMatch;
            });
        }
        
        // Filter by specialty if provided
        if (queryParams && queryParams.specialty) {
            coaches = coaches.filter(coach => 
                coach.specialty && coach.specialty.toLowerCase().includes(queryParams.specialty.toLowerCase())
            );
        }
        
        // Filter by skill level if provided
        if (queryParams && queryParams.skill_level) {
            const requestedSkillLevel = queryParams.skill_level.toLowerCase();
            coaches = coaches.filter(coach => 
                coach.skill_levels && coach.skill_levels.some(level => 
                    level.toLowerCase() === requestedSkillLevel
                )
            );
        }
        
        // Filter by weekend availability if requested
        if (queryParams && queryParams.weekend_available === 'true') {
            coaches = coaches.filter(coach => coach.weekend_available === true);
        }
        
        // Filter by holiday availability if requested
        if (queryParams && queryParams.holiday_available === 'true') {
            coaches = coaches.filter(coach => coach.holiday_available === true);
        }
        
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(coaches)
        };
    } catch (error) {
        console.error('Error getting coaches (using in-memory storage):', error.message);
        // Fallback to in-memory storage
        if (!inMemoryCoaches) {
            inMemoryCoaches = [...sampleCoaches];
        }
        return getCoachesFromMemory(queryParams);
    }
}

function getCoachesFromMemory(queryParams) {
    let coaches = [...inMemoryCoaches];

    if (!queryParams || Object.keys(queryParams).length === 0) {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(coaches)
        };
    }

    // Apply filters similar to DynamoDB version
    if (queryParams.location) {
        const searchTerm = queryParams.location.trim();
        let searchLocation = null;
        let searchZipCode = null;
        
        // Check if it's a zip code (5 digits)
        if (/^\d{5}$/.test(searchTerm)) {
            searchZipCode = searchTerm;
            // Convert zip code to city name for location search as well
            if (californiaZipCodes[searchTerm]) {
                searchLocation = californiaZipCodes[searchTerm];
            }
        } else {
            searchLocation = searchTerm;
        }
        
        coaches = coaches.filter(coach => {
            let locationMatch = false;
            let zipMatch = false;
            
            // Check location match (city name)
            if (searchLocation && coach.location) {
                locationMatch = coach.location.toLowerCase().includes(searchLocation.toLowerCase());
            }
            
            // Check zip code match
            if (searchZipCode && coach.zip_code) {
                zipMatch = coach.zip_code === searchZipCode;
            }
            
            // If searching by zip code, also check if the city name matches
            if (searchZipCode && coach.location && californiaZipCodes[searchZipCode]) {
                const cityFromZip = californiaZipCodes[searchZipCode];
                locationMatch = coach.location.toLowerCase().includes(cityFromZip.toLowerCase());
            }
            
            return locationMatch || zipMatch;
        });
    }

    if (queryParams.county) {
        coaches = coaches.filter(coach => 
            coach.county && coach.county.toLowerCase().includes(queryParams.county.toLowerCase())
        );
    }

    if (queryParams.skill_level) {
        const requestedSkillLevel = queryParams.skill_level.toLowerCase();
        coaches = coaches.filter(coach => 
            coach.skill_levels && coach.skill_levels.some(level => 
                level.toLowerCase() === requestedSkillLevel
            )
        );
    }

    if (queryParams.specialty) {
        coaches = coaches.filter(coach => 
            coach.specialty && coach.specialty.toLowerCase().includes(queryParams.specialty.toLowerCase())
        );
    }

    if (queryParams.weekend_available === 'true') {
        coaches = coaches.filter(coach => coach.weekend_available === true);
    }

    if (queryParams.holiday_available === 'true') {
        coaches = coaches.filter(coach => coach.holiday_available === true);
    }

    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(coaches)
    };
}

async function getCoachById(coachId) {
    try {
        const params = {
            TableName: tableName,
            Key: {
                coach_id: coachId
            }
        };
        
        const result = await dynamodb.get(params).promise();
        
        if (!result.Item) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Coach not found' })
            };
        }
        
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(result.Item)
        };
    } catch (error) {
        console.error('Error getting coach by ID:', error);
        throw error;
    }
}

async function createCoach(coachData) {
    try {
        // Generate unique ID
        const coachId = Date.now().toString();
        
        const coach = {
            coach_id: coachId,
            name: coachData.name,
            specialty: coachData.specialty,
            skill_levels: coachData.skill_levels || [],
            location: coachData.location,
            county: coachData.county,
            zip_code: coachData.zip_code,
            rating: coachData.rating || 5,
            experience: coachData.experience,
            email: coachData.email,
            phone: coachData.phone,
            bio: coachData.bio,
            hourly_rate: coachData.hourly_rate,
            availability: coachData.availability || [],
            weekend_available: coachData.weekend_available || false,
            holiday_available: coachData.holiday_available || false,
            certifications: coachData.certifications || [],
            created_at: new Date().toISOString()
        };
        
        const params = {
            TableName: tableName,
            Item: coach
        };
        
        await dynamodb.put(params).promise();
        
        return {
            statusCode: 201,
            headers: corsHeaders,
            body: JSON.stringify(coach)
        };
    } catch (error) {
        console.error('Error creating coach:', error);
        throw error;
    }
}

async function updateCoach(coachId, updateData) {
    try {
        // First check if coach exists
        const getParams = {
            TableName: tableName,
            Key: {
                coach_id: coachId
            }
        };
        
        const existingCoach = await dynamodb.get(getParams).promise();
        
        if (!existingCoach.Item) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Coach not found' })
            };
        }
        
        // Build update expression
        let updateExpression = 'SET ';
        let expressionAttributeValues = {};
        let expressionAttributeNames = {};
        
        const allowedFields = ['name', 'specialty', 'skill_levels', 'location', 'county', 'zip_code', 'rating', 'experience', 'email', 'phone', 'bio', 'hourly_rate', 'availability', 'weekend_available', 'holiday_available', 'certifications'];
        
        const updates = [];
        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key)) {
                updates.push(`#${key} = :${key}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:${key}`] = updateData[key];
            }
        });
        
        if (updates.length === 0) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'No valid fields to update' })
            };
        }
        
        updateExpression += updates.join(', ');
        updateExpression += ', updated_at = :updated_at';
        expressionAttributeValues[':updated_at'] = new Date().toISOString();
        
        const params = {
            TableName: tableName,
            Key: {
                coach_id: coachId
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames,
            ReturnValues: 'ALL_NEW'
        };
        
        const result = await dynamodb.update(params).promise();
        
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(result.Attributes)
        };
    } catch (error) {
        console.error('Error updating coach:', error);
        throw error;
    }
}

async function deleteCoach(coachId) {
    try {
        const params = {
            TableName: tableName,
            Key: {
                coach_id: coachId
            },
            ReturnValues: 'ALL_OLD'
        };
        
        const result = await dynamodb.delete(params).promise();
        
        if (!result.Attributes) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Coach not found' })
            };
        }
        
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'Coach deleted successfully' })
        };
    } catch (error) {
        console.error('Error deleting coach:', error);
        throw error;
    }
}

