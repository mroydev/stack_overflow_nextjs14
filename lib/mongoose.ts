import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  // this is to prevent unknown field queries
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URI) {
    return console.log('MISSING MONGODB_URI');
  }

  if (isConnected) {
    return console.log('MongoDB is already connected');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'devFlow',
    });

    isConnected = true;

    console.log('MongoDB is connected');
  } catch (error) {
    console.log('MongoDB connection failed', error);
  }
};
