const mongoose = require('mongoose');

// Replace this with your actual string from Atlas
const dbURI = 'mongodb+srv://mri08:123@cluster0.oddaz2e.mongodb.net/orbitDB';

mongoose.connect(dbURI)
  .then(() => console.log('Connected to Atlas successfully!'))
  .catch((err) => console.error('Connection error:', err));