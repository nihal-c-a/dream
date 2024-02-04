// dream/pages/api/clientregister.js
import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      await client.connect();
      const database = client.db('dream'); // Replace with your database name
      const collection = database.collection('constructor'); // Replace with your collection name

      const { firstname, lastname, email, password, phoneno, address, exp, proj } = req.body;

      const result = await collection.insertOne({
        firstname,
        lastname,
        email,
        password, // Note: In a real application, you should hash and salt passwords before storing
        phoneno,
        address,
        exp,
        proj,
      });
      let a=result.insertedCount;
      if (result.insertedId) {
        res.status(201).json({ message: 'Registration successful!' });
      } else {
        res.status(500).json({ message: a });
      }
    } catch (error) {
      console.error('An error occurred during registration:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};