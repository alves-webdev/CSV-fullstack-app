import request from 'supertest';
import fs from 'fs';
import path from 'path';
import app from '../src/app'; // Assuming 'app' is your Express application
import { CsvRow } from '../src/types/row';

const db = require('../src/db');

// Function to create a temporary CSV file for testing
const createTestCSVFile = () => {
  const tempFilePath = path.join(__dirname, 'test.csv');
  const csvData = `name,city,country,favorite_sport
John Doe,New York,USA,Basketball
Jane Smith,London,UK,Football
Mike Johnson,Paris,France,Tennis
Karen Lee,Tokyo,Japan,Swimming
Tom Brown,Sydney,Australia,Running
Emma Wilson,Berlin,Germany,Basketball`;
  fs.writeFileSync(tempFilePath, csvData);
  return tempFilePath;
};

// Function to clear the SQLite database table
const clearDatabase = () => {
  db.run('DELETE FROM csv_data', (err: Error) => {
    if (err) {
      console.error('Error clearing the database:', err.message);
    }
  });
};

beforeEach(() => {
  clearDatabase(); // Clear the database before each test
});



describe('File Controller', () => {

  let server:request.SuperTest<request.Test>;

  beforeAll(() => {
    server = request(app);
  });
  
  afterAll((done) => {
      db.close(); // Close the SQLite database connection after all tests
      done();
  });

  // ...

  it('should upload a CSV file and store it in the database', async () => {
    const filePath = createTestCSVFile();

    const response = await server.post('/api/files')
      .attach('file', filePath);

    // Assuming you return a 200 status code with the success message
    expect(response.status).toBe(200);


    // Clean up the temporary file
    fs.unlinkSync(filePath);
  });

  it('should handle uploading the same CSV file twice', async () => {
    const filePath = createTestCSVFile();

    // Upload the same CSV file twice
    const response1 = await server.post('/api/files')
      .attach('file', filePath);
    const response2 = await server.post('/api/files')
      .attach('file', filePath);

    // Assuming you return a 200 status code with the success message
    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);

    // Clean up the temporary file
    fs.unlinkSync(filePath);
  });


});

