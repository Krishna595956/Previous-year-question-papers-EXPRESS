const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://krishnareddy:1234567890@diploma.1v5g6.mongodb.net/Eduvault'; // MongoDB URI
const client = new MongoClient(uri);

async function connectDB() {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client.db('Eduvault').collection('subjects');
}

async function insertSubject(collection, document) {
  try {
    const result = await collection.insertOne(document);
    return result;
  } catch (error) {
    throw new Error('Failed to insert document: ' + error.message);
  }
}

async function findOne(query) {
  try {
    const collection = await connectDB();
    return await collection.findOne(query);
  } catch (error) {
    throw new Error('Failed to find document: ' + error.message);
  }
}

module.exports = { insertSubject, findOne };
