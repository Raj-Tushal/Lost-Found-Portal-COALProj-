import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';


import userRoutes from './routes/userRoutes.js';
import ItemRoutes from './routes/ItemRoutes.js';

const app = express();
dotenv.config();

// Check that the variable is loaded
console.log('Loaded MONGO_URI:', process.env.MONGO_URI);

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use('/users', userRoutes);
app.use('/Items', ItemRoutes);

const port = process.env.PORT || 4000;
const db = process.env.MONGO_URI;   // ✅ use the environment variable

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(port, () =>
      console.log('Connection done and running on PORT :' + port)
    )
  )
  .catch((err) => console.log(err.message));
