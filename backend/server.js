import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Server is running successfully!'
  });
});

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
 