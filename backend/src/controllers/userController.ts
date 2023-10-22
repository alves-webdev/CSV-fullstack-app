import { Request, Response } from 'express';
import {CsvRow} from '../types/row'

const db = require('../db'); // Import the SQLite database connection

const searchUsers = (req: Request, res: Response) => {
  const searchTerm = req.query.q;

  if (!searchTerm) {
    return res.status(400).json({ message: 'Missing search term.' });
  }

  const searchQuery = `
    SELECT name, city, country, favorite_sport
    FROM csv_data
    WHERE
      name LIKE ? OR
      city LIKE ? OR
      country LIKE ? OR
      favorite_sport LIKE ?
  `;

  const likeTerm = `%${searchTerm}%`;

  db.all(searchQuery, [likeTerm, likeTerm, likeTerm, likeTerm], (err: Error, rows: CsvRow) => {
    if (err) {
      return res.status(500).json({ message: `Database error: ${err.message}` });
    }

    res.status(200).json({ data: rows });
  });
};

export default {
  searchUsers,
};
