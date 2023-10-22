import request from 'supertest';
import express from 'express';
import userController from '../src/controllers/userController';

const app = express();
app.use(express.json());

app.get('/api/users', userController.searchUsers);

describe('Testing searchUsers function', () => {
    it('should respond with a 400 status code when search term is missing', async () => {
      const res = await request(app).get('/api/users');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Missing search term.');
    });
  
    it('should perform a successful search', async () => {

  
      const res = await request(app).get('/api/users?q=John Doe');
      expect(res.statusCode).toEqual(200);

    });
  
    it('should perform a partial match', async () => {
  
      const res = await request(app).get('/api/users?q=New');
      expect(res.statusCode).toEqual(200);

    });
  
    it('should handle case insensitivity', async () => {
  
      const res = await request(app).get('/api/users?q=usa');
      expect(res.statusCode).toEqual(200);
    });
  
    it('should handle no results', async () => {
      const res = await request(app).get('/api/users?q=NonExistentTerm');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveLength(0);
    });
  
  });
  
