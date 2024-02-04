import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async (req, res) => {
  try {
    await client.connect();
    const database = client.db('dream');
    const sessionsCollection = database.collection('sessions');
    const clientFeedbackCollection = database.collection('clientfeedback');
    const clientCollection = database.collection('client');

    if (req.method === 'GET') {
      const sessionId = req.headers.authorization;

      if (!sessionId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const session = await sessionsCollection.findOne({ sessionId });

      if (session) {
        const constructorId = session.userId;

        const feedbackList = await clientFeedbackCollection.find({ constructorId }).toArray();

        const feedbacksWithClientNames = await Promise.all(
          feedbackList.map(async (feedback) => {
            const client = await clientCollection.findOne({ _id: feedback.userId });
            return {
              ...feedback,
              clientName: `${client.firstname} ${client.lastname}`,
            };
          })
        );

        res.status(200).json({ feedbackList: feedbacksWithClientNames });
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
