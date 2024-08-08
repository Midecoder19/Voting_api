const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await mongoose.connection.db.collection('users').dropIndex('email_1');
    console.log('Index removed');
    mongoose.connection.close();
  })
  .catch(err => console.error('MongoDB connection error:', err));
