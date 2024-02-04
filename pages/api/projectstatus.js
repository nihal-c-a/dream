// dream/pages/api/projectstatus.js
import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async (req, res) => {
  try {
    await client.connect();
    const database = client.db('dream');
    const sessionsCollection = database.collection('sessions');
    const requestsCollection = database.collection('requests');
    const buildrequestCollection = database.collection('buildrequest');
    const constructorCollection = database.collection('constructor');

    if (req.method === 'GET') {
      const sessionId = req.headers.authorization;

      if (!sessionId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const session = await sessionsCollection.findOne({ sessionId });

      if (!session) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const userId = session.userId;

      const acceptedProjects = await requestsCollection
        .find({ userId: userId, status: 'accepted' })
        .toArray();

      const enrichedAcceptedProjects = await Promise.all(acceptedProjects.map(async (project) => {
        const buildRequest = await buildrequestCollection.findOne({ _id: project.buildRequestId });
        const constructor = await constructorCollection.findOne({ _id: project.constructorId });

        return {
          ...project,
          projectName: buildRequest ? buildRequest.projectName : 'Unknown Project',
          projectArea: buildRequest ? buildRequest.projectArea : 'Unknown Area',
          projectTimeline: buildRequest ? buildRequest.projectTimeline : 'Unknown Timeline',
          budgetRange: buildRequest ? buildRequest.budgetRange : 'Unknown Budget',
          constructorName: constructor ? `${constructor.firstname} ${constructor.lastname}` : 'Unknown Constructor',
        };
      }));

      res.status(200).json({ acceptedProjects: enrichedAcceptedProjects });
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
