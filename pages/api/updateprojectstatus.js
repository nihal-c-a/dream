import { MongoClient, ObjectId } from "mongodb";

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async (req, res) => {
  try {
    await client.connect();
    const database = client.db('dream');
    const sessionsCollection = database.collection('sessions');
    const requestsCollection = database.collection('requests');
    const buildrequestCollection = database.collection('buildrequest');
    const clientCollection = database.collection('client');

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
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const acceptedProjects = await requestsCollection
        .find({ constructorId: userId, status: 'accepted' })
        .toArray();

      const enrichedAcceptedProjects = await Promise.all(acceptedProjects.map(async (project) => {
        const buildRequest = await buildrequestCollection.findOne({ _id: project.buildRequestId });
        const constructor = await clientCollection.findOne({ _id: project.userId });

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
    } else if (req.method === 'POST') {
      const { projectId, progress } = req.body;
        let npid=new ObjectId(projectId);
      // Update the progress in the database
      const result = await requestsCollection.updateOne(
        { _id: npid },
        { $set: { progress: parseInt(progress) } }
      );

      if (result.modifiedCount > 0) {
        res.status(200).json({ message: 'Progress updated successfully' });
      } else {
        res.status(404).json({ message: 'Project not found' });
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
