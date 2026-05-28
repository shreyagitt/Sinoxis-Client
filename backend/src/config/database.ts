import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL; // using your env variable

if (!MONGO_URL) {
  throw new Error('❌ MONGO_URL is not defined in environment variables');
}

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGO_URL);
    console.log(`✅ MongoDB Connected`);

    // Handle connection errors
    mongoose.connection.on('error', (err) => {
      console.error('⚠️ MongoDB connection error:', err);
    });

    // Handle disconnections
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('⚠️ Error disconnecting from MongoDB:', error);
  }
};
