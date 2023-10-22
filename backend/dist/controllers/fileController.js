"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const db = require('../db');
const data = [];
const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    const filePath = req.file.path;
    const fileRows = [];
    // Ensure that the file has a .csv extension
    if (!req.file.originalname.endsWith('.csv')) {
        fs_1.default.unlinkSync(filePath);
        return res
            .status(400)
            .json({ message: 'Invalid file format. Only CSV files are accepted.' });
    }
    // Read the CSV file and parse it with a comma separator, treating the first row as headers
    fs_1.default.createReadStream(filePath)
        .pipe((0, csv_parser_1.default)({ separator: ',' }))
        .on('data', (row) => {
        console.log('Row Data:', row);
        const insertQuery = `INSERT INTO csv_data (name, city, country, favorite_sport) VALUES (?, ?, ?, ?)`;
        db.run(insertQuery, [row.name, row.city, row.country, row.favorite_sport], (err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: `Error inserting data into the database: ${err.message}` });
            }
        });
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
exports.default = {
    uploadFile,
};
