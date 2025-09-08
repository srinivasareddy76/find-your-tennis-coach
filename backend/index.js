
const AWS = require('aws-sdk');

// Initialize DynamoDB client
const dynamodb = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION || 'us-east-1'
});

const tableName = process.env.DYNAMODB_TABLE;

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

// Sample coaches data for initialization - Updated with California locations and zip codes
const sampleCoaches = [
    {
        coach_id: '1',
        name: 'Sarah Johnson',
        specialty: 'Beginner & Intermediate',
        location: 'Beverly Hills, CA',
        zip_code: '90210',
        rating: 5,
        experience: '8 years',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0101',
        bio: 'Passionate tennis coach with 8 years of experience helping beginners and intermediate players improve their game.',
        hourly_rate: 75,
        availability: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        certifications: ['USPTA Certified', 'CPR Certified']
    },
    {
        coach_id: '2',
        name: 'Mike Rodriguez',
        specialty: 'Advanced & Competition',
        location: 'Hollywood, CA',
        zip_code: '90028',
        rating: 5,
        experience: '12 years',
        email: 'mike.rodriguez@email.com',
        phone: '+1-555-0102',
        bio: 'Former professional player turned coach, specializing in competitive tennis and advanced techniques.',
        hourly_rate: 120,
        availability: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
        certifications: ['PTR Professional', 'USPTA Master Professional']
    },
    {
        coach_id: '3',
        name: 'Emily Chen',
        specialty: 'Youth & Junior Development',
        location: 'San Francisco, CA',
        zip_code: '94102',
        rating: 5,
        experience: '6 years',
        email: 'emily.chen@email.com',
        phone: '+1-555-0103',
        bio: 'Specialized in youth development with a focus on building strong fundamentals and love for the game.',
        hourly_rate: 60,
        availability: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
        certifications: ['USPTA Certified', 'Youth Development Specialist']
    },
    {
        coach_id: '4',
        name: 'David Thompson',
        specialty: 'Adult Beginner Specialist',
        location: 'Palo Alto, CA',
        zip_code: '94301',
        rating: 5,
        experience: '10 years',
        email: 'david.thompson@email.com',
        phone: '+1-555-0104',
        bio: 'Patient and encouraging coach who helps adult beginners overcome their fears and enjoy tennis.',
        hourly_rate: 80,
        availability: ['Wednesday', 'Friday', 'Saturday', 'Sunday'],
        certifications: ['USPTA Certified', 'Adult Learning Specialist']
    },
    {
        coach_id: '5',
        name: 'Lisa Park',
        specialty: 'Women\'s Tennis & Fitness',
        location: 'Irvine, CA',
        zip_code: '92602',
        rating: 5,
        experience: '7 years',
        email: 'lisa.park@email.com',
        phone: '+1-555-0105',
        bio: 'Combines tennis coaching with fitness training to help women achieve their health and tennis goals.',
        hourly_rate: 85,
        availability: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
        certifications: ['USPTA Certified', 'Fitness Trainer Certified']
    },
    {
        coach_id: '6',
        name: 'Carlos Martinez',
        specialty: 'Clay Court Specialist',
        location: 'San Diego, CA',
        zip_code: '92101',
        rating: 5,
        experience: '15 years',
        email: 'carlos.martinez@email.com',
        phone: '+1-555-0106',
        bio: 'European-trained coach specializing in clay court techniques and strategic play.',
        hourly_rate: 100,
        availability: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
        certifications: ['RPT Certified', 'European Tennis Academy Graduate']
    },
    {
        coach_id: '7',
        name: 'Jennifer Wilson',
        specialty: 'Beginner & Fitness',
        location: 'Santa Barbara, CA',
        zip_code: '93101',
        rating: 5,
        experience: '5 years',
        email: 'jennifer.wilson@email.com',
        phone: '+1-555-0107',
        bio: 'Enthusiastic coach who combines tennis instruction with fitness training for a complete workout experience.',
        hourly_rate: 70,
        availability: ['Monday', 'Tuesday', 'Friday', 'Sunday'],
        certifications: ['USPTA Certified', 'Personal Trainer Certified']
    },
    {
        coach_id: '8',
        name: 'Robert Kim',
        specialty: 'Advanced & Strategy',
        location: 'Cupertino, CA',
        zip_code: '95014',
        rating: 5,
        experience: '11 years',
        email: 'robert.kim@email.com',
        phone: '+1-555-0108',
        bio: 'Strategic tennis coach focusing on advanced techniques and mental game development.',
        hourly_rate: 110,
        availability: ['Wednesday', 'Thursday', 'Saturday', 'Sunday'],
        certifications: ['PTR Professional', 'Mental Performance Coach']
    },
    {
        coach_id: '9',
        name: 'Amanda Davis',
        specialty: 'Intermediate & Doubles',
        location: 'Newport Beach, CA',
        zip_code: '92660',
        rating: 5,
        experience: '9 years',
        email: 'amanda.davis@email.com',
        phone: '+1-555-0109',
        bio: 'Doubles specialist with extensive experience in intermediate player development and team strategies.',
        hourly_rate: 90,
        availability: ['Monday', 'Wednesday', 'Saturday', 'Sunday'],
        certifications: ['USPTA Certified', 'Doubles Strategy Specialist']
    },
    {
        coach_id: '10',
        name: 'James Garcia',
        specialty: 'Youth & Competition',
        location: 'Pasadena, CA',
        zip_code: '91101',
        rating: 5,
        experience: '13 years',
        email: 'james.garcia@email.com',
        phone: '+1-555-0110',
        bio: 'Youth development expert with a track record of preparing junior players for competitive tournaments.',
        hourly_rate: 95,
        availability: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
        certifications: ['USPTA Master Professional', 'Junior Development Specialist']
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
        console.error('Error initializing sample data:', error);
        // Don't throw error, just log it
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

async function getCoaches(queryParams) {
    try {
        let params = {
            TableName: tableName
        };
        
        // Check if search is by zip code or location
        let searchLocation = null;
        let searchZipCode = null;
        
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
        
        // Scan all coaches and filter
        const result = await dynamodb.scan(params).promise();
        let coaches = result.Items;
        
        // Filter by location or zip code
        if (searchLocation || searchZipCode) {
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
        
        // Filter by specialty if provided
        if (queryParams && queryParams.specialty) {
            coaches = coaches.filter(coach => 
                coach.specialty && coach.specialty.toLowerCase().includes(queryParams.specialty.toLowerCase())
            );
        }
        
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(coaches)
        };
    } catch (error) {
        console.error('Error getting coaches:', error);
        throw error;
    }
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
            location: coachData.location,
            zip_code: coachData.zip_code,
            rating: coachData.rating || 5,
            experience: coachData.experience,
            email: coachData.email,
            phone: coachData.phone,
            bio: coachData.bio,
            hourly_rate: coachData.hourly_rate,
            availability: coachData.availability || [],
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
        
        const allowedFields = ['name', 'specialty', 'location', 'zip_code', 'rating', 'experience', 'email', 'phone', 'bio', 'hourly_rate', 'availability', 'certifications'];
        
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

