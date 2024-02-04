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

    if (req.method === 'DELETE') {
      const sessionId = req.headers.authorization;

      if (!sessionId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const session = await sessionsCollection.findOne({ sessionId });

      if (session) {
        const userId = session.userId;
        const { buildRequestId } = req.body;

        // Check if the build request belongs to the current user
        const buildRequest = await buildRequestCollection.findOne({
          _id: new ObjectId(buildRequestId),
          userId: new ObjectId(userId),
        });

        if (buildRequest) {
          const result = await buildRequestCollection.deleteOne({ _id: new ObjectId(buildRequestId) });
          console.log('Build request deleted:', result);

          res.status(200).json({ message: 'Build request deleted successfully' });
        } else {
          res.status(404).json({ message: 'Build request not found' });
        }
      } else {
        res.status  (401).json({ message: 'Unauthorized' });
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
