const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config(); 
const userRoutes = require('./routes/userRoutes');
const trainRoutes = require('./routes/trainRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
console.log("MongoDB URI:", process.env.MONGO_URI);
console.log("Port:", process.env.PORT);
console.log('Profile routes registered at /api/profiles');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));
app.use('/api/auth', userRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/tickets', bookingRoutes); 
app.use('/api/tickets', ticketRoutes); 
app.use('/api/bookings', bookingRoutes);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ error: 'Validation error', details: err.message });
  }
  res.status(500).json({ error: 'Something went wrong!' });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
