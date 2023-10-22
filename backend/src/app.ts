import express, { Request, Response, NextFunction } from 'express';
import fileRoutes from './routes/fileRoutes';
import userRoutes from './routes/userRoutes';
import cors from 'cors';

const db = require('./db');
const app = express();
const port = 3000;


app.use(cors());


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

app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
