
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

// Sample coaches data for initialization
const sampleCoaches = [
    {
        coach_id: '1',
        name: 'Sarah Johnson',
        specialty: 'Beginner & Intermediate',
        location: 'New York',
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
        location: 'Los Angeles',
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
        location: 'Chicago',
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
        location: 'Miami',
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
        location: 'Seattle',
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
        location: 'Phoenix',
        rating: 5,
        experience: '15 years',
        email: 'carlos.martinez@email.com',
        phone: '+1-555-0106',
        bio: 'European-trained coach specializing in clay court techniques and strategic play.',
        hourly_rate: 100,
        availability: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
        certifications: ['RPT Certified', 'European Tennis Academy Graduate']
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

async function getCoaches(queryParams) {
    try {
        let params = {
            TableName: tableName
        };
        
        // If location filter is provided, use GSI
        if (queryParams && queryParams.location) {
            params = {
                TableName: tableName,
                IndexName: 'location-index',
                KeyConditionExpression: '#location = :location',
                ExpressionAttributeNames: {
                    '#location': 'location'
                },
                ExpressionAttributeValues: {
                    ':location': queryParams.location
                }
            };
            
            const result = await dynamodb.query(params).promise();
            let coaches = result.Items;
            
            // Filter by specialty if provided
            if (queryParams.specialty) {
                coaches = coaches.filter(coach => 
                    coach.specialty.toLowerCase().includes(queryParams.specialty.toLowerCase())
                );
            }
            
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify(coaches)
            };
        } else {
            // Scan all coaches
            const result = await dynamodb.scan(params).promise();
            let coaches = result.Items;
            
            // Filter by specialty if provided
            if (queryParams && queryParams.specialty) {
                coaches = coaches.filter(coach => 
                    coach.specialty.toLowerCase().includes(queryParams.specialty.toLowerCase())
                );
            }
            
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify(coaches)
            };
        }
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
        
        const allowedFields = ['name', 'specialty', 'location', 'rating', 'experience', 'email', 'phone', 'bio', 'hourly_rate', 'availability', 'certifications'];
        
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

