const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb+srv://krishnareddy:1234567890@diploma.1v5g6.mongodb.net/');
const db = client.db('Eduvault');
const collection = db.collection('users');


// Insert a single document
async function insertOne(document) {
  try {
    await client.connect();
    const result = await collection.insertOne(document);
    console.log('Document inserted:', result.insertedId);
    return result;
  } catch (error) {
    console.error('Error inserting document:', error);
  } finally {
    await client.close();
  }
}

// Insert multiple documents
async function insertMany(documents) {
  try {
    await client.connect();
    const result = await collection.insertMany(documents);
    console.log('Documents inserted:', result.insertedCount);
    return result;
  } catch (error) {
    console.error('Error inserting documents:', error);
  } finally {
    await client.close();
  }
}

// Find documents
async function find(query = {}) {
  try {
    await client.connect();
    const result = await collection.find(query).toArray();
    console.log('Documents found:', result.length);
    return result;
  } catch (error) {
    console.error('Error finding documents:', error);
  } finally {
    await client.close();
  }
}

// Find a single document
async function findOne(query) {
  try {
    await client.connect();
    const result = await collection.findOne(query);
    console.log('Document found:', result);
    return result;
  } catch (error) {
    console.error('Error finding document:', error);
  } finally {
    await client.close();
  }
}

// Update a document
async function updateOne(filter, update) {
  try {
    await client.connect();
    const result = await collection.updateOne(filter, { $set: update });
    console.log('Document updated:', result.modifiedCount);
    return result;
  } catch (error) {
    console.error('Error updating document:', error);
  } finally {
    await client.close();
  }
}

// Delete a document
async function deleteOne(filter) {
  try {
    await client.connect();
    const result = await collection.deleteOne(filter);
    console.log('Document deleted:', result.deletedCount);
    return result;
  } catch (error) {
    console.error('Error deleting document:', error);
  } finally {
    await client.close();
  }
}

// Delete multiple documents
async function deleteMany(filter) {
  try {
    await client.connect();
    const result = await collection.deleteMany(filter);
    console.log('Documents deleted:', result.deletedCount);
    return result;
  } catch (error) {
    console.error('Error deleting documents:', error);
  } finally {
    await client.close();
  }
}

// Exporting CRUD operations
module.exports = {
  insertOne,
  insertMany,
  find,
  findOne,
  updateOne,
  deleteOne,
  deleteMany,
};
