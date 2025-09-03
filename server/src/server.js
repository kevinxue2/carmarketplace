import express from "express";

// import cors from 'cors'

const app = express();

app.use(express.json());

app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://carmarketplace-d54d.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(204).end();
});

const allowedOrigins = [
  'http://localhost:5173',
  'https://carmarketplace-d54d.vercel.app'
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error('CORS not allowed for ' + origin));
    }
  },
  credentials: true
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

// export default app;