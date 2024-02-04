// Import necessary modules and dependencies
import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async (req, res) => {
  try {
    await client.connect();
    const database = client.db('dream');
    const sessionsCollection = database.collection('sessions');
    const constructorCollection = database.collection('constructor');
    const clientFeedbackCollection = database.collection('clientfeedback'); // Add this line

    if (req.method === 'GET') {
      const sessionId = req.headers.authorization;

      if (!sessionId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const session = await sessionsCollection.findOne({ sessionId });

      if (session) {
        const userId = session.userId;
        const constructor = await constructorCollection.findOne({ _id: userId });

        if (constructor) {
          const constructorName = `${constructor.firstname} ${constructor.lastname}`;

          // Fetch feedbacks for the constructor from clientfeedback collection
          const feedbacks = await clientFeedbackCollection.find({ constructorId: userId }).toArray();

          res.status(200).json({ constructorName, feedbacks });
        } else {
          res.status(404).json({ message: 'Constructor not found' });
        }
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
