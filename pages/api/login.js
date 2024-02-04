import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      await client.connect();
      const database = client.db('dream');
      const clientCollection = database.collection('client');
      const constructorCollection = database.collection('constructor');

      const { email, password } = req.body;

      const clientUser = await clientCollection.findOne({ email, password });
      const constructorUser = await constructorCollection.findOne({ email, password });

      if (clientUser) {
        const sessionId = uuidv4();
        await database.collection('sessions').insertOne({ sessionId, userId: clientUser._id });

        res.status(200).json({ role: 'client', sessionId, userType: 'client' });
      } else if (constructorUser) {
        const sessionId = uuidv4();
        await database.collection('sessions').insertOne({ sessionId, userId: constructorUser._id });

        res.status(200).json({ role: 'constructor', sessionId, userType: 'constructor' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};