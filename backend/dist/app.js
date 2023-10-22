"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileRoutes_1 = __importDefault(require("./routes/fileRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cors_1 = __importDefault(require("cors"));
const db = require('./db');
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS csv_data (
      name TEXT,
      city TEXT,
      country TEXT,
      favorite_sport TEXT
    )
  `);
});
app.use('/api/files', fileRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.default = app;
