const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const inventoryRoutes = require('./routers/Inventoryrouter');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

const mongoURI = process.env.MONGO_URI 
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/inventory', inventoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
