// dream/pages/api/buildrequest.js
import { MongoClient } from 'mongodb';

const { ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async (req, res) => {
  try {
    await client.connect();
    const database = client.db('dream');
    const sessionsCollection = database.collection('sessions');
    const clientCollection = database.collection('client');
    const buildRequestCollection = database.collection('buildrequest'); // Added buildrequest collection

    if (req.method === 'GET') {
      const sessionId = req.headers.authorization;

      if (!sessionId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const session = await sessionsCollection.findOne({ sessionId });

      if (session) {
        const userId = session.userId;
        const clientUser = await clientCollection.findOne({ _id: new ObjectId(userId) });

        if (clientUser) {
          res.status(200).json(clientUser);
        } else {
          res.status(404).json({ message: 'User not found' });
        }
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
        const { projectName, projectArea, projectTimeline, budgetRange } = req.body;

        const result = await buildRequestCollection.insertOne({
          userId: new ObjectId(userId),
          projectName,
          projectArea,
          projectTimeline,
          budgetRange,
          isPrimary:false,
          status:'not requested',
        });

        console.log('Build request saved:', result);

        res.status(200).json({ message: 'Build request created successfully' });
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