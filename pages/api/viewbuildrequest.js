import { MongoClient } from 'mongodb';

const { ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async (req, res) => {
  try {
    await client.connect();
    const database = client.db('dream');
    const sessionsCollection = database.collection('sessions');
    const buildRequestCollection = database.collection('buildrequest');

    if (req.method === 'GET') {
      const sessionId = req.headers.authorization;

      if (!sessionId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const session = await sessionsCollection.findOne({ sessionId });

      if (session) {
        const userId = session.userId;
        const buildRequests = await buildRequestCollection.find({ userId }).toArray();

        res.status(200).json({ buildRequests });
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    } else if (req.method === 'PUT') {
      const sessionId = req.headers.authorization;

      if (!sessionId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const session = await sessionsCollection.findOne({ sessionId });

      if (session) {
        const userId = session.userId;
        const { buildRequestId } = req.body;

        // Set all build requests of the user to not primary
        await buildRequestCollection.updateMany({ userId }, { $set: { isPrimary: false } });

        // Set the selected build request as primary
        const result = await buildRequestCollection.updateOne(
          { _id: new ObjectId(buildRequestId), userId },
          { $set: { isPrimary: true } }
        );

        console.log('Build request set as primary:', result);

        res.status(200).json({ message: 'Build request set as primary successfully' });
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
