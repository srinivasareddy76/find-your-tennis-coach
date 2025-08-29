







import { test, expect } from '@playwright/test';
import axios from 'axios';

/**
 * API Layer Tests for Find Your Tennis Coach Backend
 * Tests all REST API endpoints and data operations
 */

test.describe('Tennis Coach API Tests', () => {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';
  
  test.describe('Coach Management API', () => {
    
    test('GET /coaches - should return list of coaches', async () => {
      const response = await axios.get(`${baseURL}/coaches`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBeTruthy();
      
      // Verify coach data structure
      if (response.data.length > 0) {
        const coach = response.data[0];
        expect(coach).toHaveProperty('id');
        expect(coach).toHaveProperty('name');
        expect(coach).toHaveProperty('specialty');
        expect(coach).toHaveProperty('location');
        expect(coach).toHaveProperty('rating');
        expect(coach).toHaveProperty('experience');
        expect(coach).toHaveProperty('hourlyRate');
        expect(coach).toHaveProperty('bio');
        expect(coach).toHaveProperty('image');
      }
    });

    test('GET /coaches/{id} - should return specific coach', async () => {
      // First get all coaches to find a valid ID
      const allCoaches = await axios.get(`${baseURL}/coaches`);
      expect(allCoaches.status).toBe(200);
      
      if (allCoaches.data.length > 0) {
        const coachId = allCoaches.data[0].id;
        const response = await axios.get(`${baseURL}/coaches/${coachId}`);
        
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('id', coachId);
        expect(response.data).toHaveProperty('name');
        expect(response.data).toHaveProperty('specialty');
      }
    });

    test('GET /coaches/{invalid-id} - should return 404', async () => {
      try {
        await axios.get(`${baseURL}/coaches/invalid-id-12345`);
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    test('POST /coaches - should create new coach', async () => {
      const newCoach = {
        name: 'Test Coach',
        specialty: 'Test Specialty',
        location: 'Test City',
        rating: 4.5,
        experience: '5 years',
        hourlyRate: '$75/hour',
        bio: 'Test bio for automated testing',
        image: 'test-image.svg'
      };

      const response = await axios.post(`${baseURL}/coaches`, newCoach, {
        headers: { 'Content-Type': 'application/json' }
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.name).toBe(newCoach.name);
      expect(response.data.specialty).toBe(newCoach.specialty);
      
      // Store the created coach ID for cleanup
      const createdCoachId = response.data.id;
      
      // Verify the coach was actually created
      const getResponse = await axios.get(`${baseURL}/coaches/${createdCoachId}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.data.name).toBe(newCoach.name);
    });

    test('POST /coaches - should validate required fields', async () => {
      const invalidCoach = {
        name: 'Test Coach'
        // Missing required fields
      };

      try {
        await axios.post(`${baseURL}/coaches`, invalidCoach, {
          headers: { 'Content-Type': 'application/json' }
        });
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('PUT /coaches/{id} - should update existing coach', async () => {
      // First create a coach to update
      const newCoach = {
        name: 'Update Test Coach',
        specialty: 'Original Specialty',
        location: 'Original City',
        rating: 4.0,
        experience: '3 years',
        hourlyRate: '$60/hour',
        bio: 'Original bio',
        image: 'original-image.svg'
      };

      const createResponse = await axios.post(`${baseURL}/coaches`, newCoach, {
        headers: { 'Content-Type': 'application/json' }
      });
      expect(createResponse.status).toBe(201);
      
      const coachId = createResponse.data.id;
      
      // Now update the coach
      const updatedCoach = {
        ...newCoach,
        specialty: 'Updated Specialty',
        location: 'Updated City',
        rating: 4.8
      };

      const updateResponse = await axios.put(`${baseURL}/coaches/${coachId}`, updatedCoach, {
        headers: { 'Content-Type': 'application/json' }
      });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data.specialty).toBe('Updated Specialty');
      expect(updateResponse.data.location).toBe('Updated City');
      expect(updateResponse.data.rating).toBe(4.8);
    });

    test('DELETE /coaches/{id} - should delete existing coach', async () => {
      // First create a coach to delete
      const newCoach = {
        name: 'Delete Test Coach',
        specialty: 'Test Specialty',
        location: 'Test City',
        rating: 4.0,
        experience: '2 years',
        hourlyRate: '$50/hour',
        bio: 'Coach to be deleted',
        image: 'delete-test.svg'
      };

      const createResponse = await axios.post(`${baseURL}/coaches`, newCoach, {
        headers: { 'Content-Type': 'application/json' }
      });
      expect(createResponse.status).toBe(201);
      
      const coachId = createResponse.data.id;
      
      // Delete the coach
      const deleteResponse = await axios.delete(`${baseURL}/coaches/${coachId}`);
      expect(deleteResponse.status).toBe(200);
      
      // Verify the coach was deleted
      try {
        await axios.get(`${baseURL}/coaches/${coachId}`);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  test.describe('API Error Handling', () => {
    
    test('should handle malformed JSON', async () => {
      try {
        await axios.post(`${baseURL}/coaches`, 'invalid-json', {
          headers: { 'Content-Type': 'application/json' }
        });
        expect(true).toBe(false);
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('should handle missing Content-Type header', async () => {
      const newCoach = {
        name: 'Test Coach',
        specialty: 'Test Specialty'
      };

      try {
        const response = await axios.post(`${baseURL}/coaches`, newCoach);
        // Some APIs might accept this, so we check for either success or proper error
        expect([200, 201, 400].includes(response.status)).toBeTruthy();
      } catch (error) {
        expect([400, 415].includes(error.response.status)).toBeTruthy();
      }
    });
  });

  test.describe('CORS Headers', () => {
    
    test('should include proper CORS headers', async () => {
      const response = await axios.get(`${baseURL}/coaches`);
      
      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-methods']).toBeDefined();
      expect(response.headers['access-control-allow-headers']).toBeDefined();
    });

    test('OPTIONS request should return CORS headers', async () => {
      const response = await axios.options(`${baseURL}/coaches`);
      
      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-methods']).toBeDefined();
    });
  });

  test.describe('Performance Tests', () => {
    
    test('API response time should be reasonable', async () => {
      const startTime = Date.now();
      const response = await axios.get(`${baseURL}/coaches`);
      const endTime = Date.now();
      
      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(5000); // Should respond within 5 seconds
    });

    test('should handle concurrent requests', async () => {
      const requests = Array(5).fill(null).map(() => 
        axios.get(`${baseURL}/coaches`)
      );
      
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBeTruthy();
      });
    });
  });
});







