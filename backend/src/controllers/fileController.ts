import { Request, Response } from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import { CsvRow } from '../types/row';

const db = require('../db');

const data: CsvRow[] = [];

const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const filePath = req.file.path;
  const fileRows: CsvRow[] = [];

  // Ensure that the file has a .csv extension
  if (!req.file.originalname.endsWith('.csv')) {
    fs.unlinkSync(filePath);
    return res
      .status(400)
      .json({ message: 'Invalid file format. Only CSV files are accepted.' });
  }

  // Read the CSV file and parse it with a comma separator, treating the first row as headers
  fs.createReadStream(filePath)
    .pipe(csv({ separator: ',' })) 
    .on('data', (row: CsvRow) => {
     

      console.log('Row Data:', row);
       
        const insertQuery = `INSERT INTO csv_data (name, city, country, favorite_sport) VALUES (?, ?, ?, ?)`;

        db.run(
          insertQuery,
          [row.name, row.city, row.country, row.favorite_sport],
          (err: Error) => {
            if (err) {
              return res
                .status(500)
                .json({ message: `Error inserting data into the database: ${err.message}` });
            }
          }
        );
      
    })
    .on('end', () => {

      res.status(200).json({ message: 'The file was uploaded successfully.' });
    })
    .on('error', (error) => {
      res
        .status(500)
        .json({ message: `Error processing the file: ${error.message}` });
    });
};

export default {
  uploadFile,
};
