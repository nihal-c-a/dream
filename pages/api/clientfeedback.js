// dream/pages/api/clientfeedback.js
import { MongoClient } from 'mongodb';

const { ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async (req, res) => {
  try {
    await client.connect();
    const database = client.db('dream');
    const sessionsCollection = database.collection('sessions');
    const constructorCollection = database.collection('constructor');
    const clientFeedbackCollection = database.collection('clientfeedback');

    if (req.method === 'GET') {
      const sessionId = req.headers.authorization;

      if (!sessionId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const session = await sessionsCollection.findOne({ sessionId });

      if (session) {
        const constructors = await constructorCollection.find().toArray();
        res.status(200).json({ constructors });
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    } else if (req.method === 'POST') {
      const sessionId = req.headers.authorization;

      if (!sessionId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const session = await sessionsCollection.findOne({ sessionId });

      if (session) {
        const userId = session.userId;
        const { constructorId, experience, rating } = req.body;

        // Check if the constructorId exists in the constructor collection
        const constructor = await constructorCollection.findOne({ _id: new ObjectId(constructorId) });
        if (!constructor) {
          res.status(404).json({ message: 'Constructor not found' });
          return;
        }

        const result = await clientFeedbackCollection.insertOne({
          userId,
          constructorId: new ObjectId(constructorId),
          experience,
          rating,
        });

        console.log('Client feedback saved:', result);

        res.status(200).json({ message: 'Client feedback submitted successfully' });
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  } finally {
    await client.close();
  }
};
