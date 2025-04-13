const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const shortenRoutes = require('./routes/shorten');
const analyticsRoutes = require('./routes/analytics');
const redirectRoutes = require("./routes/redirect");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);


app.use('/r',redirectRoutes);
app.use('/auth', authRoutes);
app.use('/shorten', shortenRoutes);
app.use('/analytics', analyticsRoutes); 



app.listen(5000, () => console.log("Server running on http://localhost:5000"));
