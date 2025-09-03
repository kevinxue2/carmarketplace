import express from "express";

import cors from 'cors'

const app = express();

app.use(express.json());

const allowedOrigin = process.env.NODE_ENV === 'production' 
  ? 'https://carmarketplace-d54d.vercel.app'
  : 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigin, // frontend URL
  credentials: true, // if you send cookies or auth headers
}));

app.get("/", (_, response) =>
  response.json({ info: "Express app with Supabase" })
);

app.listen(3001, () =>
  console.log(
    new Date().toLocaleTimeString() + `: Server is running on port ${3001}...`
  )
);

import {authRoutes} from './routes/auth.routes.js';
// const userRoutes = require('./routes/user.routes');
// const adminRoutes = require('./routes/admin.routes');
import {listingRoutes} from './routes/listing.routes.js';
import {filterRoutes} from './routes/filter.routes.js';

app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/admin', adminRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/filter', filterRoutes);