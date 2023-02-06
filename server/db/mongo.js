import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI; // update uri in .env file
const client = new MongoClient(uri);
let db;

export const connectDb = () => {
  try {
    client.connect();
    db = client.db(''); // insert db name
    console.log('Connected to MongoClient');
  } catch (err) {
    console.log(err);
  }
};

export const getDb = () => {
  return db;
};

export const getCol = async (collection) => {
  const db = await getDb();
  const col = db.collection(collection);
  return col;
};
