// Import the mongoose module
import mongoose, { ConnectOptions } from 'mongoose';
import { logger, env } from './';
import dotenv from 'dotenv';
dotenv.config();

// Configure mongoose's promise to global promise
mongoose.Promise = global.Promise;

// Set up default mongoose connection
const mongoPath = `mongodb+srv://${encodeURIComponent(env('DATABASE_USER'))}:${encodeURIComponent(env('DATABASE_PASSWORD'))}@${encodeURIComponent(
  env('DATABASE_HOST'),
)}/${env('DATABASE_NAME')}?retryWrites=true&w=majority`;
const options: ConnectOptions = {
  maxPoolSize: 25,
  ssl: true,
  socketTimeoutMS: 30000,
};
mongoose.connect(mongoPath, options);

const db = mongoose.connection;
db.on('connected', async function () {
  // we're connected!
  logger.info(`Vegeel Database connected`);
});

// Bind connection to error event (to get notification of connection errors)
db.on('error', async function () {
  logger.error(`MongoDB connection error: ${console.error}`);
});

process.on('SIGINT', () => {
  console.log('Mongoose disconnected from MongoDB');
  db.close();
  process.exit(0);
});

export default mongoose;
